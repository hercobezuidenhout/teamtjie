import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';
import { requireSubscription, SubscriptionRequiredError } from '@/utils/require-subscription';

export const dynamic = 'force-dynamic';

// GET /api/sentiments?scopeId={id}&date={YYYY-MM-DD}
// Returns user's latest sentiment for specified date (defaults to today)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const scopeId = searchParams.get('scopeId');
    const dateParam = searchParams.get('date');

    if (!scopeId) {
      return NextResponse.json(
        { error: 'scopeId is required' },
        { status: 400 }
      );
    }

    const numericScopeId = parseInt(scopeId, 10);
    if (isNaN(numericScopeId)) {
      return NextResponse.json(
        { error: 'Invalid scopeId' },
        { status: 400 }
      );
    }

    // Check if user has access to this scope
    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId: numericScopeId,
      },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check subscription (Premium feature)
    try {
      await requireSubscription(numericScopeId, session.user.id);
    } catch (error) {
      if (error instanceof SubscriptionRequiredError) {
        return NextResponse.json(
          { error: error.message, requiresSubscription: true },
          { status: 402 }
        );
      }
      throw error;
    }

    // Parse date or default to today
    const queryDate = dateParam ? new Date(dateParam) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    // Get the latest sentiment for the date
    const sentiment = await prisma.dailySentiment.findFirst({
      where: {
        userId: session.user.id,
        scopeId: numericScopeId,
        date: queryDate,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(sentiment);
  } catch (error) {
    console.error('Error fetching sentiment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/sentiments
// Creates a new sentiment entry
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scopeId, sentiment, note } = body;

    if (!scopeId || sentiment === undefined) {
      return NextResponse.json(
        { error: 'scopeId and sentiment are required' },
        { status: 400 }
      );
    }

    const numericScopeId = parseInt(scopeId, 10);
    const numericSentiment = parseInt(sentiment, 10);

    if (isNaN(numericScopeId) || isNaN(numericSentiment)) {
      return NextResponse.json(
        { error: 'Invalid scopeId or sentiment' },
        { status: 400 }
      );
    }

    if (numericSentiment < 1 || numericSentiment > 5) {
      return NextResponse.json(
        { error: 'Sentiment must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has access to this scope
    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId: numericScopeId,
      },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check subscription (Premium feature)
    try {
      await requireSubscription(numericScopeId, session.user.id);
    } catch (error) {
      if (error instanceof SubscriptionRequiredError) {
        return NextResponse.json(
          { error: error.message, requiresSubscription: true },
          { status: 402 }
        );
      }
      throw error;
    }

    // Get today's date (date only, no time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create new sentiment
    const dailySentiment = await prisma.dailySentiment.create({
      data: {
        userId: session.user.id,
        scopeId: numericScopeId,
        date: today,
        sentiment: numericSentiment,
        note: note || null,
      },
    });

    return NextResponse.json(dailySentiment);
  } catch (error) {
    console.error('Error saving sentiment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
