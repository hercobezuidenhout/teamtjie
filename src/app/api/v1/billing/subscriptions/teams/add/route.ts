import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getUserSubscription, canAddTeamToSubscription } from '@/prisma/queries/subscription-queries';
import { addTeamToSubscription } from '@/prisma/commands/subscription-commands';
import { SubscriptionStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/subscriptions/teams/add
 *
 * Add a team to user's subscription (max 3 teams)
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
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 400 }
      );
    }

    // Validate can add team
    const validation = await canAddTeamToSubscription(
      subscription.id,
      numericScopeId,
      session.user.id
    );

    if (!validation.canAdd) {
      const errorMessages = {
        MAX_TEAMS_REACHED: 'Maximum 3 teams reached. Remove a team to add another.',
        NOT_ADMIN: 'You must be an admin of this team to add it to your subscription.',
        TEAM_ALREADY_SUBSCRIBED: 'This team is already included in another subscription.',
      };

      return NextResponse.json(
        { error: errorMessages[validation.reason as keyof typeof errorMessages] || 'Cannot add team' },
        { status: 400 }
      );
    }

    // Add team to subscription
    await addTeamToSubscription({
      subscriptionId: subscription.id,
      scopeId: numericScopeId,
      addedBy: session.user.id,
    });

    console.log('Team added to subscription:', numericScopeId);

    return NextResponse.json({
      success: true,
      message: 'Team added to subscription',
    });
  } catch (error) {
    console.error('Add team error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to add team',
      },
      { status: 500 }
    );
  }
}
