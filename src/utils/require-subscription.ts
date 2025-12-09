import { hasActiveSubscription } from '@/prisma/queries/subscription-queries';

export class SubscriptionRequiredError extends Error {
    constructor(message: string = 'Active subscription required to access this feature') {
        super(message);
        this.name = 'SubscriptionRequiredError';
    }
}

/**
 * Check if a user has an active subscription that includes this scope
 * Throws SubscriptionRequiredError if no active subscription found
 */
export async function requireSubscription(scopeId: number, userId: string): Promise<void> {
    const hasSubscription = await hasActiveSubscription(scopeId, userId);

    if (!hasSubscription) {
        throw new SubscriptionRequiredError(
            'This feature requires an active Teamtjie+ subscription with this team added. Visit your billing settings to manage teams.'
        );
    }
}

/**
 * Check if a user has an active subscription that includes this scope (returns boolean)
 */
export async function checkSubscription(scopeId: number, userId: string): Promise<boolean> {
    return hasActiveSubscription(scopeId, userId);
}