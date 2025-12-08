import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

// GET /api/insights/culture?scopeId={id}&from={YYYY-MM-DD}&to={YYYY-MM-DD}
// Returns culture metrics based on posts and values
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

    // Get posts with their linked values
    const posts = await prisma.post.findMany({
      where: {
        scopeId: numericScopeId,
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: {
        values: {
          include: {
            scopeValue: true,
          },
        },
      },
    });

    // Count posts by value
    const valueCount: Record<string, number> = {};
    posts.forEach((post) => {
      post.values.forEach((pv) => {
        const valueName = pv.scopeValue.name;
        valueCount[valueName] = (valueCount[valueName] || 0) + 1;
      });
    });

    // Posts over time (grouped by day)
    const postsByDate: Record<string, number> = {};
    posts.forEach((post) => {
      const dateKey = post.createdAt.toISOString().split('T')[0];
      postsByDate[dateKey] = (postsByDate[dateKey] || 0) + 1;
    });

    return NextResponse.json({
      totalPosts: posts.length,
      valueDistribution: Object.entries(valueCount).map(([name, count]) => ({
        name,
        count,
      })),
      postsOverTime: Object.entries(postsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    });
  } catch (error) {
    console.error('Error fetching culture insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
