import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';
import { DEFAULT_TEMPLATE } from '@/config/health-check-templates';
import { requireSubscription, SubscriptionRequiredError } from '@/utils/require-subscription';

export const dynamic = 'force-dynamic';

// GET /api/health-checks?scopeId={id}
// Returns all health checks for a scope
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
      await requireSubscription(numericScopeId);
    } catch (error) {
      if (error instanceof SubscriptionRequiredError) {
        return NextResponse.json(
          { error: error.message, requiresSubscription: true },
          { status: 402 }
        );
      }
      throw error;
    }

    // Get all health checks with user's response status
    const healthChecks = await prisma.healthCheck.findMany({
      where: { scopeId: numericScopeId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        responses: {
          where: { userId: session.user.id },
          select: {
            id: true,
            completedAt: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(healthChecks);
  } catch (error) {
    console.error('Error fetching health checks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/health-checks
// Creates a new health check (ADMIN only)
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

    // Check subscription (Premium feature)
    try {
      await requireSubscription(numericScopeId);
    } catch (error) {
      if (error instanceof SubscriptionRequiredError) {
        return NextResponse.json(
          { error: error.message, requiresSubscription: true },
          { status: 402 }
        );
      }
      throw error;
    }

    // Create health check with questions from template
    const healthCheck = await prisma.healthCheck.create({
      data: {
        scopeId: numericScopeId,
        templateId: DEFAULT_TEMPLATE.id,
        createdBy: session.user.id,
        questions: {
          create: DEFAULT_TEMPLATE.questions.map((q, index) => ({
            title: q.title,
            description: q.description,
            order: index,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(healthCheck);
  } catch (error) {
    console.error('Error creating health check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
