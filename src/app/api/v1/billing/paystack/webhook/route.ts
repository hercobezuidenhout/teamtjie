import { NextRequest, NextResponse } from 'next/server';
import {
  parsePaystackWebhook,
  extractPaystackMetadata,
  calculateNextBillingDate,
  validatePaymentAmount,
  isPaymentSuccessful,
} from '@/utils/paystack';
import { getSubscriptionByReference } from '@/prisma/queries/subscription-queries';
import {
  activateSubscription,
  createSubscriptionTransaction,
  updateSubscriptionStatus,
  updateSubscriptionPeriod,
} from '@/prisma/commands/subscription-commands';
import { SubscriptionStatus, TransactionType } from '@prisma/client';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/paystack/webhook
 *
 * Handles Paystack webhook events
 * Events: subscription.create, charge.success, subscription.disable
 */
export async function POST(request: NextRequest) {
  try {
    // Get signature from header
    const signature = request.headers.get('x-paystack-signature');
    if (!signature) {
      console.error('Webhook missing signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Get raw body
    const body = await request.text();

    // Parse and verify webhook
    const { valid, event, error } = parsePaystackWebhook(body, signature);

    if (!valid || !event) {
      console.error('Invalid webhook:', error);
      return NextResponse.json(
        { error: error || 'Invalid webhook' },
        { status: 400 }
      );
    }

    // Log webhook event
    console.log('Paystack webhook received:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event);
        break;

      case 'subscription.create':
        await handleSubscriptionCreate(event);
        break;

      case 'subscription.disable':
        await handleSubscriptionDisable(event);
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);

    // Return 200 to prevent Paystack from retrying
    // But log the error for investigation
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Still return 200 to acknowledge receipt
    );
  }
}

/**
 * Handle successful payment (initial or recurring)
 */
async function handleChargeSuccess(event: PaystackWebhookEvent) {
  const { data } = event;
  const reference = data.reference;

  // Verify payment is actually successful
  if (!isPaymentSuccessful(data)) {
    console.error('Payment not successful:', reference);
    return;
  }

  // Validate amount
  if (!validatePaymentAmount(data.amount)) {
    console.error('Invalid payment amount:', data.amount, 'expected:', 9900);
    return;
  }

  // Extract metadata
  const metadata = extractPaystackMetadata(data);

  // Try to find subscription by reference first (initial payment)
  let subscription = await getSubscriptionByReference(reference);

  // If not found by reference, try by subscription code (recurring payment)
  if (!subscription && metadata.subscriptionCode) {
    subscription = await prisma.subscription.findUnique({
      where: { externalSubscriptionId: metadata.subscriptionCode },
    });
  }

  if (!subscription) {
    console.error('Subscription not found for reference:', reference);
    return;
  }

  // Handle based on current status
  if (subscription.status === SubscriptionStatus.PENDING) {
    // Initial payment - activate subscription
    const { periodStart, periodEnd } = calculateNextBillingDate();

    await activateSubscription({
      subscriptionId: subscription.id,
      externalCustomerId: metadata.customerCode,
      externalSubscriptionId: metadata.subscriptionCode,
      periodStart,
      periodEnd,
    });

    console.log('Subscription activated via webhook:', subscription.id);
  } else if (subscription.status === SubscriptionStatus.ACTIVE) {
    // Recurring payment - extend billing period
    if (subscription.currentPeriodEnd) {
      const { periodStart, periodEnd } = calculateNextBillingDate(
        subscription.currentPeriodEnd
      );

      await updateSubscriptionPeriod(subscription.id, periodStart, periodEnd);

      console.log('Subscription period extended:', subscription.id);
    } else {
      console.log('Subscription already active, no period to extend:', subscription.id);
    }
  }

  // Create transaction record
  await createSubscriptionTransaction({
    subscriptionId: subscription.id,
    type: TransactionType.PAYMENT_COMPLETE,
    amount: data.amount / 100, // Convert kobo to rand
    currency: data.metadata?.currency || 'ZAR',
    externalPaymentId: reference,
    externalMetadata: data,
    processedAt: new Date(data.paid_at),
  });
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreate(event: PaystackWebhookEvent) {
  const { data } = event;
  const subscriptionCode = data.subscription?.subscription_code;

  if (!subscriptionCode) {
    console.error('No subscription code in event');
    return;
  }

  const metadata = extractPaystackMetadata(data);

  // Find subscription by customer code
  if (metadata.customerCode) {
    const subscription = await prisma.subscription.findFirst({
      where: { externalCustomerId: metadata.customerCode },
    });

    if (subscription && !subscription.externalSubscriptionId) {
      // Update with subscription code
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { externalSubscriptionId: subscriptionCode },
      });

      console.log('Subscription code updated:', subscription.id, subscriptionCode);
    }
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDisable(event: PaystackWebhookEvent) {
  const { data } = event;
  const subscriptionCode = data.subscription?.subscription_code;

  if (!subscriptionCode) {
    console.error('No subscription code in cancellation event');
    return;
  }

  // Find subscription by external ID
  const subscription = await prisma.subscription.findUnique({
    where: { externalSubscriptionId: subscriptionCode },
  });

  if (!subscription) {
    console.error('Subscription not found:', subscriptionCode);
    return;
  }

  // Update status to cancelled
  await updateSubscriptionStatus(subscription.id, SubscriptionStatus.CANCELLED);

  // Create transaction record
  await createSubscriptionTransaction({
    subscriptionId: subscription.id,
    type: TransactionType.SUBSCRIPTION_CANCELLED,
    amount: 0,
    currency: subscription.currency,
    externalPaymentId: subscriptionCode,
    externalMetadata: data,
    processedAt: new Date(),
  });

  console.log('Subscription cancelled:', subscription.id);
}
