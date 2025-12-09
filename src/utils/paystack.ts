import crypto from 'crypto';
import { BILLING_CONFIG } from '@/config/billing';

/**
 * Paystack utility functions
 * All Paystack-specific logic lives here
 */

// ============================================================================
// Types
// ============================================================================

export interface PaystackWebhookEvent {
  event: string;
  data: {
    reference: string;
    amount: number;
    customer: {
      email: string;
      customer_code: string;
    };
    metadata?: {
      scopeId?: number;
      scopeName?: string;
      [key: string]: any;
    };
    status?: string;
    paid_at?: string;
    authorization?: {
      authorization_code: string;
      card_type: string;
      last4: string;
      bin: string;
    };
    subscription?: {
      subscription_code: string;
      email_token: string;
    };
    [key: string]: any;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    amount: number;
    status: 'success' | 'failed';
    paid_at: string;
    customer: {
      email: string;
      customer_code: string;
    };
    authorization: {
      authorization_code: string;
      card_type: string;
      last4: string;
    };
    metadata?: Record<string, any>;
  };
}

export interface PaystackSubscriptionResponse {
  status: boolean;
  message: string;
  data: {
    customer: string;
    plan: string;
    subscription_code: string;
    email_token: string;
    amount: number;
    status: string;
    next_payment_date: string;
  };
}

// ============================================================================
// Webhook Verification
// ============================================================================

/**
 * Verify Paystack webhook signature
 * Uses HMAC SHA512 with secret key
 */
export function verifyPaystackSignature(
  payload: string,
  signature: string
): boolean {
  try {
    const hash = crypto
      .createHmac('sha512', BILLING_CONFIG.paystack.secretKey)
      .update(payload)
      .digest('hex');

    return hash === signature;
  } catch (error) {
    console.error('Paystack signature verification error:', error);
    return false;
  }
}

/**
 * Parse and validate Paystack webhook event
 */
export function parsePaystackWebhook(
  body: string,
  signature: string
): { valid: boolean; event?: PaystackWebhookEvent; error?: string } {
  // Verify signature
  if (!verifyPaystackSignature(body, signature)) {
    return { valid: false, error: 'Invalid signature' };
  }

  try {
    const event = JSON.parse(body) as PaystackWebhookEvent;
    return { valid: true, event };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
}

// ============================================================================
// Payment Operations
// ============================================================================

/**
 * Verify a payment transaction with Paystack API
 */
export async function verifyPaystackPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${BILLING_CONFIG.paystack.secretKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Paystack API error: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Check if customer has existing Paystack subscriptions
 */
export async function getCustomerSubscriptions(customerCode: string): Promise<any> {
  const response = await fetch(
    `https://api.paystack.co/subscription?customer=${customerCode}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${BILLING_CONFIG.paystack.secretKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch customer subscriptions: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Subscribe a customer to a Paystack plan for recurring billing
 * Checks for existing subscription first to avoid duplicates
 */
export async function subscribeCustomerToPlan(
  customerCode: string,
  email: string
): Promise<PaystackSubscriptionResponse> {
  const planCode = BILLING_CONFIG.paystack.planCode;

  if (!planCode) {
    throw new Error('Paystack plan code not configured');
  }

  // Check if customer already has an active subscription to this plan
  try {
    const existingSubscriptions = await getCustomerSubscriptions(customerCode);

    if (existingSubscriptions.status && existingSubscriptions.data) {
      const activeSubscription = existingSubscriptions.data.find(
        (sub: any) =>
          sub.plan?.plan_code === planCode &&
          (sub.status === 'active' || sub.status === 'non-renewing')
      );

      if (activeSubscription) {
        console.log('Customer already has active subscription:', activeSubscription.subscription_code);
        // Return existing subscription instead of creating new one
        return {
          status: true,
          message: 'Using existing subscription',
          data: activeSubscription,
        };
      }
    }
  } catch (error) {
    console.error('Error checking existing subscriptions:', error);
    // Continue to create new subscription if check fails
  }

  // Create new subscription
  const response = await fetch('https://api.paystack.co/subscription', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${BILLING_CONFIG.paystack.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer: customerCode,
      plan: planCode,
    }),
  });

  const responseData = await response.json();

  // If subscription already exists, fetch and return it
  if (!response.ok && responseData.message?.includes('already in place')) {
    console.log('Subscription already exists, fetching existing subscription...');
    try {
      const existingSubscriptions = await getCustomerSubscriptions(customerCode);
      if (existingSubscriptions.status && existingSubscriptions.data) {
        const activeSubscription = existingSubscriptions.data.find(
          (sub: any) =>
            sub.plan?.plan_code === planCode &&
            (sub.status === 'active' || sub.status === 'non-renewing')
        );

        if (activeSubscription) {
          console.log('Using existing subscription:', activeSubscription.subscription_code);
          return {
            status: true,
            message: 'Using existing subscription',
            data: activeSubscription,
          };
        }
      }
    } catch (error) {
      console.error('Failed to fetch existing subscription:', error);
    }

    // If we still can't find it, throw the original error
    throw new Error(
      `Paystack subscription error: ${responseData.message || response.statusText}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Paystack subscription error: ${responseData.message || response.statusText}`
    );
  }

  return responseData;
}

/**
 * Cancel a Paystack subscription
 * Uses the simpler disable endpoint that doesn't require email token
 */
export async function cancelPaystackSubscription(
  subscriptionCode: string
): Promise<{ success: boolean; message?: string; paystackResponse?: any }> {
  try {
    // Use the simpler endpoint that uses API key authentication
    const response = await fetch(
      `https://api.paystack.co/subscription/disable`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${BILLING_CONFIG.paystack.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: subscriptionCode,
          token: subscriptionCode, // Use subscription code as token
        }),
      }
    );

    const data = await response.json();

    console.log('Paystack cancel response:', {
      status: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok || !data.status) {
      return {
        success: false,
        message: data.message || 'Failed to cancel subscription',
        paystackResponse: data,
      };
    }

    return {
      success: true,
      message: data.message,
      paystackResponse: data,
    };
  } catch (error) {
    console.error('Paystack cancel error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate unique reference for Paystack payment
 */
export function generatePaystackReference(scopeId: number): string {
  return `sub_${scopeId}_${Date.now()}`;
}

/**
 * Calculate next billing date (1 month from now)
 */
export function calculateNextBillingDate(
  fromDate: Date = new Date()
): { periodStart: Date; periodEnd: Date } {
  const periodStart = new Date(fromDate);
  const periodEnd = new Date(fromDate);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  return { periodStart, periodEnd };
}

/**
 * Validate payment amount matches expected subscription price
 */
export function validatePaymentAmount(
  amount: number,
  expectedAmount: number = BILLING_CONFIG.price.amountInKobo
): boolean {
  return amount === expectedAmount;
}

/**
 * Check if payment is successful
 */
export function isPaymentSuccessful(data: any): boolean {
  return data.status === 'success' && data.paid_at;
}

/**
 * Extract metadata from Paystack webhook/response
 */
export function extractPaystackMetadata(data: any): {
  scopeId?: number;
  scopeName?: string;
  customerCode?: string;
  authorizationCode?: string;
  subscriptionCode?: string;
} {
  return {
    scopeId: data.metadata?.scopeId
      ? parseInt(data.metadata.scopeId.toString())
      : undefined,
    scopeName: data.metadata?.scopeName,
    customerCode: data.customer?.customer_code,
    authorizationCode: data.authorization?.authorization_code,
    subscriptionCode: data.subscription?.subscription_code,
  };
}

/**
 * Create a Paystack plan (one-time setup)
 * Can also be done manually in Paystack dashboard
 */
export async function createPaystackPlan(): Promise<{ planCode: string }> {
  const response = await fetch('https://api.paystack.co/plan', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${BILLING_CONFIG.paystack.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Teamtjie Premium Monthly',
      amount: BILLING_CONFIG.price.amountInKobo,
      interval: 'monthly',
      currency: BILLING_CONFIG.price.currency,
      description: 'Monthly subscription for premium features (Daily Sentiments & Health Checks)',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create plan: ${errorData.message || response.statusText}`);
  }

  const data = await response.json();
  return { planCode: data.data.plan_code };
}

// ============================================================================
// Error Handling
// ============================================================================

export class PaystackError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'PaystackError';
  }
}

/**
 * Handle Paystack API errors
 */
export function handlePaystackError(error: any): never {
  if (error instanceof PaystackError) {
    throw error;
  }

  const message = error?.message || 'Paystack API error';
  const code = error?.code || 'UNKNOWN_ERROR';
  const statusCode = error?.statusCode || 500;

  throw new PaystackError(message, code, statusCode);
}
