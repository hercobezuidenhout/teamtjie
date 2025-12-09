import { prisma } from '../prisma';
import { Subscription, SubscriptionStatus } from '@prisma/client';

export async function getUserSubscription(userId: string) {
    return prisma.subscription.findUnique({
        where: { userId },
        include: {
            teams: {
                include: {
                    scope: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                        },
                    },
                },
                orderBy: {
                    addedAt: 'asc',
                },
            },
            transactions: {
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
        },
    });
}

export async function getTeamSubscriptionStatus(scopeId: number) {
    const subscriptionScope = await prisma.subscriptionScope.findUnique({
        where: { scopeId },
        include: {
            subscription: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    return subscriptionScope;
}

export async function getSubscriptionByReference(reference: string): Promise<Subscription | null> {
    return prisma.subscription.findUnique({
        where: { reference },
    });
}

export async function hasActiveSubscription(scopeId: number, userId: string): Promise<boolean> {
    // Get user's subscription
    const subscription = await prisma.subscription.findUnique({
        where: { userId },
        select: {
            status: true,
            currentPeriodEnd: true,
            teams: {
                where: { scopeId },
                select: { id: true },
            },
        },
    });

    if (!subscription) return false;

    // Check if subscription is active and not expired
    if (subscription.status !== SubscriptionStatus.ACTIVE) return false;

    if (subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
        return false;
    }

    // Check if THIS specific team is in the subscription
    if (subscription.teams.length === 0) return false;

    // Check if user is admin of this team
    const userRole = await prisma.scopeRole.findFirst({
        where: {
            userId,
            scopeId,
            role: 'ADMIN',
        },
    });

    return !!userRole;
}

export async function getSubscriptionTeamCount(subscriptionId: number): Promise<number> {
    return prisma.subscriptionScope.count({
        where: { subscriptionId },
    });
}

export async function canAddTeamToSubscription(
    subscriptionId: number,
    scopeId: number,
    userId: string
): Promise<{ canAdd: boolean; reason?: string }> {
    // Check 1: Subscription has < 3 teams
    const teamCount = await getSubscriptionTeamCount(subscriptionId);
    if (teamCount >= 3) {
        return { canAdd: false, reason: 'MAX_TEAMS_REACHED' };
    }

    // Check 2: User is admin of team
    const userRole = await prisma.scopeRole.findFirst({
        where: {
            userId,
            scopeId,
            role: 'ADMIN',
        },
    });

    if (!userRole) {
        return { canAdd: false, reason: 'NOT_ADMIN' };
    }

    // Check 3: Team not already in a subscription
    const existingSubscriptionScope = await prisma.subscriptionScope.findUnique({
        where: { scopeId },
    });

    if (existingSubscriptionScope) {
        return { canAdd: false, reason: 'TEAM_ALREADY_SUBSCRIBED' };
    }

    return { canAdd: true };
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