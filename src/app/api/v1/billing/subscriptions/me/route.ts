import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getUserSubscription } from '@/prisma/queries/subscription-queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/billing/subscriptions/me
 *
 * Get current user's subscription with included teams
 * Used by user billing page
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
          hasSubscription: false,
          subscription: null,
        },
        { status: 200 }
      );
    }

    // Return subscription with teams
    return NextResponse.json({
      hasSubscription: subscription.status === 'ACTIVE',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        subscriptionType: subscription.subscriptionType,
        amount: subscription.amount,
        currency: subscription.currency,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        createdAt: subscription.createdAt,
        externalSubscriptionId: subscription.externalSubscriptionId,
        externalCustomerId: subscription.externalCustomerId,
        teams: subscription.teams.map((t) => ({
          id: t.id,
          scopeId: t.scopeId,
          scopeName: t.scope.name,
          scopeType: t.scope.type,
          addedAt: t.addedAt,
        })),
        teamCount: subscription.teams.length,
      },
    });
  } catch (error) {
    console.error('Get user subscription error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get subscription',
      },
      { status: 500 }
    );
  }
}
