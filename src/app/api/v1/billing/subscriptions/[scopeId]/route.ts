import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getSubscriptionByScope } from '@/prisma/queries/subscription-queries';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

// GET /api/v1/billing/subscriptions/[scopeId]
// Returns subscription for a specific scope
export async function GET(
    _request: NextRequest,
    { params }: { params: { scopeId: string; }; }
) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const scopeId = parseInt(params.scopeId, 10);
        if (isNaN(scopeId)) {
            return NextResponse.json(
                { error: 'Invalid scopeId' },
                { status: 400 }
            );
        }

        // Check if user has access to this scope
        const userRole = await prisma.scopeRole.findFirst({
            where: {
                userId: session.user.id,
                scopeId: scopeId,
            },
        });

        if (!userRole) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get subscription
        const subscription = await getSubscriptionByScope(scopeId);

        return NextResponse.json(subscription);
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}