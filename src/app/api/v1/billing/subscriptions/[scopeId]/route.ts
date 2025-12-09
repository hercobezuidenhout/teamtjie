import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getTeamSubscriptionStatus, hasActiveSubscription } from '@/prisma/queries/subscription-queries';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/billing/subscriptions/[scopeId]
 *
 * Get subscription status for a specific team
 * Returns whether this team has premium access and whose subscription provides it
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { scopeId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scopeId = parseInt(params.scopeId);
    if (isNaN(scopeId)) {
      return NextResponse.json({ error: 'Invalid scopeId' }, { status: 400 });
    }

    // Check if user has access to this scope
    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId,
      },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if current user has active subscription covering this team
    const userHasAccess = await hasActiveSubscription(scopeId, session.user.id);

    // Get team subscription status (to show whose subscription covers it)
    const teamSubscription = await getTeamSubscriptionStatus(scopeId);

    return NextResponse.json({
      hasSubscription: userHasAccess,
      subscription: teamSubscription
        ? {
            id: teamSubscription.subscription.id,
            status: teamSubscription.subscription.status,
            subscribedBy: {
              id: teamSubscription.subscription.user.id,
              name: teamSubscription.subscription.user.name,
              email: teamSubscription.subscription.user.email,
            },
            addedAt: teamSubscription.addedAt,
          }
        : null,
    });
  } catch (error) {
    console.error('Get team subscription error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get subscription',
      },
      { status: 500 }
    );
  }
}

