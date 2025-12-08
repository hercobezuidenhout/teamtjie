import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';

// GET /api/sentiments/average?scopeId={id}&date={YYYY-MM-DD}
// Returns average sentiment for scope on date
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

    // Check if user is admin OR settings allow member visibility
    const isAdmin = userRole.role === 'ADMIN';
    const settings = await prisma.scopeSettings.findUnique({
      where: { scopeId: numericScopeId },
    });

    if (!isAdmin && !settings?.showAverageSentiment) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse date or default to today
    const queryDate = dateParam ? new Date(dateParam) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    // Calculate average
    const sentiments = await prisma.dailySentiment.findMany({
      where: {
        scopeId: numericScopeId,
        date: queryDate,
      },
      select: {
        sentiment: true,
      },
    });

    if (sentiments.length === 0) {
      return NextResponse.json({
        average: null,
        count: 0,
        date: queryDate,
      });
    }

    const sum = sentiments.reduce((acc, s) => acc + s.sentiment, 0);
    const average = sum / sentiments.length;

    return NextResponse.json({
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      count: sentiments.length,
      date: queryDate,
    });
  } catch (error) {
    console.error('Error fetching average sentiment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
