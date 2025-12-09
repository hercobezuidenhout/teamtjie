import { prisma } from '../prisma';
import { Subscription, SubscriptionStatus } from '@prisma/client';

export async function getSubscriptionByScope(scopeId: number): Promise<Subscription | null> {
    return prisma.subscription.findUnique({
        where: { scopeId },
        include: {
            scope: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                },
            },
            transactions: {
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
        },
    });
}

export async function getSubscriptionByToken(token: string): Promise<Subscription | null> {
    return prisma.subscription.findUnique({
        where: { payfastToken: token },
    });
}

export async function hasActiveSubscription(scopeId: number): Promise<boolean> {
    const subscription = await prisma.subscription.findUnique({
        where: { scopeId },
        select: {
            status: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true,
        },
    });

    if (!subscription) return false;

    // Active if status is ACTIVE and not expired
    if (subscription.status === SubscriptionStatus.ACTIVE) {
        if (!subscription.currentPeriodEnd) return true;
        return new Date() < subscription.currentPeriodEnd;
    }

    return false;
}

export async function getExpiringSubscriptions(daysAhead: number = 3) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return prisma.subscription.findMany({
        where: {
            status: SubscriptionStatus.ACTIVE,
            currentPeriodEnd: {
                lte: futureDate,
                gte: new Date(),
            },
        },
        include: {
            scope: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
}