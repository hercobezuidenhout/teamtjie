import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getUserSubscription } from '@/prisma/queries/subscription-queries';
import { cancelSubscription } from '@/prisma/commands/subscription-commands';
import { cancelPaystackSubscription } from '@/utils/paystack';
import { SubscriptionStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/subscriptions/[scopeId]/cancel
 *
 * Cancel user's subscription
 * Body: { immediate?: boolean }
 * Note: scopeId is ignored, cancels user's subscription
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { scopeId: string } }
) {
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

    // Parse request body
    const body = await request.json();
    const immediate = body.immediate === true;

    // Cancel with Paystack if we have a subscription code
    if (subscription.externalSubscriptionId) {
      try {
        const result = await cancelPaystackSubscription(
          subscription.externalSubscriptionId
        );

        if (!result.success) {
          console.error('Paystack cancellation failed:', result.message, result.paystackResponse);
          // Continue anyway - we can still cancel in our system
        } else {
          console.log('Paystack subscription cancelled successfully:', {
            subscriptionCode: subscription.externalSubscriptionId,
            paystackResponse: result.paystackResponse,
          });
        }
      } catch (error) {
        console.error('Error calling Paystack cancel:', error);
        // Continue anyway - we can still cancel in our system
      }
    }

    // Update subscription in our database
    await cancelSubscription(subscription.id, !immediate);

    return NextResponse.json({
      success: true,
      immediate,
      message: immediate
        ? 'Subscription cancelled immediately'
        : 'Subscription will cancel at period end',
      activeUntil: immediate ? null : subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to cancel subscription',
      },
      { status: 500 }
    );
  }
}
