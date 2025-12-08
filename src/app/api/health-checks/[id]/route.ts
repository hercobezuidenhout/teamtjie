import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/health-checks/[id]
// Returns a specific health check with questions
export async function GET(
  _request: NextRequest,
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

    const healthCheck = await prisma.healthCheck.findUnique({
      where: { id: healthCheckId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        responses: {
          where: { userId: session.user.id },
          include: {
            answers: {
              include: {
                question: true,
              },
            },
          },
        },
      },
    });

    if (!healthCheck) {
      return NextResponse.json(
        { error: 'Health check not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this scope
    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId: healthCheck.scopeId,
      },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(healthCheck);
  } catch (error) {
    console.error('Error fetching health check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
