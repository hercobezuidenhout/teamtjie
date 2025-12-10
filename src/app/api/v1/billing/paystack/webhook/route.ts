import { NextRequest, NextResponse } from 'next/server';
import type { PaystackWebhookEvent } from '@/utils/paystack';
import {
  parsePaystackWebhook,
  extractPaystackMetadata,
  calculateNextBillingDate,
  validatePaymentAmount,
  isPaymentSuccessful,
} from '@/utils/paystack';
import { getSubscriptionByReference } from '@/prisma/queries/subscription-queries';
import {
  activateSubscription,
  cancelSubscription,
  createSubscriptionTransaction,
  resetCancellationFlag,
  updateSubscriptionStatus,
  updateSubscriptionPeriod,
} from '@/prisma/commands/subscription-commands';
import { SubscriptionStatus, TransactionType, Prisma } from '@prisma/client';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/paystack/webhook
 *
 * Handles Paystack webhook events
 * Events: subscription.create, charge.success, subscription.disable
 */
export async function POST(request: NextRequest) {
  try {
    // Get signature from header
    const signature = request.headers.get('x-paystack-signature');
    if (!signature) {
      console.error('Webhook missing signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Get raw body
    const body = await request.text();

    // Parse and verify webhook
    const { valid, event, error } = parsePaystackWebhook(body, signature);

    if (!valid || !event) {
      console.error('Invalid webhook:', error);
      return NextResponse.json(
        { error: error || 'Invalid webhook' },
        { status: 400 }
      );
    }

    // Log webhook event
    console.log('Paystack webhook received:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event);
        break;

      case 'subscription.create':
        await handleSubscriptionCreate(event);
        break;

      case 'subscription.not_renew':
        await handleSubscriptionNotRenew(event);
        break;

      case 'subscription.disable':
        await handleSubscriptionDisable(event);
        break;

      case 'charge.failed':
        await handleChargeFailed(event);
        break;

      case 'invoice.create':
        await handleInvoiceCreate(event);
        break;

      case 'invoice.update':
        await handleInvoiceUpdate(event);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event);
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);

    // Return 200 to prevent Paystack from retrying
    // But log the error for investigation
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Still return 200 to acknowledge receipt
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Find subscription by external subscription code
 * Returns null if not found or code is missing
 */
async function findSubscriptionByCode(
  subscriptionCode: string | undefined,
  context: string
) {
  if (!subscriptionCode) {
    console.error(`No subscription code in ${context}`);
    return null;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { externalSubscriptionId: subscriptionCode },
  });

  if (!subscription) {
    console.error(`Subscription not found for ${context}:`, subscriptionCode);
  }

  return subscription;
}

/**
 * Check if subscription has a valid period end date (in the future)
 */
function hasValidPeriodEnd(subscription: { currentPeriodEnd: Date | null; }): boolean {
  return !!(
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd > new Date()
  );
}

/**
 * Log a subscription status change transaction
 */
async function logSubscriptionTransaction(
  subscription: { id: number; currency: string; },
  type: TransactionType,
  data: PaystackWebhookEvent['data'],
  reference?: string
) {
  return createSubscriptionTransaction({
    subscriptionId: subscription.id,
    type,
    amount: 0, // Status changes always log 0 amount
    currency: subscription.currency,
    externalPaymentId: reference || data.subscription?.subscription_code || (data.reference as string | undefined),
    externalMetadata: data as Prisma.InputJsonValue,
    processedAt: new Date(),
  });
}

// ============================================================================
// Webhook Event Handlers
// ============================================================================

/**
 * Handle successful payment (initial or recurring)
 */
async function handleChargeSuccess(event: PaystackWebhookEvent) {
  const { data } = event;
  const reference = data.reference;

  // Verify payment is actually successful
  if (!isPaymentSuccessful(data)) {
    console.error('Payment not successful:', reference);
    return;
  }

  // Validate amount
  if (!validatePaymentAmount(data.amount)) {
    console.error('Invalid payment amount:', data.amount, 'expected:', 9900);
    return;
  }

  // Extract metadata
  const metadata = extractPaystackMetadata(data);

  // Try to find subscription by reference first (initial payment)
  let subscription = await getSubscriptionByReference(reference);

  // If not found by reference, try by subscription code (recurring payment)
  if (!subscription && metadata.subscriptionCode) {
    subscription = await prisma.subscription.findUnique({
      where: { externalSubscriptionId: metadata.subscriptionCode },
    });
  }

  if (!subscription) {
    console.error('Subscription not found for reference:', reference);
    return;
  }

  // Handle based on current status
  if (subscription.status === SubscriptionStatus.PENDING) {
    // Initial payment - activate subscription
    const { periodStart, periodEnd } = calculateNextBillingDate();

    await activateSubscription({
      subscriptionId: subscription.id,
      externalCustomerId: metadata.customerCode,
      externalSubscriptionId: metadata.subscriptionCode,
      periodStart,
      periodEnd,
    });

    console.log('Subscription activated via webhook:', subscription.id);
  } else if (subscription.status === SubscriptionStatus.ACTIVE) {
    // Recurring payment - extend billing period
    if (subscription.currentPeriodEnd) {
      const { periodStart, periodEnd } = calculateNextBillingDate(
        subscription.currentPeriodEnd
      );

      await updateSubscriptionPeriod(subscription.id, periodStart, periodEnd);

      // Reset cancellation flag if payment succeeds after user cancelled
      if (subscription.cancelAtPeriodEnd) {
        await resetCancellationFlag(subscription.id);
        console.log('Subscription re-enabled, cancellation flag reset:', subscription.id);
      }

      console.log('Subscription period extended:', subscription.id);
    } else {
      console.log('Subscription already active, no period to extend:', subscription.id);
    }
  }

  // Create transaction record
  await createSubscriptionTransaction({
    subscriptionId: subscription.id,
    type: TransactionType.PAYMENT_COMPLETE,
    amount: data.amount / 100, // Convert kobo to rand
    currency: (data.metadata?.currency as string | undefined) || 'ZAR',
    externalPaymentId: reference,
    externalMetadata: data as Prisma.InputJsonValue,
    processedAt: data.paid_at ? new Date(data.paid_at) : new Date(),
  });
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreate(event: PaystackWebhookEvent) {
  const { data } = event;
  const subscriptionCode = data.subscription?.subscription_code;

  if (!subscriptionCode) {
    console.error('No subscription code in event');
    return;
  }

  const metadata = extractPaystackMetadata(data);

  // Find subscription by customer code
  if (metadata.customerCode) {
    const subscription = await prisma.subscription.findFirst({
      where: { externalCustomerId: metadata.customerCode },
    });

    if (subscription && !subscription.externalSubscriptionId) {
      // Update with subscription code
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { externalSubscriptionId: subscriptionCode },
      });

      console.log('Subscription code updated:', subscription.id, subscriptionCode);
    }
  }
}

/**
 * Handle subscription.not_renew event
 * Fired when user cancels subscription (before it actually disables)
 * This is the event that fires immediately when user cancels on Paystack
 */
async function handleSubscriptionNotRenew(event: PaystackWebhookEvent) {
  const { data } = event;

  const subscription = await findSubscriptionByCode(
    data.subscription?.subscription_code,
    'not_renew event'
  );
  if (!subscription) return;

  // Mark subscription to cancel at period end (keep active until then)
  await cancelSubscription(subscription.id, true); // cancelAtPeriodEnd = true
  console.log('Subscription marked to not renew (cancel at period end):', subscription.id);

  // Create transaction record
  await logSubscriptionTransaction(
    subscription,
    TransactionType.SUBSCRIPTION_CANCELLED,
    data
  );
}

/**
 * Handle subscription cancellation/completion
 * Fired on next payment date after cancellation, or when subscription completes
 */
async function handleSubscriptionDisable(event: PaystackWebhookEvent) {
  const { data } = event;

  const subscription = await findSubscriptionByCode(
    data.subscription?.subscription_code,
    'cancellation event'
  );
  if (!subscription) return;

  // Check if subscription has a billing period end date
  if (hasValidPeriodEnd(subscription)) {
    // Cancel at period end - keep subscription active
    await cancelSubscription(subscription.id, true); // cancelAtPeriodEnd = true
    console.log('Subscription marked to cancel at period end:', subscription.id);
  } else {
    // No valid period end or already expired - cancel immediately
    await updateSubscriptionStatus(subscription.id, SubscriptionStatus.CANCELLED);
    console.log('Subscription cancelled immediately:', subscription.id);
  }

  // Create transaction record
  await logSubscriptionTransaction(
    subscription,
    TransactionType.SUBSCRIPTION_CANCELLED,
    data
  );
}

/**
 * Handle failed payment charge
 * This can occur when a cancelled subscription reaches its renewal date
 */
async function handleChargeFailed(event: PaystackWebhookEvent) {
  const { data } = event;
  const metadata = extractPaystackMetadata(data);

  const subscription = await findSubscriptionByCode(
    metadata.subscriptionCode,
    'failed charge event'
  );
  if (!subscription) return;

  // If subscription was marked to cancel at period end, now mark it as cancelled
  if (subscription.cancelAtPeriodEnd) {
    await updateSubscriptionStatus(subscription.id, SubscriptionStatus.CANCELLED);
    console.log('Subscription expired after cancellation:', subscription.id);

    // Create transaction record
    await logSubscriptionTransaction(
      subscription,
      TransactionType.PAYMENT_FAILED,
      data,
      data.reference
    );
  } else {
    console.log('Payment failed for active subscription:', subscription.id);
    // Could send notification to user about payment failure
  }
}

/**
 * Handle invoice.create event
 * Sent 3 days before next payment date
 */
async function handleInvoiceCreate(event: PaystackWebhookEvent) {
  const { data } = event;

  console.log('Invoice created (payment in 3 days):', data.subscription?.subscription_code);

  // Optional: Send notification to user about upcoming charge
  // This is a good place to remind users their subscription will renew
}

/**
 * Handle invoice.update event
 * Sent after charge attempt with final invoice status
 */
async function handleInvoiceUpdate(event: PaystackWebhookEvent) {
  const { data } = event;

  console.log('Invoice updated:', {
    subscriptionCode: data.subscription?.subscription_code,
    status: data.status,
    paid: data.paid,
  });

  // Optional: Log invoice status for record-keeping
  // The charge.success or invoice.payment_failed events handle the actual logic
}

/**
 * Handle invoice.payment_failed event
 * Sent when recurring payment fails
 */
async function handleInvoicePaymentFailed(event: PaystackWebhookEvent) {
  const { data } = event;

  const subscription = await findSubscriptionByCode(
    data.subscription?.subscription_code,
    'invoice payment failed event'
  );
  if (!subscription) return;

  console.log('Invoice payment failed for subscription:', subscription.id);

  // Create transaction record
  await logSubscriptionTransaction(
    subscription,
    TransactionType.PAYMENT_FAILED,
    data
  );

  // Optional: Send notification to user about failed payment
  // Paystack will retry automatically, so we just log it
}
