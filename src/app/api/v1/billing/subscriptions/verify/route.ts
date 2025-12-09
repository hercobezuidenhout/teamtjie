import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import {
  verifyPaystackPayment,
  validatePaymentAmount,
  isPaymentSuccessful,
  extractPaystackMetadata,
  calculateNextBillingDate,
  subscribeCustomerToPlan,
  PaystackError,
} from '@/utils/paystack';
import { getSubscriptionByReference } from '@/prisma/queries/subscription-queries';
import {
  activateSubscription,
  createSubscriptionTransaction,
} from '@/prisma/commands/subscription-commands';
import { SubscriptionStatus, TransactionType } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/subscriptions/verify
 *
 * Verify payment and activate user-level subscription
 * Called from frontend after Paystack payment succeeds
 * Note: Does NOT add teams - that happens via team selection modal
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'reference is required' },
        { status: 400 }
      );
    }

    // Find subscription by reference
    const subscription = await getSubscriptionByReference(reference);

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Check if already activated
    if (subscription.status === SubscriptionStatus.ACTIVE) {
      console.log('Subscription already active:', subscription.id);
      return NextResponse.json({
        success: true,
        message: 'Subscription already active',
        subscription: {
          id: subscription.id,
          status: subscription.status,
        },
      });
    }

    // Verify payment with Paystack API
    let paymentVerification;
    try {
      paymentVerification = await verifyPaystackPayment(reference);
    } catch (error) {
      console.error('Payment verification failed:', error);
      return NextResponse.json(
        { error: 'Failed to verify payment with Paystack' },
        { status: 400 }
      );
    }

    const paymentData = paymentVerification.data;

    // Validate payment is successful
    if (!isPaymentSuccessful(paymentData)) {
      return NextResponse.json(
        { error: 'Payment was not successful' },
        { status: 400 }
      );
    }

    // Validate amount
    if (!validatePaymentAmount(paymentData.amount)) {
      console.error('Invalid payment amount:', paymentData.amount);
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // Extract metadata
    const metadata = extractPaystackMetadata(paymentData);

    // Subscribe customer to Paystack Plan for recurring billing
    let subscriptionResponse;
    try {
      subscriptionResponse = await subscribeCustomerToPlan(
        paymentData.customer.customer_code,
        paymentData.customer.email
      );
      console.log('Customer subscribed to plan:', subscriptionResponse.data.subscription_code);
    } catch (error) {
      console.error('Failed to subscribe to plan:', error);
      // Continue anyway - we'll activate subscription but without recurring
      // This is better than failing completely
    }

    // Calculate billing period
    const { periodStart, periodEnd } = calculateNextBillingDate();

    // Activate subscription
    await activateSubscription({
      subscriptionId: subscription.id,
      externalCustomerId: paymentData.customer.customer_code,
      externalSubscriptionId: subscriptionResponse?.data.subscription_code,
      periodStart,
      periodEnd,
    });

    // Create transaction record
    await createSubscriptionTransaction({
      subscriptionId: subscription.id,
      type: TransactionType.PAYMENT_COMPLETE,
      amount: paymentData.amount / 100, // Convert kobo to rand
      currency: paymentData.metadata?.currency || 'ZAR',
      externalPaymentId: reference,
      externalMetadata: paymentData,
      processedAt: new Date(paymentData.paid_at),
    });

    console.log('User subscription activated:', subscription.id);

    return NextResponse.json({
      success: true,
      message: 'Subscription activated - select teams to activate premium features',
      subscription: {
        id: subscription.id,
        status: SubscriptionStatus.ACTIVE,
        periodEnd,
      },
      showTeamSelection: true, // Signal frontend to show team selection modal
    });
  } catch (error) {
    console.error('Verify subscription error:', error);

    if (error instanceof PaystackError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to verify subscription',
      },
      { status: 500 }
    );
  }
}
