# Phase 1: Billing Foundation - Implementation Plan

## Overview

Phase 1 establishes the backend infrastructure for billing without any user-facing changes. This includes database schema, PayFast integration, and core subscription management functions.

## Architecture Decisions

### Database Schema

We'll add two new tables to the Prisma schema:

- **Subscription**: Tracks team subscriptions with status, pricing, and billing cycles
- **SubscriptionTransaction**: Records all payment events from PayFast webhooks

### PayFast Integration

- Use sandbox environment for testing (merchant ID: 10000100, merchant key: 46f0cd694581a)
- Generate secure passphrase for signature verification
- Implement signature generation/verification for security
- Monthly subscription at R99/month

### File Structure

Following the existing project patterns:

```
src/
├── config/
│   └── payfast.ts                    # PayFast configuration
├── services/
│   └── billing/
│       └── payfast-service.ts        # PayFast integration functions
├── prisma/
│   ├── schema.prisma                 # Updated with Subscription models
│   ├── queries/
│   │   └── subscription-queries.ts   # Database read operations
│   └── commands/
│       └── subscription-commands.ts  # Database write operations
```

## Implementation Steps

### 1. Database Schema Updates

**File**: `src/prisma/schema.prisma`

Add new enums:

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
```

Add new models:

```prisma
model Subscription {
  id                    Int                        @id @default(autoincrement())
  scopeId               Int                        @unique
  scope                 Scope                      @relation(fields: [scopeId], references: [id], onDelete: Cascade)
  status                SubscriptionStatus         @default(PENDING)
  amount                Decimal                    @db.Decimal(10, 2)
  currency              String                     @default("ZAR")
  billingCycle          String                     @default("monthly")
  payfastToken          String?                    @unique
  payfastSubscriptionId String?                    @unique
  currentPeriodStart    DateTime?
  currentPeriodEnd      DateTime?
  cancelAtPeriodEnd     Boolean                    @default(false)
  createdAt             DateTime                   @default(now())
  updatedAt             DateTime                   @updatedAt
  transactions          SubscriptionTransaction[]

  @@index([scopeId, status])
  @@index([status, currentPeriodEnd])
}

model SubscriptionTransaction {
  id             Int            @id @default(autoincrement())
  subscriptionId Int
  subscription   Subscription   @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  type           TransactionType
  amount         Decimal        @db.Decimal(10, 2)
  currency       String
  payfastPaymentId String?
  metadata       Json?
  createdAt      DateTime       @default(now())

  @@index([subscriptionId, createdAt(sort: Desc)])
}
```

Update Scope model to include subscription:

```prisma
model Scope {
  // ... existing fields ...
  subscription         Subscription?
}
```

### 2. PayFast Configuration

**File**: `src/config/payfast.ts`

```typescript
export const PAYFAST_CONFIG = {
  // Sandbox credentials
  merchantId: process.env.PAYFAST_MERCHANT_ID || "10000100",
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a",
  passphrase: process.env.PAYFAST_PASSPHRASE || "",

  // URLs
  sandboxUrl: "https://sandbox.payfast.co.za/eng/process",
  productionUrl: "https://www.payfast.co.za/eng/process",

  // Environment
  isSandbox: process.env.NODE_ENV !== "production",

  // Subscription settings
  subscription: {
    amount: 99.0,
    currency: "ZAR",
    billingCycle: "monthly",
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
```

### 3. PayFast Service Functions

**File**: `src/services/billing/payfast-service.ts`

Key functions to implement:

- `generateSignature(data: Record<string, any>): string` - Create MD5 signature for PayFast
- `verifySignature(data: Record<string, any>, signature: string): boolean` - Verify webhook signatures
- `createPaymentData(scopeId: number, scopeName: string): PayfastPaymentData` - Generate payment form data
- `parseWebhookData(body: string): PayfastWebhookData` - Parse webhook POST data

Implementation details:

```typescript
import crypto from "crypto";
import { PAYFAST_CONFIG } from "@/config/payfast";

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

// Generate MD5 signature for PayFast
export function generateSignature(data: Record<string, any>): string {
  // Create parameter string (excluding signature field)
  const params = Object.keys(data)
    .filter(
      (key) => key !== "signature" && data[key] !== "" && data[key] !== null
    )
    .sort()
    .map(
      (key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`
    )
    .join("&");

  // Add passphrase if configured
  const signatureString = PAYFAST_CONFIG.passphrase
    ? `${params}&passphrase=${encodeURIComponent(PAYFAST_CONFIG.passphrase)}`
    : params;

  return crypto.createHash("md5").update(signatureString).digest("hex");
}

// Verify webhook signature
export function verifySignature(
  data: Record<string, any>,
  receivedSignature: string
): boolean {
  const calculatedSignature = generateSignature(data);
  return calculatedSignature === receivedSignature;
}

// Create payment data for subscription
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
    return_url: PAYFAST_CONFIG.returnUrl.replace(
      "[scopeId]",
      scopeId.toString()
    ),
    cancel_url: PAYFAST_CONFIG.cancelUrl.replace(
      "[scopeId]",
      scopeId.toString()
    ),
    notify_url: PAYFAST_CONFIG.notifyUrl,
    name_first: userName,
    email_address: userEmail,
    m_payment_id: `subscription_${scopeId}_${Date.now()}`,
    amount: PAYFAST_CONFIG.subscription.amount.toFixed(2),
    item_name: `${scopeName} - Premium Subscription`,
    item_description:
      "Monthly subscription for premium features (Daily Sentiments & Health Checks)",
    subscription_type: "1", // Subscription
    billing_date: billingDate.toISOString().split("T")[0],
    recurring_amount: PAYFAST_CONFIG.subscription.amount.toFixed(2),
    frequency: "3", // Monthly
    cycles: PAYFAST_CONFIG.subscription.cycles.toString(),
  };

  const signature = generateSignature(data);

  return {
    ...data,
    signature,
  } as PayfastPaymentData;
}

// Parse webhook data
export function parseWebhookData(body: string): PayfastWebhookData {
  const params = new URLSearchParams(body);
  const data: any = {};

  for (const [key, value] of params.entries()) {
    data[key] = value;
  }

  return data as PayfastWebhookData;
}
```

### 4. Subscription Queries

**File**: `src/prisma/queries/subscription-queries.ts`

```typescript
import { prisma } from "../prisma";
import { Subscription, SubscriptionStatus } from "@prisma/client";

export async function getSubscriptionByScope(
  scopeId: number
): Promise<Subscription | null> {
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
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getSubscriptionByToken(
  token: string
): Promise<Subscription | null> {
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
```

### 5. Subscription Commands

**File**: `src/prisma/commands/subscription-commands.ts`

```typescript
import { prisma } from "../prisma";
import { SubscriptionStatus, TransactionType } from "@prisma/client";

export interface CreateSubscriptionData {
  scopeId: number;
  amount: number;
  currency: string;
  billingCycle: string;
  payfastToken?: string;
}

export async function createSubscription(data: CreateSubscriptionData) {
  return prisma.subscription.create({
    data: {
      scopeId: data.scopeId,
      amount: data.amount,
      currency: data.currency,
      billingCycle: data.billingCycle,
      payfastToken: data.payfastToken,
      status: SubscriptionStatus.PENDING,
    },
  });
}

export async function activateSubscription(
  subscriptionId: number,
  payfastSubscriptionId: string,
  periodStart: Date,
  periodEnd: Date
) {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: SubscriptionStatus.ACTIVE,
      payfastSubscriptionId,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
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
      status: cancelAtPeriodEnd
        ? SubscriptionStatus.ACTIVE
        : SubscriptionStatus.CANCELLED,
    },
  });
}

export async function createSubscriptionTransaction(
  subscriptionId: number,
  type: TransactionType,
  amount: number,
  currency: string,
  payfastPaymentId?: string,
  metadata?: any
) {
  return prisma.subscriptionTransaction.create({
    data: {
      subscriptionId,
      type,
      amount,
      currency,
      payfastPaymentId,
      metadata,
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

### 6. Environment Variables

**File**: `.env.example`

Add these variables:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=your_secure_passphrase_here

# Billing
NEXT_PUBLIC_SUBSCRIPTION_PRICE=99.00
```

### 7. Update Endpoints

**File**: `src/services/endpoints.ts`

Add billing endpoints:

```typescript
export const ENDPOINTS = {
  // ... existing endpoints ...
  billing: {
    base: "/api/v1/billing",
    subscriptions: "/api/v1/billing/subscriptions",
    webhook: "/api/v1/billing/webhook",
  },
};
```

## Database Migration

Create migration:

```bash
npm run migrate-dev
```

Migration name: `add_billing_subscription_tables`

The migration will:

1. Create `SubscriptionStatus` enum
2. Create `TransactionType` enum
3. Create `Subscription` table with indexes
4. Create `SubscriptionTransaction` table with indexes
5. Add foreign key relationship to `Scope` table

## Testing Checklist

After implementation:

- [ ] Database migration runs successfully
- [ ] New tables exist in database (Subscription, SubscriptionTransaction)
- [ ] Existing app functionality works (no breaking changes)
- [ ] Can import and use PayFast service functions
- [ ] Signature generation produces consistent results
- [ ] Subscription queries return expected data structure
- [ ] Subscription commands create/update records correctly
- [ ] Environment variables are properly loaded
- [ ] No TypeScript compilation errors
- [ ] No console errors when running the app

## Verification Steps

1. **Database Schema**

   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('Subscription', 'SubscriptionTransaction');

   -- Check indexes
   SELECT indexname FROM pg_indexes
   WHERE tablename IN ('Subscription', 'SubscriptionTransaction');
   ```

2. **PayFast Service**

   ```typescript
   // Test signature generation
   import { generateSignature } from "@/services/billing/payfast-service";

   const testData = {
     merchant_id: "10000100",
     merchant_key: "46f0cd694581a",
     amount: "99.00",
   };

   const signature = generateSignature(testData);
   console.log("Signature:", signature); // Should be consistent
   ```

3. **Database Operations**

   ```typescript
   // Test subscription creation
   import { createSubscription } from "@/prisma/commands/subscription-commands";
   import { getSubscriptionByScope } from "@/prisma/queries/subscription-queries";

   // Create test subscription
   const sub = await createSubscription({
     scopeId: 1,
     amount: 99.0,
     currency: "ZAR",
     billingCycle: "monthly",
   });

   // Retrieve it
   const retrieved = await getSubscriptionByScope(1);
   console.log("Subscription:", retrieved);
   ```

## Commit Message

```
feat(billing): add subscription database schema and PayFast integration

- Add Subscription and SubscriptionTransaction models to Prisma schema
- Implement PayFast signature generation and verification
- Create subscription database queries and commands
- Add PayFast configuration with sandbox credentials
- Add billing endpoints to services
- Update environment variables for PayFast integration

Phase 1 of billing implementation - backend foundation only.
No user-facing changes in this phase.
```

## Next Steps

After Phase 1 is complete and tested:

- **Phase 2**: Add premium feature gates (user-testable)
- **Phase 3**: Create billing UI in team settings
- **Phase 4**: Implement complete payment flow with PayFast

## Notes

- This phase has NO user-facing changes
- All existing functionality should continue to work
- Database tables will be empty after migration
- PayFast integration is ready but not yet exposed via API
- Sandbox credentials are safe to commit (they're public test credentials)
- Production passphrase should be kept secret and set via environment variables
