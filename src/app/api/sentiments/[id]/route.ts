import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import prisma from '@/prisma/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// PUT /api/sentiments/[id]
// Updates a specific sentiment entry (note only)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sentimentId = parseInt(params.id, 10);
    if (isNaN(sentimentId)) {
      return NextResponse.json(
        { error: 'Invalid sentiment ID' },
        { status: 400 }
      );
    }

    // Check if sentiment exists and belongs to user
    const existingSentiment = await prisma.dailySentiment.findUnique({
      where: { id: sentimentId },
    });

    if (!existingSentiment) {
      return NextResponse.json(
        { error: 'Sentiment not found' },
        { status: 404 }
      );
    }

    if (existingSentiment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { note } = body;

    // Update only the note
    const updatedSentiment = await prisma.dailySentiment.update({
      where: { id: sentimentId },
      data: {
        note: note || null,
      },
    });

    return NextResponse.json(updatedSentiment);
  } catch (error) {
    console.error('Error updating sentiment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
