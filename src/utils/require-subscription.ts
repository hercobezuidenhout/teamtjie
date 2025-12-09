import { hasActiveSubscription } from '@/prisma/queries/subscription-queries';

export class SubscriptionRequiredError extends Error {
    constructor(message: string = 'Active subscription required to access this feature') {
        super(message);
        this.name = 'SubscriptionRequiredError';
    }
}

/**
 * Check if a scope has an active subscription
 * Throws SubscriptionRequiredError if no active subscription found
 */
export async function requireSubscription(scopeId: number): Promise<void> {
    const hasSubscription = await hasActiveSubscription(scopeId);

    if (!hasSubscription) {
        throw new SubscriptionRequiredError(
            'This feature requires an active Premium subscription. Upgrade to access Daily Sentiments and Health Checks.'
        );
    }
}

/**
 * Check if a scope has an active subscription (returns boolean)
 */
export async function checkSubscription(scopeId: number): Promise<boolean> {
    return hasActiveSubscription(scopeId);
}