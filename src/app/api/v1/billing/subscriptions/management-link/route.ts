import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getUserSubscription } from '@/prisma/queries/subscription-queries';
import { generateSubscriptionManagementLink } from '@/utils/paystack';
import { SubscriptionStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/billing/subscriptions/management-link
 *
 * Get Paystack management link for user's subscription
 * This link allows users to manage their subscription (cancel, update payment, etc.) on Paystack's hosted page
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription
    const subscription = await getUserSubscription(session.user.id);

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'No subscription found',
          message: 'You do not have an active subscription.',
        },
        { status: 404 }
      );
    }

    // Check if subscription is active
    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscription not active',
          message: 'Your subscription is not currently active.',
        },
        { status: 400 }
      );
    }

    // Check if subscription is linked to Paystack
    if (!subscription.externalSubscriptionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscription not linked',
          message: 'Your subscription is not linked to Paystack. Please sync your subscription first.',
        },
        { status: 400 }
      );
    }

    // Generate management link
    const result = await generateSubscriptionManagementLink(
      subscription.externalSubscriptionId
    );

    if (!result.success || !result.link) {
      console.error('Failed to generate management link:', result.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate link',
          message: result.message || 'Unable to generate management link. Please try again or contact support.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      link: result.link,
      message: 'Management link generated successfully',
    });
  } catch (error) {
    console.error('Get management link error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get management link',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
