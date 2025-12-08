import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

// GET /api/insights/health-checks?scopeId={id}
// Returns aggregated health check results
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const scopeId = searchParams.get('scopeId');

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

    // Get latest health check with aggregated results
    const latestCheck = await prisma.healthCheck.findFirst({
      where: { scopeId: numericScopeId },
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            answers: {
              select: {
                score: true,
              },
            },
          },
        },
        _count: {
          select: {
            responses: {
              where: { completedAt: { not: null } },
            },
          },
        },
      },
    });

    if (!latestCheck) {
      return NextResponse.json({ latestCheck: null });
    }

    // Calculate average score per question
    const questionScores = latestCheck.questions.map((q) => {
      const scores = q.answers.map((a) => a.score);
      const average = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null;

      return {
        title: q.title,
        description: q.description,
        average: average ? Math.round(average * 10) / 10 : null,
        responseCount: scores.length,
      };
    });

    return NextResponse.json({
      id: latestCheck.id,
      createdAt: latestCheck.createdAt,
      totalResponses: latestCheck._count.responses,
      questions: questionScores,
    });
  } catch (error) {
    console.error('Error fetching health check insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
