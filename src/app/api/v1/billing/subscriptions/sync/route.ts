import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getUserSubscription } from '@/prisma/queries/subscription-queries';
import { getCustomerSubscriptions } from '@/utils/paystack';
import { BILLING_CONFIG } from '@/config/billing';
import prisma from '@/prisma/prisma';
import { SubscriptionStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/subscriptions/sync
 *
 * Sync missing externalSubscriptionId from Paystack
 * Useful for fixing subscriptions that didn't get the ID during initial setup
 */
export async function POST(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription
    const subscription = await getUserSubscription(session.user.id);

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 400 }
      );
    }

    // If already has externalSubscriptionId, no need to sync
    if (subscription.externalSubscriptionId) {
      return NextResponse.json({
        success: true,
        message: 'Subscription already synced',
        subscriptionCode: subscription.externalSubscriptionId,
        alreadySynced: true,
      });
    }

    // Must have customer code to query Paystack
    if (!subscription.externalCustomerId) {
      return NextResponse.json(
        { error: 'No customer code found. Cannot sync with Paystack.' },
        { status: 400 }
      );
    }

    console.log('Fetching Paystack subscriptions for customer:', subscription.externalCustomerId);

    // Fetch subscriptions from Paystack
    const paystackSubscriptions = await getCustomerSubscriptions(
      subscription.externalCustomerId
    );

    if (!paystackSubscriptions.status || !paystackSubscriptions.data) {
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions from Paystack' },
        { status: 500 }
      );
    }

    console.log('Found subscriptions:', paystackSubscriptions.data.length);

    // Find active subscription for our plan
    const planCode = BILLING_CONFIG.paystack.planCode;
    const activeSubscription = paystackSubscriptions.data.find(
      (sub: { plan?: { plan_code: string }; status: string }) =>
        sub.plan?.plan_code === planCode &&
        (sub.status === 'active' || sub.status === 'non-renewing')
    );

    if (!activeSubscription) {
      return NextResponse.json(
        {
          error: 'No active Paystack subscription found for this customer',
          availableSubscriptions: paystackSubscriptions.data.map((s: { subscription_code: string; status: string; plan?: { plan_code: string } }) => ({
            code: s.subscription_code,
            status: s.status,
            plan: s.plan?.plan_code,
          })),
        },
        { status: 404 }
      );
    }

    console.log('Found active subscription:', activeSubscription.subscription_code);

    // Update database with subscription code
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        externalSubscriptionId: activeSubscription.subscription_code,
        externalMetadata: {
          ...(subscription.externalMetadata && typeof subscription.externalMetadata === 'object' ? subscription.externalMetadata : {}),
          email_token: activeSubscription.email_token,
          next_payment_date: activeSubscription.next_payment_date,
          synced_at: new Date().toISOString(),
        },
      },
    });

    console.log('Database updated with subscription code');

    return NextResponse.json({
      success: true,
      message: 'Subscription synced successfully',
      subscriptionCode: activeSubscription.subscription_code,
      paystackStatus: activeSubscription.status,
      nextPaymentDate: activeSubscription.next_payment_date,
    });
  } catch (error) {
    console.error('Sync subscription error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to sync subscription',
      },
      { status: 500 }
    );
  }
}
