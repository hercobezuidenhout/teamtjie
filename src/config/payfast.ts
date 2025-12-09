export const PAYFAST_CONFIG = {
    // Sandbox credentials
    merchantId: process.env.PAYFAST_MERCHANT_ID || '10000100',
    merchantKey: process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a',
    passphrase: process.env.PAYFAST_PASSPHRASE || '',

    // URLs
    sandboxUrl: 'https://sandbox.payfast.co.za/eng/process',
    productionUrl: 'https://www.payfast.co.za/eng/process',

    // Environment
    isSandbox: process.env.NODE_ENV !== 'production',

    // Subscription settings
    subscription: {
        amount: 99.00,
        currency: 'ZAR',
        billingCycle: 'monthly',
        cycles: 0, // 0 = recurring until cancelled
    },

    // Return URLs
    returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/[scopeId]/billing?payment=success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/[scopeId]/billing?payment=cancelled`,
    notifyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/billing/webhook`,
} as const;

export function getPayfastUrl(): string {
    return PAYFAST_CONFIG.isSandbox
        ? PAYFAST_CONFIG.sandboxUrl
        : PAYFAST_CONFIG.productionUrl;
}