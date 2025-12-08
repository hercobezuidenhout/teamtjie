import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/health-checks/[id]/responses
// Creates or updates user's response (draft or completed)
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const healthCheckId = parseInt(params.id, 10);
    if (isNaN(healthCheckId)) {
      return NextResponse.json(
        { error: 'Invalid health check ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { answers, completed } = body;

    // Validate answers format
    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'answers must be an array' },
        { status: 400 }
      );
    }

    // Verify health check exists and user has access
    const healthCheck = await prisma.healthCheck.findUnique({
      where: { id: healthCheckId },
    });

    if (!healthCheck) {
      return NextResponse.json(
        { error: 'Health check not found' },
        { status: 404 }
      );
    }

    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId: healthCheck.scopeId,
      },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Upsert response
    const response = await prisma.healthCheckResponse.upsert({
      where: {
        healthCheckId_userId: {
          healthCheckId,
          userId: session.user.id,
        },
      },
      update: {
        completedAt: completed ? new Date() : null,
        answers: {
          deleteMany: {}, // Clear existing answers
          create: answers.map((answer: { questionId: number; score: number; note?: string }) => ({
            questionId: answer.questionId,
            score: answer.score,
            note: answer.note || null,
          })),
        },
      },
      create: {
        healthCheckId,
        userId: session.user.id,
        completedAt: completed ? new Date() : null,
        answers: {
          create: answers.map((answer: { questionId: number; score: number; note?: string }) => ({
            questionId: answer.questionId,
            score: answer.score,
            note: answer.note || null,
          })),
        },
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error saving health check response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
