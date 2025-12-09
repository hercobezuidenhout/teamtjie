# Simplified Billing Implementation Design

**Created**: 2025-12-09
**Purpose**: Simple, pragmatic billing implementation with Paystack

---

## Design Philosophy

**YAGNI** - You Ain't Gonna Need It

- Start with Paystack only
- Generic schema (no provider names) but shaped for Paystack
- Provider-specific endpoints (easy to add others later)
- All provider logic in one utils file
- Keep it simple until we need complexity

---

## Database Schema (Generic but Paystack-Compatible)

### Updated Schema

```prisma
enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  PENDING
  FAILED
}

enum TransactionType {
  PAYMENT_COMPLETE
  PAYMENT_FAILED
  SUBSCRIPTION_CANCELLED
}

model Subscription {
  id                     Int                        @id @default(autoincrement())
  scopeId                Int                        @unique
  scope                  Scope                      @relation(fields: [scopeId], references: [id], onDelete: Cascade)

  // Generic external references (works for any provider)
  reference              String                     @unique  // Our internal reference
  externalCustomerId     String?                    // Provider's customer ID
  externalSubscriptionId String?        @unique     // Provider's subscription ID
  externalMetadata       Json?                      // Provider-specific extras

  // Subscription details
  status                 SubscriptionStatus         @default(PENDING)
  amount                 Decimal                    @db.Decimal(10, 2)
  currency               String                     @default("ZAR")
  billingCycle           String                     @default("monthly")

  // Billing period
  currentPeriodStart     DateTime?
  currentPeriodEnd       DateTime?
  cancelAtPeriodEnd      Boolean                    @default(false)

  // Audit
  subscribedBy           String                     // User ID who initiated
  createdAt              DateTime                   @default(now())
  updatedAt              DateTime                   @updatedAt

  transactions           SubscriptionTransaction[]

  @@index([scopeId, status])
  @@index([status, currentPeriodEnd])
  @@index([reference])
}

model SubscriptionTransaction {
  id                Int                @id @default(autoincrement())
  subscriptionId    Int
  subscription      Subscription       @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  // Generic external references
  externalPaymentId String?            // Provider's payment/transaction ID
  externalMetadata  Json?              // Full webhook payload or response

  // Transaction details
  type              TransactionType
  amount            Decimal            @db.Decimal(10, 2)
  currency          String
  processedAt       DateTime?

  // Audit
  createdAt         DateTime           @default(now())

  @@index([subscriptionId, createdAt(sort: Desc)])
  @@index([externalPaymentId])
}
```

### Migration from Current Schema

**Changes:**
- `payfastToken` → Removed (not needed, we use `reference`)
- `payfastSubscriptionId` → `externalSubscriptionId`
- Add `reference` (our internal tracking)
- Add `externalCustomerId` (Paystack customer code)
- Add `externalMetadata` (JSON for provider-specific data)
- Add `subscribedBy` (audit trail)

---

## File Structure

```
src/
├── utils/
│   └── paystack.ts                              # All Paystack logic
│
├── app/api/v1/billing/
│   ├── paystack/
│   │   └── webhook/
│   │       └── route.ts                         # Paystack webhook handler
│   │
│   └── subscriptions/
│       └── [scopeId]/
│           ├── route.ts                         # GET subscription details
│           ├── create/
│           │   └── route.ts                     # POST create subscription
│           └── cancel/
│               └── route.ts                     # POST cancel subscription
│
├── prisma/
│   ├── queries/
│   │   └── subscription-queries.ts              # Updated for new schema
│   └── commands/
│       └── subscription-commands.ts             # Updated for new schema
│
└── config/
    └── billing.ts                               # Existing config (keep as-is)
```

---

## Paystack Utilities

**File**: `src/utils/paystack.ts`

```typescript
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
    metadata?: Record<string, any>;
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
 * Create a Paystack subscription
 * Note: We use one-time payments, not Paystack's subscription feature
 * This is simpler and gives us more control
 */
export function generatePaystackReference(scopeId: number): string {
  return `sub_${scopeId}_${Date.now()}`;
}

/**
 * Extract metadata from Paystack webhook/response
 */
export function extractPaystackMetadata(data: any): {
  scopeId?: number;
  scopeName?: string;
  customerCode?: string;
  authorizationCode?: string;
} {
  return {
    scopeId: data.metadata?.scopeId
      ? parseInt(data.metadata.scopeId)
      : undefined,
    scopeName: data.metadata?.scopeName,
    customerCode: data.customer?.customer_code,
    authorizationCode: data.authorization?.authorization_code,
  };
}

// ============================================================================
// Subscription Management
// ============================================================================

/**
 * Cancel a subscription by disabling the authorization
 * (Paystack doesn't have a direct subscription cancel API for one-time payments)
 */
export async function cancelPaystackAuthorization(
  authorizationCode: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(
      'https://api.paystack.co/customer/deactivate_authorization',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${BILLING_CONFIG.paystack.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorization_code: authorizationCode,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        message: data.message || 'Failed to cancel authorization',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
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

// ============================================================================
// Validation
// ============================================================================

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
```

---

## API Endpoints

### 1. Paystack Webhook Handler

**File**: `src/app/api/v1/billing/paystack/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  parsePaystackWebhook,
  verifyPaystackPayment,
  extractPaystackMetadata,
  calculateNextBillingDate,
  validatePaymentAmount,
  isPaymentSuccessful,
  PaystackError,
} from '@/utils/paystack';
import { getSubscriptionByReference } from '@/prisma/queries/subscription-queries';
import {
  activateSubscription,
  createSubscriptionTransaction,
  updateSubscriptionStatus,
} from '@/prisma/commands/subscription-commands';
import { SubscriptionStatus, TransactionType } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/paystack/webhook
 *
 * Handles Paystack webhook events
 * Events: charge.success, subscription.disable, etc.
 */
export async function POST(request: NextRequest) {
  try {
    // Get signature from header
    const signature = request.headers.get('x-paystack-signature');
    if (!signature) {
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

      case 'subscription.disable':
        await handleSubscriptionDisable(event);
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
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 } // Still return 200 to acknowledge receipt
    );
  }
}

/**
 * Handle successful payment
 */
async function handleChargeSuccess(event: any) {
  const { data } = event;
  const reference = data.reference;

  // Verify payment is actually successful
  if (!isPaymentSuccessful(data)) {
    console.error('Payment not successful:', reference);
    return;
  }

  // Validate amount
  if (!validatePaymentAmount(data.amount)) {
    console.error('Invalid payment amount:', data.amount);
    return;
  }

  // Find subscription by reference
  const subscription = await getSubscriptionByReference(reference);
  if (!subscription) {
    console.error('Subscription not found for reference:', reference);
    return;
  }

  // Check if already processed
  if (subscription.status === SubscriptionStatus.ACTIVE) {
    console.log('Subscription already active:', subscription.id);
    return;
  }

  // Extract metadata
  const metadata = extractPaystackMetadata(data);

  // Calculate billing period
  const { periodStart, periodEnd } = calculateNextBillingDate();

  // Activate subscription
  await activateSubscription({
    subscriptionId: subscription.id,
    externalCustomerId: metadata.customerCode || data.customer?.customer_code,
    externalSubscriptionId: data.authorization?.authorization_code, // Use auth code as subscription ID
    periodStart,
    periodEnd,
  });

  // Create transaction record
  await createSubscriptionTransaction({
    subscriptionId: subscription.id,
    type: TransactionType.PAYMENT_COMPLETE,
    amount: data.amount / 100, // Convert from kobo to Naira/Rand
    currency: data.currency || 'ZAR',
    externalPaymentId: reference,
    externalMetadata: data,
    processedAt: new Date(data.paid_at),
  });

  console.log('Subscription activated:', subscription.id);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDisable(event: any) {
  const { data } = event;
  const subscriptionCode = data.subscription_code;

  // Find subscription by external ID
  const subscription = await prisma.subscription.findUnique({
    where: { externalSubscriptionId: subscriptionCode },
  });

  if (!subscription) {
    console.error('Subscription not found:', subscriptionCode);
    return;
  }

  // Update status
  await updateSubscriptionStatus(
    subscription.id,
    SubscriptionStatus.CANCELLED
  );

  // Create transaction record
  await createSubscriptionTransaction({
    subscriptionId: subscription.id,
    type: TransactionType.SUBSCRIPTION_CANCELLED,
    amount: 0,
    currency: subscription.currency,
    externalPaymentId: subscriptionCode,
    externalMetadata: data,
    processedAt: new Date(),
  });

  console.log('Subscription cancelled:', subscription.id);
}
```

### 2. Create Subscription

**File**: `src/app/api/v1/billing/subscriptions/[scopeId]/create/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { generatePaystackReference } from '@/utils/paystack';
import { createSubscription } from '@/prisma/commands/subscription-commands';
import { BILLING_CONFIG } from '@/config/billing';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/subscriptions/[scopeId]/create
 *
 * Initialize a subscription payment
 * Returns reference for frontend to use with Paystack
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { scopeId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scopeId = parseInt(params.scopeId);
    if (isNaN(scopeId)) {
      return NextResponse.json({ error: 'Invalid scopeId' }, { status: 400 });
    }

    // Check if user has access to this scope
    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId,
      },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if subscription already exists
    const existing = await prisma.subscription.findUnique({
      where: { scopeId },
    });

    if (existing && existing.status === 'ACTIVE') {
      return NextResponse.json(
        { error: 'Subscription already active' },
        { status: 400 }
      );
    }

    // Get scope details
    const scope = await prisma.scope.findUnique({
      where: { id: scopeId },
      select: { name: true },
    });

    if (!scope) {
      return NextResponse.json({ error: 'Scope not found' }, { status: 404 });
    }

    // Generate reference
    const reference = generatePaystackReference(scopeId);

    // Create subscription in PENDING state
    const subscription = await createSubscription({
      scopeId,
      reference,
      amount: BILLING_CONFIG.price.monthly,
      currency: BILLING_CONFIG.price.currency,
      billingCycle: 'monthly',
      subscribedBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      reference,
      subscriptionId: subscription.id,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create subscription',
      },
      { status: 500 }
    );
  }
}
```

### 3. Get Subscription Details

**File**: `src/app/api/v1/billing/subscriptions/[scopeId]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getSubscriptionByScope } from '@/prisma/queries/subscription-queries';
import prisma from '@/prisma/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/billing/subscriptions/[scopeId]
 *
 * Get subscription details for a scope
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { scopeId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scopeId = parseInt(params.scopeId);
    if (isNaN(scopeId)) {
      return NextResponse.json({ error: 'Invalid scopeId' }, { status: 400 });
    }

    // Check if user has access to this scope
    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId,
      },
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get subscription
    const subscription = await getSubscriptionByScope(scopeId);

    if (!subscription) {
      return NextResponse.json(
        { hasSubscription: false, subscription: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        amount: subscription.amount,
        currency: subscription.currency,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        createdAt: subscription.createdAt,
      },
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get subscription',
      },
      { status: 500 }
    );
  }
}
```

### 4. Cancel Subscription

**File**: `src/app/api/v1/billing/subscriptions/[scopeId]/cancel/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/utils';
import { getSubscriptionByScope } from '@/prisma/queries/subscription-queries';
import { cancelSubscription } from '@/prisma/commands/subscription-commands';
import { cancelPaystackAuthorization } from '@/utils/paystack';
import prisma from '@/prisma/prisma';
import { RoleType } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * POST /api/v1/billing/subscriptions/[scopeId]/cancel
 *
 * Cancel a subscription
 * Body: { immediate?: boolean }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { scopeId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scopeId = parseInt(params.scopeId);
    if (isNaN(scopeId)) {
      return NextResponse.json({ error: 'Invalid scopeId' }, { status: 400 });
    }

    // Check if user is admin of this scope
    const userRole = await prisma.scopeRole.findFirst({
      where: {
        userId: session.user.id,
        scopeId,
        role: RoleType.ADMIN,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: 'Only admins can cancel subscriptions' },
        { status: 403 }
      );
    }

    // Get subscription
    const subscription = await getSubscriptionByScope(scopeId);
    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    if (subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const immediate = body.immediate === true;

    // Cancel with Paystack (disable authorization)
    if (subscription.externalSubscriptionId) {
      const result = await cancelPaystackAuthorization(
        subscription.externalSubscriptionId
      );

      if (!result.success) {
        console.error('Paystack cancellation failed:', result.message);
        // Continue anyway - we can still cancel in our system
      }
    }

    // Update subscription
    await cancelSubscription(subscription.id, !immediate);

    return NextResponse.json({
      success: true,
      immediate,
      activeUntil: immediate ? null : subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to cancel subscription',
      },
      { status: 500 }
    );
  }
}
```

---

## Updated Database Commands

**File**: `src/prisma/commands/subscription-commands.ts`

```typescript
import { prisma } from '../prisma';
import { SubscriptionStatus, TransactionType } from '@prisma/client';

export interface CreateSubscriptionData {
  scopeId: number;
  reference: string;
  amount: number;
  currency: string;
  billingCycle: string;
  subscribedBy: string;
}

export async function createSubscription(data: CreateSubscriptionData) {
  return prisma.subscription.create({
    data: {
      scopeId: data.scopeId,
      reference: data.reference,
      amount: data.amount,
      currency: data.currency,
      billingCycle: data.billingCycle,
      subscribedBy: data.subscribedBy,
      status: SubscriptionStatus.PENDING,
    },
  });
}

export interface ActivateSubscriptionData {
  subscriptionId: number;
  externalCustomerId?: string;
  externalSubscriptionId?: string;
  periodStart: Date;
  periodEnd: Date;
}

export async function activateSubscription(data: ActivateSubscriptionData) {
  return prisma.subscription.update({
    where: { id: data.subscriptionId },
    data: {
      status: SubscriptionStatus.ACTIVE,
      externalCustomerId: data.externalCustomerId,
      externalSubscriptionId: data.externalSubscriptionId,
      currentPeriodStart: data.periodStart,
      currentPeriodEnd: data.periodEnd,
    },
  });
}

export async function updateSubscriptionStatus(
  subscriptionId: number,
  status: SubscriptionStatus
) {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status },
  });
}

export async function cancelSubscription(
  subscriptionId: number,
  cancelAtPeriodEnd: boolean = true
) {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      cancelAtPeriodEnd,
      status: cancelAtPeriodEnd ? SubscriptionStatus.ACTIVE : SubscriptionStatus.CANCELLED,
    },
  });
}

export interface CreateTransactionData {
  subscriptionId: number;
  type: TransactionType;
  amount: number;
  currency: string;
  externalPaymentId?: string;
  externalMetadata?: any;
  processedAt?: Date;
}

export async function createSubscriptionTransaction(data: CreateTransactionData) {
  return prisma.subscriptionTransaction.create({
    data: {
      subscriptionId: data.subscriptionId,
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      externalPaymentId: data.externalPaymentId,
      externalMetadata: data.externalMetadata,
      processedAt: data.processedAt,
    },
  });
}

export async function updateSubscriptionPeriod(
  subscriptionId: number,
  periodStart: Date,
  periodEnd: Date
) {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
  });
}
```

---

## Updated Database Queries

**File**: `src/prisma/queries/subscription-queries.ts`

Add this function:

```typescript
export async function getSubscriptionByReference(reference: string): Promise<Subscription | null> {
  return prisma.subscription.findUnique({
    where: { reference },
  });
}
```

---

## Migration

**Create migration:**
```bash
npx prisma migrate dev --name simplify_billing_schema
```

**Migration SQL:**
```sql
-- Add new columns
ALTER TABLE "Subscription" ADD COLUMN "reference" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "externalCustomerId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "externalSubscriptionId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "externalMetadata" JSONB;
ALTER TABLE "Subscription" ADD COLUMN "subscribedBy" TEXT;

-- Migrate existing data (if any)
UPDATE "Subscription"
SET "reference" = 'legacy_' || "id"::text
WHERE "reference" IS NULL;

UPDATE "Subscription"
SET "externalSubscriptionId" = "payfastSubscriptionId"
WHERE "payfastSubscriptionId" IS NOT NULL;

-- Make reference and subscribedBy required
ALTER TABLE "Subscription" ALTER COLUMN "reference" SET NOT NULL;
ALTER TABLE "Subscription" ALTER COLUMN "subscribedBy" SET NOT NULL;

-- Drop old columns
ALTER TABLE "Subscription" DROP COLUMN IF EXISTS "payfastToken";
ALTER TABLE "Subscription" DROP COLUMN IF EXISTS "payfastSubscriptionId";

-- Add unique constraint
CREATE UNIQUE INDEX "Subscription_reference_key" ON "Subscription"("reference");
CREATE UNIQUE INDEX "Subscription_externalSubscriptionId_key" ON "Subscription"("externalSubscriptionId");
CREATE INDEX "Subscription_reference_idx" ON "Subscription"("reference");

-- Update SubscriptionTransaction
ALTER TABLE "SubscriptionTransaction" ADD COLUMN "externalMetadata" JSONB;
ALTER TABLE "SubscriptionTransaction" ADD COLUMN "processedAt" TIMESTAMP(3);
ALTER TABLE "SubscriptionTransaction" RENAME COLUMN "payfastPaymentId" TO "externalPaymentId";

-- Add index
CREATE INDEX "SubscriptionTransaction_externalPaymentId_idx" ON "SubscriptionTransaction"("externalPaymentId");
```

---

## Summary

### What We Have Now

✅ **Simple, pragmatic design**
✅ **Provider-agnostic schema** (no "paystack" mentions)
✅ **All Paystack logic in one file** (`src/utils/paystack.ts`)
✅ **Provider-specific endpoints** (`/api/v1/billing/paystack/webhook`)
✅ **Easy to extend later** (add `/api/v1/billing/stripe/webhook` when needed)
✅ **Minimal files and complexity**

### Files to Create

1. `src/utils/paystack.ts` - All Paystack logic
2. `src/app/api/v1/billing/paystack/webhook/route.ts` - Webhook handler
3. `src/app/api/v1/billing/subscriptions/[scopeId]/create/route.ts` - Create subscription
4. `src/app/api/v1/billing/subscriptions/[scopeId]/route.ts` - Get subscription
5. `src/app/api/v1/billing/subscriptions/[scopeId]/cancel/route.ts` - Cancel subscription
6. Update `subscription-commands.ts` with new field names
7. Update `subscription-queries.ts` with `getSubscriptionByReference()`

### Ready to Implement?

This is much simpler than the adapter pattern - no factories, no interfaces, just straightforward code. When you need to add Stripe later, you can create `src/utils/stripe.ts` and `/api/v1/billing/stripe/webhook`.

Want me to proceed with creating these files?
