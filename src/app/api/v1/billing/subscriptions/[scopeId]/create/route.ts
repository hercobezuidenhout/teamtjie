import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { createSubscription } from '@/prisma/commands/subscription-commands';
import { BILLING_CONFIG } from '@/config/billing';
import prisma from '@/prisma/prisma';
import { SubscriptionStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/subscriptions/[scopeId]/create
 *
 * Initialize a user-level subscription payment (creates PENDING subscription)
 * Called before showing Paystack popup from team billing page
 * Note: scopeId parameter is just for context, subscription is user-level
 */
export async function POST(
  _request: NextRequest,
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

    // Check if user has access to this scope (context check)
    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: 'Forbidden - no access to this scope' },
        { status: 403 }
      );
    }

    // Check if user already has a subscription
    const existing = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      if (existing.status === SubscriptionStatus.ACTIVE) {
        return NextResponse.json(
          { error: 'You already have an active Teamtjie+ subscription', hasExisting: true },
          { status: 400 }
        );
      }

      // If PENDING or FAILED, return existing reference to retry
      return NextResponse.json({
        success: true,
        reference: existing.reference,
        subscriptionId: existing.id,
        isRetry: true,
      });
    }

    // Generate unique reference (using userId instead of scopeId)
    const reference = `sub_user_${session.user.id.substring(0, 8)}_${Date.now()}`;

    // Create USER-LEVEL subscription in PENDING state
    const subscription = await createSubscription({
      userId: session.user.id,
      reference,
      amount: BILLING_CONFIG.price.monthly,
      currency: BILLING_CONFIG.price.currency,
      billingCycle: 'monthly',
      subscriptionType: 'TEAMTJIE_PLUS',
    });

    console.log('User subscription created:', subscription.id, reference);

    return NextResponse.json({
      success: true,
      reference,
      subscriptionId: subscription.id,
      contextScopeId: scopeId, // For team selection modal
      isRetry: false,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create subscription',
      },
      { status: 500 }
    );
  }
}

