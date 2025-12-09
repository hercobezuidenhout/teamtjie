import crypto from 'crypto';
import { PAYFAST_CONFIG } from '@/config/payfast';

export interface PayfastPaymentData {
    merchant_id: string;
    merchant_key: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    name_first: string;
    email_address: string;
    m_payment_id: string;
    amount: string;
    item_name: string;
    item_description: string;
    subscription_type: string;
    billing_date: string;
    recurring_amount: string;
    frequency: string;
    cycles: string;
    signature: string;
}

export interface PayfastWebhookData {
    m_payment_id: string;
    pf_payment_id: string;
    payment_status: string;
    item_name: string;
    amount_gross: string;
    amount_fee: string;
    amount_net: string;
    signature: string;
    token: string;
    billing_date: string;
}

/**
 * Generate MD5 signature for PayFast
 */
export function generateSignature(data: Record<string, any>): string {
    // Create parameter string (excluding signature field)
    const params = Object.keys(data)
        .filter(key => key !== 'signature' && data[key] !== '' && data[key] !== null)
        .sort()
        .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
        .join('&');

    // Add passphrase if configured
    const signatureString = PAYFAST_CONFIG.passphrase
        ? `${params}&passphrase=${encodeURIComponent(PAYFAST_CONFIG.passphrase)}`
        : params;

    return crypto.createHash('md5').update(signatureString).digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifySignature(data: Record<string, any>, receivedSignature: string): boolean {
    const calculatedSignature = generateSignature(data);
    return calculatedSignature === receivedSignature;
}

/**
 * Create payment data for subscription
 */
export function createPaymentData(
    scopeId: number,
    scopeName: string,
    userEmail: string,
    userName: string
): PayfastPaymentData {
    const billingDate = new Date();
    billingDate.setDate(billingDate.getDate() + 1); // Start tomorrow

    const data = {
        merchant_id: PAYFAST_CONFIG.merchantId,
        merchant_key: PAYFAST_CONFIG.merchantKey,
        return_url: PAYFAST_CONFIG.returnUrl.replace('[scopeId]', scopeId.toString()),
        cancel_url: PAYFAST_CONFIG.cancelUrl.replace('[scopeId]', scopeId.toString()),
        notify_url: PAYFAST_CONFIG.notifyUrl,
        name_first: userName,
        email_address: userEmail,
        m_payment_id: `subscription_${scopeId}_${Date.now()}`,
        amount: PAYFAST_CONFIG.subscription.amount.toFixed(2),
        item_name: `${scopeName} - Premium Subscription`,
        item_description: 'Monthly subscription for premium features (Daily Sentiments & Health Checks)',
        subscription_type: '1', // Subscription
        billing_date: billingDate.toISOString().split('T')[0],
        recurring_amount: PAYFAST_CONFIG.subscription.amount.toFixed(2),
        frequency: '3', // Monthly
        cycles: PAYFAST_CONFIG.subscription.cycles.toString(),
    };

    const signature = generateSignature(data);

    return {
        ...data,
        signature,
    } as PayfastPaymentData;
}

/**
 * Parse webhook data from POST body
 */
export function parseWebhookData(body: string): PayfastWebhookData {
    const params = new URLSearchParams(body);
    const data: any = {};

    for (const [key, value] of params.entries()) {
        data[key] = value;
    }

    return data as PayfastWebhookData;
}