# Provider-Agnostic Billing Architecture

**Created**: 2025-12-09
**Purpose**: Refactor billing system to support any payment provider via adapter pattern

---

## Problem Statement

Current implementation:
- Database schema has `payfastToken`, `payfastSubscriptionId` fields
- Tightly coupled to PayFast naming
- Using Paystack but schema references PayFast
- Cannot easily switch or add payment providers

## Solution: Adapter Pattern

### Core Principles

1. **Provider-agnostic schema** - No provider names in database
2. **Adapter interface** - Standard contract for all providers
3. **Pluggable providers** - Easy to add/switch providers
4. **Encapsulated logic** - Provider-specific code isolated

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  (Controllers, Services, Business Logic)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Payment Provider Interface                      │
│  - createSubscription()                                      │
│  - processWebhook()                                          │
│  - cancelSubscription()                                      │
│  - verifySignature()                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬──────────────┐
        ▼            ▼            ▼              ▼
┌──────────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐
│   Paystack   │ │ PayFast  │ │ Stripe  │ │  Manual  │
│   Adapter    │ │ Adapter  │ │ Adapter │ │  Adapter │
└──────────────┘ └──────────┘ └─────────┘ └──────────┘
        │            │            │              │
        └────────────┴────────────┴──────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│  (Provider-agnostic Subscription & Transaction models)      │
└─────────────────────────────────────────────────────────────┘
```

---

## New Database Schema

### Changes from Current Schema

**BEFORE (Provider-specific):**
```prisma
model Subscription {
  payfastToken          String?  @unique
  payfastSubscriptionId String?  @unique
  // ...
}
```

**AFTER (Provider-agnostic):**
```prisma
model Subscription {
  providerName         String   // "paystack", "payfast", "stripe", "manual"
  providerCustomerId   String?  @unique  // Provider's customer/user ID
  providerSubscriptionId String? @unique  // Provider's subscription ID
  providerMetadata     Json?    // Provider-specific extra data
  // ...
}

model SubscriptionTransaction {
  providerName      String
  providerPaymentId String?  // Provider's transaction/payment ID
  providerMetadata  Json?    // Provider-specific webhook data
  // ...
}
```

### Complete Updated Schema

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

enum PaymentProvider {
  PAYSTACK
  PAYFAST
  STRIPE
  MANUAL
}

model Subscription {
  id                     Int                        @id @default(autoincrement())
  scopeId                Int                        @unique
  scope                  Scope                      @relation(fields: [scopeId], references: [id], onDelete: Cascade)

  // Provider-agnostic fields
  providerName           PaymentProvider
  providerCustomerId     String?                    // e.g., Paystack customer code
  providerSubscriptionId String?                    // e.g., Paystack subscription code
  providerMetadata       Json?                      // Provider-specific data

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
  createdAt              DateTime                   @default(now())
  updatedAt              DateTime                   @updatedAt

  transactions           SubscriptionTransaction[]

  @@index([scopeId, status])
  @@index([status, currentPeriodEnd])
  @@index([providerName, providerSubscriptionId])
}

model SubscriptionTransaction {
  id                Int                @id @default(autoincrement())
  subscriptionId    Int
  subscription      Subscription       @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  // Provider-agnostic fields
  providerName      PaymentProvider
  providerPaymentId String?            // e.g., Paystack transaction reference
  providerMetadata  Json?              // Full webhook payload or payment details

  // Transaction details
  type              TransactionType
  amount            Decimal            @db.Decimal(10, 2)
  currency          String

  // Audit
  createdAt         DateTime           @default(now())

  @@index([subscriptionId, createdAt(sort: Desc)])
  @@index([providerName, providerPaymentId])
}
```

---

## Provider Adapter Interface

### Core Interface

**File**: `src/services/billing/providers/payment-provider.interface.ts`

```typescript
import { SubscriptionStatus } from '@prisma/client';

/**
 * Standard response for subscription creation
 */
export interface CreateSubscriptionResult {
  success: boolean;
  paymentUrl?: string;          // URL to redirect user for payment
  reference: string;            // Unique reference for this subscription attempt
  providerCustomerId?: string;  // Provider's customer ID
  error?: string;
}

/**
 * Standard response for webhook processing
 */
export interface WebhookResult {
  success: boolean;
  eventType: 'payment_complete' | 'payment_failed' | 'subscription_cancelled' | 'unknown';
  subscriptionId?: number;      // Our database subscription ID
  providerPaymentId?: string;   // Provider's payment/transaction ID
  amount?: number;              // Amount in cents
  metadata?: Record<string, any>; // Full webhook data
  error?: string;
}

/**
 * Subscription details from provider
 */
export interface ProviderSubscriptionDetails {
  isActive: boolean;
  status: SubscriptionStatus;
  nextBillingDate?: Date;
  amount?: number;
  providerSubscriptionId: string;
}

/**
 * Payment provider adapter interface
 * All payment providers must implement this interface
 */
export interface PaymentProviderAdapter {
  /**
   * Provider name (e.g., 'paystack', 'payfast', 'stripe')
   */
  readonly providerName: string;

  /**
   * Initialize a subscription payment flow
   * Returns payment URL or inline payment data
   */
  createSubscription(params: {
    scopeId: number;
    scopeName: string;
    userEmail: string;
    userName: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<CreateSubscriptionResult>;

  /**
   * Process webhook from provider
   * Verifies signature and extracts event data
   */
  processWebhook(params: {
    body: string | Record<string, any>;
    headers: Record<string, string>;
    signature?: string;
  }): Promise<WebhookResult>;

  /**
   * Verify webhook signature
   * Returns true if signature is valid
   */
  verifyWebhookSignature(params: {
    body: string | Record<string, any>;
    signature: string;
    secret?: string;
  }): boolean;

  /**
   * Cancel subscription with provider
   */
  cancelSubscription(params: {
    providerSubscriptionId: string;
    immediate?: boolean;
  }): Promise<{ success: boolean; error?: string }>;

  /**
   * Get subscription details from provider
   */
  getSubscriptionDetails(params: {
    providerSubscriptionId: string;
  }): Promise<ProviderSubscriptionDetails>;

  /**
   * Verify a payment was successful
   */
  verifyPayment(params: {
    reference: string;
  }): Promise<{
    success: boolean;
    amount?: number;
    paidAt?: Date;
    error?: string;
  }>;
}
```

---

## Paystack Adapter Implementation

**File**: `src/services/billing/providers/paystack/paystack.adapter.ts`

```typescript
import { PaymentProviderAdapter, CreateSubscriptionResult, WebhookResult } from '../payment-provider.interface';
import { BILLING_CONFIG } from '@/config/billing';
import crypto from 'crypto';

export class PaystackAdapter implements PaymentProviderAdapter {
  readonly providerName = 'paystack';

  async createSubscription(params: {
    scopeId: number;
    scopeName: string;
    userEmail: string;
    userName: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }): Promise<CreateSubscriptionResult> {
    try {
      const reference = this.generateReference(params.scopeId);

      // Paystack uses inline JS, so we return data for frontend
      // The actual initialization happens client-side
      return {
        success: true,
        reference,
        paymentUrl: undefined, // Paystack uses inline modal
        providerCustomerId: undefined, // Created after payment
      };
    } catch (error) {
      return {
        success: false,
        reference: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processWebhook(params: {
    body: string | Record<string, any>;
    headers: Record<string, string>;
    signature?: string;
  }): Promise<WebhookResult> {
    try {
      // Parse body if string
      const event = typeof params.body === 'string'
        ? JSON.parse(params.body)
        : params.body;

      // Verify signature
      const signature = params.signature || params.headers['x-paystack-signature'];
      if (!signature) {
        return {
          success: false,
          eventType: 'unknown',
          error: 'No signature provided',
        };
      }

      const isValid = this.verifyWebhookSignature({
        body: params.body,
        signature,
      });

      if (!isValid) {
        return {
          success: false,
          eventType: 'unknown',
          error: 'Invalid signature',
        };
      }

      // Process event
      const eventType = event.event;
      const data = event.data;

      switch (eventType) {
        case 'charge.success':
          return {
            success: true,
            eventType: 'payment_complete',
            providerPaymentId: data.reference,
            amount: data.amount, // Amount in kobo
            metadata: {
              customer: data.customer,
              authorization: data.authorization,
              paidAt: data.paid_at,
              channel: data.channel,
              ...data.metadata,
            },
          };

        case 'subscription.disable':
          return {
            success: true,
            eventType: 'subscription_cancelled',
            providerPaymentId: data.subscription_code,
            metadata: data,
          };

        default:
          return {
            success: true,
            eventType: 'unknown',
            metadata: event,
          };
      }
    } catch (error) {
      return {
        success: false,
        eventType: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  verifyWebhookSignature(params: {
    body: string | Record<string, any>;
    signature: string;
    secret?: string;
  }): boolean {
    try {
      const secret = params.secret || BILLING_CONFIG.paystack.secretKey;
      const body = typeof params.body === 'string'
        ? params.body
        : JSON.stringify(params.body);

      const hash = crypto
        .createHmac('sha512', secret)
        .update(body)
        .digest('hex');

      return hash === params.signature;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  async cancelSubscription(params: {
    providerSubscriptionId: string;
    immediate?: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `https://api.paystack.co/subscription/${params.providerSubscriptionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${BILLING_CONFIG.paystack.secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: params.providerSubscriptionId,
            token: params.immediate ? undefined : 'email_token', // Cancel at period end
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to cancel subscription',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getSubscriptionDetails(params: {
    providerSubscriptionId: string;
  }): Promise<any> {
    // Implementation for fetching subscription from Paystack API
    throw new Error('Not implemented yet');
  }

  async verifyPayment(params: { reference: string }): Promise<any> {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${params.reference}`,
        {
          headers: {
            Authorization: `Bearer ${BILLING_CONFIG.paystack.secretKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        return {
          success: false,
          error: data.message || 'Payment verification failed',
        };
      }

      return {
        success: data.data.status === 'success',
        amount: data.data.amount,
        paidAt: new Date(data.data.paid_at),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private generateReference(scopeId: number): string {
    return `subscription_${scopeId}_${Date.now()}`;
  }
}
```

---

## Provider Factory

**File**: `src/services/billing/providers/provider-factory.ts`

```typescript
import { PaymentProviderAdapter } from './payment-provider.interface';
import { PaystackAdapter } from './paystack/paystack.adapter';
import { PaymentProvider } from '@prisma/client';

/**
 * Factory to get the appropriate payment provider adapter
 */
export class PaymentProviderFactory {
  private static adapters: Map<PaymentProvider, PaymentProviderAdapter> = new Map();

  /**
   * Register a provider adapter
   */
  static register(provider: PaymentProvider, adapter: PaymentProviderAdapter): void {
    this.adapters.set(provider, adapter);
  }

  /**
   * Get adapter for a specific provider
   */
  static getAdapter(provider: PaymentProvider): PaymentProviderAdapter {
    const adapter = this.adapters.get(provider);

    if (!adapter) {
      throw new Error(`Payment provider adapter not found: ${provider}`);
    }

    return adapter;
  }

  /**
   * Get the default/active provider adapter
   */
  static getDefaultAdapter(): PaymentProviderAdapter {
    // Read from config or environment
    const defaultProvider = (process.env.PAYMENT_PROVIDER || 'PAYSTACK') as PaymentProvider;
    return this.getAdapter(defaultProvider);
  }
}

// Register available adapters
PaymentProviderFactory.register(PaymentProvider.PAYSTACK, new PaystackAdapter());
// Future: PaymentProviderFactory.register(PaymentProvider.PAYFAST, new PayfastAdapter());
// Future: PaymentProviderFactory.register(PaymentProvider.STRIPE, new StripeAdapter());
```

---

## Usage in Application Code

### Creating a Subscription

```typescript
// src/app/api/v1/billing/subscriptions/[scopeId]/create/route.ts
import { PaymentProviderFactory } from '@/services/billing/providers/provider-factory';
import { createSubscription } from '@/prisma/commands/subscription-commands';
import { PaymentProvider } from '@prisma/client';

export async function POST(request: Request) {
  const { scopeId, scopeName, userEmail, userName } = await request.json();

  // Get the provider adapter
  const provider = PaymentProviderFactory.getDefaultAdapter();

  // Create subscription via adapter
  const result = await provider.createSubscription({
    scopeId,
    scopeName,
    userEmail,
    userName,
    amount: 9900, // R99 in cents
    currency: 'ZAR',
    metadata: { source: 'web_app' },
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Save to database
  const subscription = await createSubscription({
    scopeId,
    amount: 99.00,
    currency: 'ZAR',
    billingCycle: 'monthly',
    providerName: PaymentProvider.PAYSTACK,
    providerCustomerId: result.providerCustomerId,
    reference: result.reference,
  });

  return NextResponse.json({
    success: true,
    reference: result.reference,
    paymentUrl: result.paymentUrl,
  });
}
```

### Processing Webhooks

```typescript
// src/app/api/v1/billing/webhook/route.ts
import { PaymentProviderFactory } from '@/services/billing/providers/provider-factory';
import { activateSubscription } from '@/prisma/commands/subscription-commands';

export async function POST(request: Request) {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  // Determine provider from header or config
  const provider = PaymentProviderFactory.getDefaultAdapter();

  // Process webhook
  const result = await provider.processWebhook({
    body,
    headers,
    signature: headers['x-paystack-signature'],
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Handle event
  if (result.eventType === 'payment_complete') {
    // Activate subscription
    await handlePaymentComplete(result);
  }

  return NextResponse.json({ success: true });
}
```

---

## Migration Plan

### Step 1: Create Migration

```bash
npx prisma migrate dev --name make_billing_provider_agnostic
```

### Step 2: Migration SQL

```sql
-- Add new enum for payment providers
CREATE TYPE "PaymentProvider" AS ENUM ('PAYSTACK', 'PAYFAST', 'STRIPE', 'MANUAL');

-- Add new columns
ALTER TABLE "Subscription" ADD COLUMN "providerName" "PaymentProvider";
ALTER TABLE "Subscription" ADD COLUMN "providerCustomerId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "providerSubscriptionId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "providerMetadata" JSONB;

-- Migrate existing data (if any exists)
UPDATE "Subscription" SET "providerName" = 'PAYSTACK';
UPDATE "Subscription" SET "providerSubscriptionId" = "payfastSubscriptionId" WHERE "payfastSubscriptionId" IS NOT NULL;

-- Make providerName required
ALTER TABLE "Subscription" ALTER COLUMN "providerName" SET NOT NULL;

-- Drop old columns
ALTER TABLE "Subscription" DROP COLUMN "payfastToken";
ALTER TABLE "Subscription" DROP COLUMN "payfastSubscriptionId";

-- Add indexes for new columns
CREATE UNIQUE INDEX "Subscription_providerCustomerId_key" ON "Subscription"("providerCustomerId");
CREATE UNIQUE INDEX "Subscription_providerSubscriptionId_key" ON "Subscription"("providerSubscriptionId");
CREATE INDEX "Subscription_providerName_providerSubscriptionId_idx" ON "Subscription"("providerName", "providerSubscriptionId");

-- Update SubscriptionTransaction table
ALTER TABLE "SubscriptionTransaction" ADD COLUMN "providerName" "PaymentProvider";
ALTER TABLE "SubscriptionTransaction" ADD COLUMN "providerMetadata" JSONB;
ALTER TABLE "SubscriptionTransaction" RENAME COLUMN "payfastPaymentId" TO "providerPaymentId";

-- Migrate existing transaction data
UPDATE "SubscriptionTransaction" SET "providerName" = 'PAYSTACK';

-- Make providerName required
ALTER TABLE "SubscriptionTransaction" ALTER COLUMN "providerName" SET NOT NULL;

-- Add index
CREATE INDEX "SubscriptionTransaction_providerName_providerPaymentId_idx" ON "SubscriptionTransaction"("providerName", "providerPaymentId");
```

### Step 3: Update Schema File

Replace the old schema with the new provider-agnostic version (shown above).

### Step 4: Regenerate Prisma Client

```bash
npx prisma generate
```

---

## Benefits

### 1. **Flexibility**
- Switch payment providers without database changes
- Support multiple providers simultaneously
- Easy to add new providers

### 2. **Maintainability**
- Provider-specific code isolated
- Single interface to maintain
- Clear separation of concerns

### 3. **Testability**
- Mock adapters for testing
- Test business logic without provider APIs
- Provider-specific tests isolated

### 4. **Scalability**
- Regional providers (Paystack for Africa, Stripe for US/EU)
- Fallback providers if one fails
- A/B test different providers

### 5. **Future-Proof**
- Add Stripe, PayFast, or custom providers easily
- Provider-agnostic business logic
- No vendor lock-in

---

## Future Enhancements

### Support Multiple Providers

```typescript
// Allow different teams to use different providers
model Subscription {
  providerName PaymentProvider  // Different per subscription
  // ...
}

// Factory can route to correct adapter
const provider = PaymentProviderFactory.getAdapter(subscription.providerName);
```

### Provider-Specific Features

```typescript
// Store provider-specific data in metadata
providerMetadata: {
  // Paystack-specific
  authorization_code: "AUTH_xxx",
  card_type: "visa",

  // Or PayFast-specific
  subscription_token: "xxx",
  billing_date: "2025-01-09"
}
```

### Adapter Extensions

```typescript
interface ExtendedPaystackAdapter extends PaymentProviderAdapter {
  // Paystack-specific methods
  createPlan(): Promise<any>;
  listTransactions(): Promise<any>;
  refundPayment(): Promise<any>;
}
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('PaystackAdapter', () => {
  it('should verify valid webhook signature', () => {
    const adapter = new PaystackAdapter();
    const isValid = adapter.verifyWebhookSignature({
      body: '{"event":"charge.success"}',
      signature: 'expected_hash',
    });
    expect(isValid).toBe(true);
  });

  it('should reject invalid signature', () => {
    const adapter = new PaystackAdapter();
    const isValid = adapter.verifyWebhookSignature({
      body: '{"event":"charge.success"}',
      signature: 'wrong_hash',
    });
    expect(isValid).toBe(false);
  });
});
```

### Integration Tests

```typescript
describe('Subscription Flow', () => {
  it('should create subscription with Paystack', async () => {
    const provider = PaymentProviderFactory.getAdapter('PAYSTACK');
    const result = await provider.createSubscription({
      scopeId: 1,
      scopeName: 'Test Team',
      userEmail: 'test@example.com',
      userName: 'Test User',
      amount: 9900,
      currency: 'ZAR',
    });

    expect(result.success).toBe(true);
    expect(result.reference).toBeDefined();
  });
});
```

---

## Summary

This provider-agnostic architecture:

✅ Removes all provider-specific references from schema
✅ Uses adapter pattern for flexibility
✅ Makes it easy to switch or add providers
✅ Encapsulates provider-specific logic
✅ Maintains clean separation of concerns
✅ Future-proofs the billing system

**Next Steps:**
1. Create migration to update schema
2. Implement PaymentProviderAdapter interface
3. Create PaystackAdapter
4. Update existing code to use adapters
5. Test thoroughly
6. Deploy

---

## File Structure

```
src/
├── services/
│   └── billing/
│       └── providers/
│           ├── payment-provider.interface.ts
│           ├── provider-factory.ts
│           ├── paystack/
│           │   ├── paystack.adapter.ts
│           │   ├── paystack.types.ts
│           │   └── paystack.utils.ts
│           ├── payfast/   (future)
│           │   └── payfast.adapter.ts
│           └── stripe/    (future)
│               └── stripe.adapter.ts
├── prisma/
│   └── schema.prisma (updated)
└── app/api/v1/billing/
    ├── webhook/route.ts (uses factory)
    └── subscriptions/[scopeId]/create/route.ts (uses factory)
```
