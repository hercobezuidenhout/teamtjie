import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

// GET /api/insights/sentiment?scopeId={id}&from={YYYY-MM-DD}&to={YYYY-MM-DD}
// Returns sentiment data for date range
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const scopeId = searchParams.get('scopeId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!scopeId || !from || !to) {
      return NextResponse.json(
        { error: 'scopeId, from, and to are required' },
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

    // Check if user is ADMIN of this scope
    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId: numericScopeId,
        role: 'ADMIN',
      },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    // Get all sentiments in date range, grouped by date
    const sentiments = await prisma.dailySentiment.groupBy({
      by: ['date'],
      where: {
        scopeId: numericScopeId,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      _avg: {
        sentiment: true,
      },
      _count: {
        sentiment: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(
      sentiments.map((s) => ({
        date: s.date,
        average: s._avg.sentiment ? Math.round(s._avg.sentiment * 10) / 10 : null,
        count: s._count.sentiment,
      }))
    );
  } catch (error) {
    console.error('Error fetching sentiment insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
