/**
 * Billing Configuration
 * Central configuration for subscription pricing and features
 */

export const BILLING_CONFIG = {
    // Subscription pricing
    price: {
        monthly: 99.00,
        currency: 'ZAR',
        // Amount in kobo/cents for Paystack
        amountInKobo: 9900,
    },

    // Premium features
    features: [
        {
            id: 'daily-sentiments',
            name: 'Daily Sentiments',
            description: 'Track team mood and engagement daily',
        },
        {
            id: 'health-checks',
            name: 'Health Checks',
            description: 'Regular team health assessments and insights',
        },
    ],

    // Paystack configuration
    paystack: {
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    },
} as const;

/**
 * Check if billing is properly configured
 */
export function isBillingConfigured(): boolean {
    return !!BILLING_CONFIG.paystack.publicKey;
}

/**
 * Generate unique subscription reference
 */
export function generateSubscriptionRef(scopeId: number): string {
    return `subscription_${scopeId}_${Date.now()}`;
}