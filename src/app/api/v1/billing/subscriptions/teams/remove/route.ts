import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getUserSubscription } from '@/prisma/queries/subscription-queries';
import { removeTeamFromSubscription } from '@/prisma/commands/subscription-commands';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/subscriptions/teams/remove
 *
 * Remove a team from user's subscription
 * Body: { scopeId: number }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scopeId } = body;

    if (!scopeId) {
      return NextResponse.json(
        { error: 'scopeId is required' },
        { status: 400 }
      );
    }

    const numericScopeId = parseInt(scopeId.toString());
    if (isNaN(numericScopeId)) {
      return NextResponse.json({ error: 'Invalid scopeId' }, { status: 400 });
    }

    // Get user's subscription
    const subscription = await getUserSubscription(session.user.id);

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Check if team is in subscription
    const teamInSubscription = subscription.teams.find(
      (t) => t.scopeId === numericScopeId
    );

    if (!teamInSubscription) {
      return NextResponse.json(
        { error: 'Team is not in your subscription' },
        { status: 400 }
      );
    }

    // Remove team from subscription
    await removeTeamFromSubscription(numericScopeId);

    console.log('Team removed from subscription:', numericScopeId);

    return NextResponse.json({
      success: true,
      message: 'Team removed from subscription',
    });
  } catch (error) {
    console.error('Remove team error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to remove team',
      },
      { status: 500 }
    );
  }
}
