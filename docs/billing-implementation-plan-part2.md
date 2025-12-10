# Billing Feature Implementation Plan - Part 2

## Continuation of Implementation Details

---

## 10. Environment Variables

Add to `.env`:

```bash
# PayFast Configuration
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase

# App URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 11. Notification System

### Email Notifications

Create [`src/backend/notifications/emails/subscription-activated.ts`](src/backend/notifications/emails/subscription-activated.ts:1):

```typescript
export const subscriptionActivatedEmail = (params: {
  userName: string;
  scopeName: string;
  amount: string;
  nextBillingDate: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4299e1; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f7fafc; }
    .button { background: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #718096; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Subscription Activated! 🎉</h1>
    </div>
    <div class="content">
      <p>Hi ${params.userName},</p>
      <p>Your premium subscription for <strong>${params.scopeName}</strong> has been successfully activated!</p>
      
      <h3>Subscription Details:</h3>
      <ul>
        <li><strong>Amount:</strong> ${params.amount}</li>
        <li><strong>Next Billing Date:</strong> ${params.nextBillingDate}</li>
      </ul>
      
      <p>You now have access to:</p>
      <ul>
        <li>✅ Daily Sentiments</li>
        <li>✅ Health Checks</li>
      </ul>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing" class="button">View Billing Dashboard</a>
      
      <p>Thank you for upgrading!</p>
    </div>
    <div class="footer">
      <p>You can manage your subscription anytime from your billing dashboard.</p>
    </div>
  </div>
</body>
</html>
`;
```

Create [`src/backend/notifications/emails/subscription-cancelled.ts`](src/backend/notifications/emails/subscription-cancelled.ts:1):

```typescript
export const subscriptionCancelledEmail = (params: {
  userName: string;
  scopeName: string;
  endDate: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #e53e3e; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f7fafc; }
    .button { background: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #718096; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Subscription Cancelled</h1>
    </div>
    <div class="content">
      <p>Hi ${params.userName},</p>
      <p>Your subscription for <strong>${params.scopeName}</strong> has been cancelled.</p>
      
      <p>You will continue to have access to premium features until <strong>${params.endDate}</strong>.</p>
      
      <p>After this date, the following features will no longer be available:</p>
      <ul>
        <li>Daily Sentiments</li>
        <li>Health Checks</li>
      </ul>
      
      <p>Changed your mind? You can reactivate your subscription anytime.</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing" class="button">Reactivate Subscription</a>
      
      <p>We're sorry to see you go!</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact our support team.</p>
    </div>
  </div>
</body>
</html>
`;
```

Create [`src/backend/notifications/emails/payment-failed.ts`](src/backend/notifications/emails/payment-failed.ts:1):

```typescript
export const paymentFailedEmail = (params: {
  userName: string;
  scopeName: string;
  amount: string;
  retryDate: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ed8936; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f7fafc; }
    .button { background: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #718096; font-size: 12px; }
    .warning { background: #fef5e7; border-left: 4px solid #ed8936; padding: 12px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Failed</h1>
    </div>
    <div class="content">
      <p>Hi ${params.userName},</p>
      
      <div class="warning">
        <strong>⚠️ Action Required</strong><br>
        We were unable to process your payment for <strong>${params.scopeName}</strong>.
      </div>
      
      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Amount:</strong> ${params.amount}</li>
        <li><strong>Next Retry:</strong> ${params.retryDate}</li>
      </ul>
      
      <p>Please update your payment method to ensure uninterrupted access to premium features.</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing" class="button">Update Payment Method</a>
      
      <p>If payment is not received, your subscription will be suspended after the grace period.</p>
    </div>
    <div class="footer">
      <p>Need help? Contact our support team.</p>
    </div>
  </div>
</body>
</html>
`;
```

### Notification Service

Create [`src/backend/notifications/services/send-subscription-notification.ts`](src/backend/notifications/services/send-subscription-notification.ts:1):

```typescript
import { sendEmail } from "./send-email";
import { subscriptionActivatedEmail } from "../emails/subscription-activated";
import { subscriptionCancelledEmail } from "../emails/subscription-cancelled";
import { paymentFailedEmail } from "../emails/payment-failed";
import { getUserById } from "@/prisma/queries/user-queries";
import { getScopeById } from "@/prisma/queries/scope-queries";

export async function sendSubscriptionActivatedNotification(params: {
  userId: string;
  scopeId: number;
  amount: number;
  nextBillingDate: Date;
}) {
  const user = await getUserById(params.userId);
  const scope = await getScopeById(params.scopeId);

  if (!user?.email) return;

  await sendEmail({
    to: user.email,
    subject: `${scope.name} Premium Subscription Activated`,
    html: subscriptionActivatedEmail({
      userName: user.name,
      scopeName: scope.name,
      amount: `R${(params.amount / 100).toFixed(2)}`,
      nextBillingDate: params.nextBillingDate.toLocaleDateString("en-ZA"),
    }),
  });
}

export async function sendSubscriptionCancelledNotification(params: {
  userId: string;
  scopeId: number;
  endDate: Date;
}) {
  const user = await getUserById(params.userId);
  const scope = await getScopeById(params.scopeId);

  if (!user?.email) return;

  await sendEmail({
    to: user.email,
    subject: `${scope.name} Subscription Cancelled`,
    html: subscriptionCancelledEmail({
      userName: user.name,
      scopeName: scope.name,
      endDate: params.endDate.toLocaleDateString("en-ZA"),
    }),
  });
}

export async function sendPaymentFailedNotification(params: {
  userId: string;
  scopeId: number;
  amount: number;
  retryDate: Date;
}) {
  const user = await getUserById(params.userId);
  const scope = await getScopeById(params.scopeId);

  if (!user?.email) return;

  await sendEmail({
    to: user.email,
    subject: `Payment Failed for ${scope.name}`,
    html: paymentFailedEmail({
      userName: user.name,
      scopeName: scope.name,
      amount: `R${(params.amount / 100).toFixed(2)}`,
      retryDate: params.retryDate.toLocaleDateString("en-ZA"),
    }),
  });
}
```

---

## 12. Analytics Tracking

### Analytics Events

Create [`src/services/analytics/billing-events.ts`](src/services/analytics/billing-events.ts:1):

```typescript
import { track } from "./analytics-service";

export const BillingEvents = {
  SUBSCRIPTION_INITIATED: "subscription_initiated",
  SUBSCRIPTION_ACTIVATED: "subscription_activated",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
  PAYMENT_COMPLETED: "payment_completed",
  PAYMENT_FAILED: "payment_failed",
  UPGRADE_BUTTON_CLICKED: "upgrade_button_clicked",
  BILLING_PAGE_VIEWED: "billing_page_viewed",
  PREMIUM_FEATURE_BLOCKED: "premium_feature_blocked",
} as const;

export function trackSubscriptionInitiated(params: {
  scopeId: number;
  scopeName: string;
  amount: number;
}) {
  track(BillingEvents.SUBSCRIPTION_INITIATED, {
    scope_id: params.scopeId,
    scope_name: params.scopeName,
    amount: params.amount,
    currency: "ZAR",
  });
}

export function trackSubscriptionActivated(params: {
  scopeId: number;
  scopeName: string;
  subscriptionId: number;
  amount: number;
}) {
  track(BillingEvents.SUBSCRIPTION_ACTIVATED, {
    scope_id: params.scopeId,
    scope_name: params.scopeName,
    subscription_id: params.subscriptionId,
    amount: params.amount,
    currency: "ZAR",
  });
}

export function trackSubscriptionCancelled(params: {
  scopeId: number;
  subscriptionId: number;
  reason?: string;
}) {
  track(BillingEvents.SUBSCRIPTION_CANCELLED, {
    scope_id: params.scopeId,
    subscription_id: params.subscriptionId,
    reason: params.reason,
  });
}

export function trackPaymentCompleted(params: {
  scopeId: number;
  subscriptionId: number;
  amount: number;
  type: "initial" | "recurring";
}) {
  track(BillingEvents.PAYMENT_COMPLETED, {
    scope_id: params.scopeId,
    subscription_id: params.subscriptionId,
    amount: params.amount,
    payment_type: params.type,
  });
}

export function trackPaymentFailed(params: {
  scopeId: number;
  subscriptionId: number;
  amount: number;
  errorCode?: string;
}) {
  track(BillingEvents.PAYMENT_FAILED, {
    scope_id: params.scopeId,
    subscription_id: params.subscriptionId,
    amount: params.amount,
    error_code: params.errorCode,
  });
}

export function trackUpgradeButtonClicked(params: {
  scopeId: number;
  location: string;
}) {
  track(BillingEvents.UPGRADE_BUTTON_CLICKED, {
    scope_id: params.scopeId,
    location: params.location,
  });
}

export function trackPremiumFeatureBlocked(params: {
  scopeId: number;
  feature: string;
}) {
  track(BillingEvents.PREMIUM_FEATURE_BLOCKED, {
    scope_id: params.scopeId,
    feature: params.feature,
  });
}
```

---

## 13. Testing Plan

### Unit Tests

#### PayFast Service Tests

Create [`src/services/billing/__tests__/payfast-service.test.ts`](src/services/billing/__tests__/payfast-service.test.ts:1):

```typescript
import { PayFastService } from "../payfast-service";

describe("PayFastService", () => {
  describe("generateSignature", () => {
    it("should generate correct MD5 signature", () => {
      const data = {
        merchant_id: "10000100",
        merchant_key: "46f0cd694581a",
        amount: "99.00",
      };

      const signature = PayFastService.generateSignature(data);
      expect(signature).toBeDefined();
      expect(signature.length).toBe(32);
    });
  });

  describe("verifySignature", () => {
    it("should verify valid signature", () => {
      const data = {
        merchant_id: "10000100",
        merchant_key: "46f0cd694581a",
        amount: "99.00",
      };

      const signature = PayFastService.generateSignature(data);
      const isValid = PayFastService.verifySignature(data, signature);

      expect(isValid).toBe(true);
    });

    it("should reject invalid signature", () => {
      const data = {
        merchant_id: "10000100",
        merchant_key: "46f0cd694581a",
        amount: "99.00",
      };

      const isValid = PayFastService.verifySignature(data, "invalid_signature");
      expect(isValid).toBe(false);
    });
  });

  describe("isValidPayFastIP", () => {
    it("should accept valid PayFast IPs", () => {
      expect(PayFastService.isValidPayFastIP("197.97.145.144")).toBe(true);
      expect(PayFastService.isValidPayFastIP("197.97.145.145")).toBe(true);
    });

    it("should reject invalid IPs", () => {
      expect(PayFastService.isValidPayFastIP("192.168.1.1")).toBe(false);
      expect(PayFastService.isValidPayFastIP("10.0.0.1")).toBe(false);
    });
  });
});
```

#### Subscription Queries Tests

Create [`src/prisma/queries/__tests__/subscription-queries.test.ts`](src/prisma/queries/__tests__/subscription-queries.test.ts:1):

```typescript
import { hasActiveSubscription } from "../subscription-queries";
import { prisma } from "@/prisma";

describe("Subscription Queries", () => {
  describe("hasActiveSubscription", () => {
    it("should return true for active subscription", async () => {
      const scopeId = 1;

      // Mock subscription
      jest.spyOn(prisma.subscription, "findUnique").mockResolvedValue({
        id: 1,
        scopeId,
        status: "ACTIVE",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      } as any);

      const result = await hasActiveSubscription(scopeId);
      expect(result).toBe(true);
    });

    it("should return false for expired subscription", async () => {
      const scopeId = 1;

      jest.spyOn(prisma.subscription, "findUnique").mockResolvedValue({
        id: 1,
        scopeId,
        status: "ACTIVE",
        currentPeriodEnd: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      } as any);

      const result = await hasActiveSubscription(scopeId);
      expect(result).toBe(false);
    });

    it("should return false for non-existent subscription", async () => {
      jest.spyOn(prisma.subscription, "findUnique").mockResolvedValue(null);

      const result = await hasActiveSubscription(999);
      expect(result).toBe(false);
    });
  });
});
```

### Integration Tests

#### Subscription API Tests

Create [`src/pages/api/billing/__tests__/subscriptions.test.ts`](src/pages/api/billing/__tests__/subscriptions.test.ts:1):

```typescript
import { createMocks } from "node-mocks-http";
import handler from "../[[...slug]]";

describe("/api/billing/subscriptions", () => {
  describe("GET /api/billing/subscriptions", () => {
    it("should return user subscriptions", async () => {
      const { req, res } = createMocks({
        method: "GET",
        url: "/api/billing/subscriptions",
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty("subscriptions");
    });

    it("should require authentication", async () => {
      const { req, res } = createMocks({
        method: "GET",
        url: "/api/billing/subscriptions",
      });

      // Mock no session
      await handler(req, res);

      expect(res._getStatusCode()).toBe(401);
    });
  });

  describe("POST /api/billing/subscriptions/:scopeId/create", () => {
    it("should create subscription and return PayFast URL", async () => {
      const { req, res } = createMocks({
        method: "POST",
        url: "/api/billing/subscriptions/1/create",
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toHaveProperty("paymentUrl");
      expect(data).toHaveProperty("token");
    });

    it("should require admin permission", async () => {
      const { req, res } = createMocks({
        method: "POST",
        url: "/api/billing/subscriptions/1/create",
      });

      // Mock user without admin permission
      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
    });
  });
});
```

### E2E Tests

Create [`cypress/e2e/billing/subscription-flow.cy.ts`](cypress/e2e/billing/subscription-flow.cy.ts:1):

```typescript
describe("Subscription Flow", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/spaces/1/teams/1");
  });

  it("should show upgrade prompt for premium feature", () => {
    cy.visit("/spaces/1/teams/1/sentiments");
    cy.contains("Premium Feature").should("be.visible");
    cy.contains("Upgrade for R99/month").should("be.visible");
  });

  it("should navigate to billing page from upgrade prompt", () => {
    cy.visit("/spaces/1/teams/1/sentiments");
    cy.contains("Upgrade for R99/month").click();
    cy.url().should("include", "/settings/1/billing");
  });

  it("should initiate subscription process", () => {
    cy.visit("/settings/1/billing");
    cy.contains("Upgrade to Premium").click();

    // Should redirect to PayFast (in test, mock this)
    cy.url().should("include", "payfast");
  });

  it("should show subscription in billing dashboard", () => {
    // Mock active subscription
    cy.intercept("GET", "/api/billing/subscriptions", {
      subscriptions: [
        {
          id: 1,
          scopeId: 1,
          status: "ACTIVE",
          amount: 9900,
        },
      ],
    });

    cy.visit("/billing");
    cy.contains("Active Subscriptions").should("be.visible");
    cy.contains("R99.00").should("be.visible");
  });

  it("should allow cancelling subscription", () => {
    cy.visit("/settings/1/billing");
    cy.contains("Cancel Subscription").click();
    cy.contains("Confirm Cancellation").click();
    cy.contains("Subscription will end on").should("be.visible");
  });
});
```

---

## 14. Deployment Checklist

### Pre-Deployment

- [ ] Set up PayFast merchant account
- [ ] Configure PayFast sandbox for testing
- [ ] Add environment variables to production
- [ ] Test webhook endpoint is publicly accessible
- [ ] Configure PayFast webhook URL in merchant dashboard
- [ ] Test payment flow in sandbox environment
- [ ] Review and test all email templates
- [ ] Set up monitoring for webhook failures
- [ ] Configure alerts for failed payments
- [ ] Document rollback procedure

### Post-Deployment

- [ ] Monitor webhook logs for first 24 hours
- [ ] Test live payment with small amount
- [ ] Verify email notifications are sent
- [ ] Check analytics events are tracked
- [ ] Monitor subscription status updates
- [ ] Test cancellation flow
- [ ] Verify premium features are properly gated
- [ ] Check billing dashboard displays correctly
- [ ] Test payment failure scenarios
- [ ] Document any issues and resolutions

---

## 15. Monitoring and Alerts

### Key Metrics to Monitor

1. **Subscription Metrics**
   - New subscriptions per day
   - Active subscriptions count
   - Churn rate
   - Monthly recurring revenue (MRR)

2. **Payment Metrics**
   - Payment success rate
   - Failed payment count
   - Average payment processing time
   - Refund rate

3. **Technical Metrics**
   - Webhook processing time
   - Webhook failure rate
   - API response times
   - Database query performance

### Alert Configuration

Create [`src/services/monitoring/billing-alerts.ts`](src/services/monitoring/billing-alerts.ts:1):

```typescript
export const BillingAlerts = {
  WEBHOOK_FAILURE: {
    threshold: 3,
    window: "5m",
    severity: "high",
    message: "Multiple webhook processing failures detected",
  },
  PAYMENT_FAILURE_SPIKE: {
    threshold: 5,
    window: "1h",
    severity: "medium",
    message: "Unusual number of payment failures",
  },
  SUBSCRIPTION_CHURN_SPIKE: {
    threshold: 10,
    window: "1d",
    severity: "medium",
    message: "High subscription cancellation rate",
  },
};
```

---

## 16. Security Considerations

### Webhook Security

1. **IP Whitelisting**: Only accept webhooks from PayFast IPs
2. **Signature Verification**: Always verify PayFast signature
3. **Idempotency**: Handle duplicate webhook deliveries
4. **Rate Limiting**: Implement rate limiting on webhook endpoint

### Payment Data Security

1. **PCI Compliance**: Never store credit card details
2. **Encryption**: Encrypt sensitive subscription data at rest
3. **Audit Logging**: Log all billing-related actions
4. **Access Control**: Restrict billing data access to admins only

### API Security

1. **Authentication**: Require valid session for all billing endpoints
2. **Authorization**: Verify user has permission to manage subscription
3. **Input Validation**: Validate all input parameters
4. **CSRF Protection**: Implement CSRF tokens for state-changing operations

---

## 17. Support and Documentation

### User Documentation

Create help articles for:

- How to upgrade a team
- Understanding your bill
- Managing subscriptions
- Cancelling a subscription
- Payment failure troubleshooting
- Premium features overview

### Developer Documentation

Document:

- PayFast integration architecture
- Webhook handling flow
- Subscription lifecycle states
- Database schema
- API endpoints
- Testing procedures
- Troubleshooting guide

---

## 18. Future Enhancements

### Phase 2 Features

1. **Annual Billing**
   - Offer annual subscription at discounted rate
   - R990/year (2 months free)

2. **Team Bundles**
   - Discount for multiple team subscriptions
   - 5+ teams: 10% discount
   - 10+ teams: 20% discount

3. **Usage-Based Billing**
   - Track feature usage
   - Offer tiered pricing based on team size

4. **Self-Service Portal**
   - Update payment methods
   - Download invoices
   - View usage statistics

5. **Promo Codes**
   - Support discount codes
   - Free trial periods
   - Referral credits

### Technical Improvements

1. **Subscription Analytics Dashboard**
   - Revenue charts
   - Churn analysis
   - Cohort analysis

2. **Automated Dunning**
   - Retry failed payments automatically
   - Send reminder emails
   - Grace period management

3. **Multi-Currency Support**
   - Support USD, EUR, GBP
   - Dynamic currency conversion

4. **Invoice Generation**
   - PDF invoice generation
   - Automatic email delivery
   - Tax calculation

---

## Summary

This implementation plan provides a comprehensive approach to adding subscription billing to your application using PayFast. The key components include:

1. **Database Schema**: New tables for subscriptions and transactions
2. **PayFast Integration**: Secure payment processing and webhook handling
3. **API Endpoints**: Complete subscription management API
4. **Premium Feature Protection**: Middleware to gate features behind paywall
5. **User Interface**: Billing dashboard and upgrade flows
6. **Notifications**: Email alerts for subscription events
7. **Analytics**: Comprehensive tracking of billing events
8. **Testing**: Unit, integration, and E2E tests
9. **Security**: Robust security measures for payment handling
10. **Monitoring**: Alerts and metrics for system health

The implementation follows best practices for subscription billing, provides a smooth user experience, and includes comprehensive testing and monitoring to ensure reliability.
