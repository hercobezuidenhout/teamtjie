import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    scopeId: string;
  };
}

// GET /api/scopes/[scopeId]/settings
// Returns scope settings including showAverageSentiment
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const numericScopeId = parseInt(params.scopeId, 10);
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

    // Get or create settings
    let settings = await prisma.scopeSettings.findUnique({
      where: { scopeId: numericScopeId },
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.scopeSettings.create({
        data: {
          scopeId: numericScopeId,
          showAverageSentiment: false,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching scope settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/scopes/[scopeId]/settings
// Updates scope settings (ADMIN only)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const numericScopeId = parseInt(params.scopeId, 10);
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

    const body = await request.json();
    const { showAverageSentiment } = body;

    if (typeof showAverageSentiment !== 'boolean') {
      return NextResponse.json(
        { error: 'showAverageSentiment must be a boolean' },
        { status: 400 }
      );
    }

    // Upsert settings
    const settings = await prisma.scopeSettings.upsert({
      where: { scopeId: numericScopeId },
      update: { showAverageSentiment },
      create: {
        scopeId: numericScopeId,
        showAverageSentiment,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating scope settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
