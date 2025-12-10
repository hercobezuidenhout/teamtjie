# Phase 1: Quick Start Guide

## Overview

This guide provides step-by-step instructions to implement Phase 1 of the billing system.

## Prerequisites

- Node.js and npm installed
- PostgreSQL database running
- Existing teamtjie project set up
- PayFast sandbox credentials (provided)

## Implementation Steps

### Step 1: Update Prisma Schema (5 min)

**File**: `src/prisma/schema.prisma`

Add at the end of the file (after existing enums):

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

Add at the end of the file (after existing models):

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
  id               Int             @id @default(autoincrement())
  subscriptionId   Int
  subscription     Subscription    @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  type             TransactionType
  amount           Decimal         @db.Decimal(10, 2)
  currency         String
  payfastPaymentId String?
  metadata         Json?
  createdAt        DateTime        @default(now())

  @@index([subscriptionId, createdAt(sort: Desc)])
}
```

Update the `Scope` model by adding this line in the model definition:

```prisma
model Scope {
  // ... existing fields ...
  subscription         Subscription?
}
```

### Step 2: Create PayFast Configuration (3 min)

**File**: `src/config/payfast.ts` (new file)

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

### Step 3: Create PayFast Service (10 min)

**File**: `src/services/billing/payfast-service.ts` (new file)

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

/**
 * Generate MD5 signature for PayFast
 */
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

/**
 * Verify webhook signature
 */
export function verifySignature(
  data: Record<string, any>,
  receivedSignature: string
): boolean {
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
```

### Step 4: Create Subscription Queries (8 min)

**File**: `src/prisma/queries/subscription-queries.ts` (new file)

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

### Step 5: Create Subscription Commands (10 min)

**File**: `src/prisma/commands/subscription-commands.ts` (new file)

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

### Step 6: Update Environment Variables (2 min)

**File**: `.env.example`

Add these lines at the end:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=your_secure_passphrase_here

# Billing
NEXT_PUBLIC_SUBSCRIPTION_PRICE=99.00
```

**File**: `.env` (your local environment)

Copy the same variables and set a secure passphrase:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=my_super_secure_passphrase_2024

# Billing
NEXT_PUBLIC_SUBSCRIPTION_PRICE=99.00
```

### Step 7: Update Endpoints (2 min)

**File**: `src/services/endpoints.ts`

Add to the existing `ENDPOINTS` object:

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

### Step 8: Run Database Migration (3 min)

```bash
# Generate migration
npm run migrate-dev

# When prompted, enter migration name:
add_billing_subscription_tables

# Generate Prisma client
npm run generate-prisma
```

### Step 9: Verify Installation (5 min)

1. **Check database tables:**

   ```sql
   -- Connect to your database and run:
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('Subscription', 'SubscriptionTransaction');
   ```

2. **Test TypeScript compilation:**

   ```bash
   npm run build
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Check for errors in console** - there should be none!

## Verification Checklist

- [ ] Prisma schema updated with new models
- [ ] PayFast config file created
- [ ] PayFast service file created
- [ ] Subscription queries file created
- [ ] Subscription commands file created
- [ ] Environment variables added
- [ ] Endpoints updated
- [ ] Migration ran successfully
- [ ] Prisma client regenerated
- [ ] TypeScript compiles without errors
- [ ] App runs without errors
- [ ] Database tables exist

## Testing the Implementation

### Test 1: Import Functions

Create a test file or use Node REPL:

```typescript
import { generateSignature } from "@/services/billing/payfast-service";
import { hasActiveSubscription } from "@/prisma/queries/subscription-queries";

// Test signature generation
const testData = {
  merchant_id: "10000100",
  amount: "99.00",
};
console.log("Signature:", generateSignature(testData));

// Test subscription check (should return false for non-existent subscription)
hasActiveSubscription(1).then((result) => {
  console.log("Has active subscription:", result); // Should be false
});
```

### Test 2: Database Operations

```typescript
import { createSubscription } from "@/prisma/commands/subscription-commands";
import { getSubscriptionByScope } from "@/prisma/queries/subscription-queries";

// Create test subscription
const sub = await createSubscription({
  scopeId: 1, // Use an existing scope ID
  amount: 99.0,
  currency: "ZAR",
  billingCycle: "monthly",
});

console.log("Created subscription:", sub);

// Retrieve it
const retrieved = await getSubscriptionByScope(1);
console.log("Retrieved subscription:", retrieved);
```

## Common Issues & Solutions

### Issue: Migration fails with "relation does not exist"

**Solution**: Make sure you're running the migration from the project root and the database connection is correct.

### Issue: TypeScript errors about Prisma types

**Solution**: Run `npm run generate-prisma` to regenerate the Prisma client.

### Issue: Import errors for new files

**Solution**: Restart your TypeScript server in VS Code (Cmd+Shift+P → "TypeScript: Restart TS Server")

### Issue: Environment variables not loading

**Solution**: Restart your development server after adding new environment variables.

## What's Next?

After Phase 1 is complete:

**Phase 2: Premium Feature Gates**

- Add subscription checks to sentiments and health-checks
- Show "Upgrade to Premium" prompts
- First user-visible changes!

## Time Estimate

Total implementation time: **45-60 minutes**

- Schema updates: 5 min
- Config file: 3 min
- PayFast service: 10 min
- Queries: 8 min
- Commands: 10 min
- Environment variables: 2 min
- Endpoints: 2 min
- Migration: 3 min
- Verification: 5 min
- Testing: 10 min

## Support

If you encounter issues:

1. Check the detailed implementation plan: `PHASE-1-IMPLEMENTATION-PLAN.md`
2. Review the architecture: `PHASE-1-ARCHITECTURE.md`
3. Verify all files are in the correct locations
4. Ensure database is running and accessible
5. Check environment variables are set correctly
