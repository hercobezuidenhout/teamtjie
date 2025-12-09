# Billing Implementation - Phased Rollout Plan

## Overview

Each phase delivers a user-testable feature. After each deployment, you can log into the app and test the new functionality as an actual user. We build incrementally, ensuring each piece works before moving to the next.

## Testing Approach

After each phase deployment:

1. Log into the app as a user
2. Navigate to the relevant section
3. Test the new functionality
4. Verify it works as expected
5. Move to next phase

---

## Phase 1: Foundation (Backend Only)

**User-Testable**: No (infrastructure only)
**What Users See**: Nothing changes
**Deploy & Test**: Verify app still works normally

### What We Build

1. Database schema (Subscription & SubscriptionTransaction tables)
2. PayFast service functions
3. Subscription queries and commands
4. Environment variables

### Files

- `src/prisma/schema.prisma`
- `src/config/payfast.ts`
- `src/services/billing/payfast-service.ts`
- `src/prisma/queries/subscription-queries.ts`
- `src/prisma/commands/subscription-commands.ts`
- `.env`

### How to Test

1. Deploy to staging
2. Log into app
3. Navigate around - everything should work as before
4. Check database - new tables exist but are empty
5. No errors in console

### Commit

```
feat(billing): add subscription database schema and PayFast integration

- Add Subscription and SubscriptionTransaction models
- Implement PayFast signature generation and verification
- Create subscription database queries and commands
- Add PayFast configuration
```

---

## Phase 2: Premium Feature Gates

**User-Testable**: YES!
**What Users See**: "Upgrade to Premium" prompts on sentiments and health checks
**Deploy & Test**: Try to use premium features, see upgrade prompts

### What We Build

1. Feature protection utility
2. Premium feature gate component
3. Update sentiments and health-checks to require subscription
4. Basic upgrade prompt UI

### Files

- `src/utils/require-subscription.ts`
- `src/lib/components/PremiumFeatureGate/PremiumFeatureGate.tsx`
- `src/app/api/sentiments/route.ts` (update)
- `src/app/api/health-checks/route.ts` (update)

### How to Test

1. Deploy to staging
2. Log into app as team admin
3. Navigate to team → Try to create sentiment
4. **Expected**: See "Premium Feature - Upgrade for R99/month" message
5. Navigate to team → Try to create health check
6. **Expected**: See "Premium Feature - Upgrade for R99/month" message
7. Click "Upgrade" button (won't work yet, but should be visible)

### Commit

```
feat(billing): add premium feature gates for sentiments and health checks

- Protect sentiments and health-checks behind subscription
- Add PremiumFeatureGate component with upgrade prompts
- Return 402 Payment Required for non-subscribers
- Display R99/month pricing
```

---

## Phase 3: Team Upgrade Flow (Part 1: UI Only)

**User-Testable**: YES!
**What Users See**: Billing page in team settings with upgrade button
**Deploy & Test**: Navigate to billing page, see upgrade interface

### What We Build

1. Team billing settings page
2. Upgrade card component
3. React Query hooks (queries only, no mutations yet)
4. API endpoints for reading subscriptions

### Files

- `src/services/endpoints.ts` (update)
- `src/services/billing/queries/use-scope-subscription-query.ts`
- `src/app/api/v1/billing/subscriptions/route.ts`
- `src/app/api/v1/billing/subscriptions/[scopeId]/route.ts`
- `src/app/(settings)/settings/[scopeId]/billing/page.tsx`
- `src/app/(settings)/settings/[scopeId]/billing/components/UpgradeCard.tsx`

### How to Test

1. Deploy to staging
2. Log into app as team admin
3. Navigate to team → Settings → Billing (new menu item)
4. **Expected**: See "Upgrade to Premium" card
5. **Expected**: Shows R99/month pricing
6. **Expected**: Shows features included (Daily Sentiments, Health Checks)
7. Button doesn't work yet (that's Phase 4)

### Commit

```
feat(billing): add team billing settings page with upgrade UI

- Create billing page in team settings
- Add upgrade card showing R99/month pricing
- List premium features (sentiments, health checks)
- Add API endpoints to read subscription status
```

---

## Phase 4: Complete Upgrade Flow

**User-Testable**: YES! (Full payment flow)
**What Users See**: Can click upgrade, go to PayFast, complete payment
**Deploy & Test**: Complete full payment in sandbox

### What We Build

1. Create subscription API endpoint
2. Create subscription mutation hook
3. Wire up upgrade button
4. PayFast webhook handler
5. Subscription manager

### Files

- `src/app/api/v1/billing/subscriptions/[scopeId]/create/route.ts`
- `src/app/api/v1/billing/webhook/route.ts`
- `src/services/billing/subscription-manager.ts`
- `src/services/billing/mutations/use-create-subscription-mutation.ts`
- `src/app/(settings)/settings/[scopeId]/billing/components/UpgradeCard.tsx` (update)

### How to Test

1. Deploy to staging
2. Log into app as team admin
3. Navigate to team → Settings → Billing
4. Click "Upgrade to Premium"
5. **Expected**: Redirect to PayFast sandbox payment page
6. Complete payment with test card
7. **Expected**: Redirect back to app
8. **Expected**: Billing page now shows "Active Subscription"
9. Navigate to team → Try to create sentiment
10. **Expected**: Can now create sentiment (no upgrade prompt)
11. Navigate to team → Try to create health check
12. **Expected**: Can now create health check (no upgrade prompt)

### Commit

```
feat(billing): implement complete subscription upgrade flow

- Add subscription creation endpoint
- Implement PayFast webhook handler
- Process payment complete, failed, and cancelled events
- Wire up upgrade button to initiate payment
- Activate subscription after successful payment
```

---

## Phase 5: Subscription Management

**User-Testable**: YES!
**What Users See**: Can view and cancel subscriptions
**Deploy & Test**: View subscription details, cancel subscription

### What We Build

1. Manage subscription component
2. Cancel subscription API endpoint
3. Cancel subscription mutation hook
4. Subscription status display
5. Cancellation confirmation dialog

### Files

- `src/app/api/v1/billing/subscriptions/[scopeId]/cancel/route.ts`
- `src/services/billing/mutations/use-cancel-subscription-mutation.ts`
- `src/app/(settings)/settings/[scopeId]/billing/components/ManageSubscription.tsx`

### How to Test

1. Deploy to staging
2. Log into app with active subscription (from Phase 4)
3. Navigate to team → Settings → Billing
4. **Expected**: See subscription details (status, amount, next billing date)
5. Click "Cancel Subscription"
6. **Expected**: See confirmation dialog
7. Confirm cancellation
8. **Expected**: Status changes to "Cancelled - Active until [date]"
9. **Expected**: Can still use premium features until period end
10. Wait for period to end (or manually expire in database)
11. **Expected**: Premium features blocked again

### Commit

```
feat(billing): add subscription management and cancellation

- Add manage subscription component showing status and details
- Implement subscription cancellation endpoint
- Add cancellation confirmation dialog
- Support cancel-at-period-end (keeps access until billing date)
- Update UI to show cancellation status
```

---

## Phase 6: User Billing Dashboard

**User-Testable**: YES!
**What Users See**: Central billing page showing all subscriptions
**Deploy & Test**: View all team subscriptions in one place

### What We Build

1. User billing dashboard page
2. Subscription cards component
3. Billing summary component
4. Payment history component
5. User subscriptions query

### Files

- `src/services/billing/queries/use-user-subscriptions-query.ts`
- `src/app/api/v1/billing/transactions/route.ts`
- `src/app/(me)/billing/page.tsx`
- `src/app/(me)/billing/components/SubscriptionCard.tsx`
- `src/app/(me)/billing/components/BillingSummary.tsx`
- `src/app/(me)/billing/components/PaymentHistory.tsx`

### How to Test

1. Deploy to staging
2. Log into app with multiple team subscriptions
3. Navigate to user menu → Billing (new menu item)
4. **Expected**: See all team subscriptions listed
5. **Expected**: See total monthly cost (e.g., "R198/month" for 2 teams)
6. **Expected**: See subscription status for each team
7. **Expected**: See payment history
8. Click on a team subscription card
9. **Expected**: Navigate to that team's billing page

### Commit

```
feat(billing): add user billing dashboard

- Create central billing page showing all subscriptions
- Display subscription cards for each team
- Show total monthly cost across all teams
- Add payment history view
- Link to individual team billing pages
```

---

## Phase 7: Email Notifications

**User-Testable**: YES!
**What Users See**: Receive emails for subscription events
**Deploy & Test**: Check email after subscription actions

### What We Build

1. Email templates (activation, cancellation, payment failed)
2. Notification service functions
3. Integrate notifications into webhook and API

### Files

- `src/backend/notifications/emails/subscription-activated.ts`
- `src/backend/notifications/emails/subscription-cancelled.ts`
- `src/backend/notifications/emails/payment-failed.ts`
- `src/backend/notifications/services/send-subscription-notification.ts`
- `src/services/billing/subscription-manager.ts` (update)
- `src/app/api/v1/billing/subscriptions/[scopeId]/cancel/route.ts` (update)

### How to Test

1. Deploy to staging
2. Create new subscription
3. **Expected**: Receive "Subscription Activated" email
4. Check email content and links
5. Cancel subscription
6. **Expected**: Receive "Subscription Cancelled" email
7. Simulate failed payment (via PayFast sandbox)
8. **Expected**: Receive "Payment Failed" email

### Commit

```
feat(billing): add email notifications for subscription events

- Send activation email when subscription starts
- Send cancellation email when subscription cancelled
- Send payment failed email for failed payments
- Include billing dashboard links in all emails
- Use branded email templates
```

---

## Phase 8: Polish & Error Handling

**User-Testable**: YES!
**What Users See**: Better loading states, error messages, confirmations
**Deploy & Test**: Try error scenarios, verify good UX

### What We Build

1. Loading states for all actions
2. Error messages and toast notifications
3. Better confirmation dialogs
4. Improved error handling
5. Grace period for failed payments

### Files

- All component files (add loading/error states)
- All API files (improve error handling)
- `src/services/billing/subscription-manager.ts` (add grace period)

### How to Test

1. Deploy to staging
2. Test slow network (throttle in DevTools)
3. **Expected**: See loading spinners during actions
4. Test with invalid data
5. **Expected**: See clear error messages
6. Test cancellation
7. **Expected**: See confirmation dialog before cancelling
8. Simulate payment failure
9. **Expected**: Subscription enters grace period, not immediately cancelled

### Commit

```
feat(billing): improve UX with loading states and error handling

- Add loading spinners to all billing actions
- Show toast notifications for success/error
- Add confirmation dialogs for destructive actions
- Improve error messages for common scenarios
- Implement grace period for failed payments
```

---

## Summary: User Testing Flow

### After Phase 2 (Feature Gates)

✅ Log in → Try premium features → See upgrade prompts

### After Phase 3 (Billing UI)

✅ Log in → Team settings → See billing page with upgrade option

### After Phase 4 (Payment Flow)

✅ Log in → Upgrade team → Pay with PayFast → Use premium features

### After Phase 5 (Management)

✅ Log in → View subscription → Cancel subscription → Verify access

### After Phase 6 (Dashboard)

✅ Log in → View all subscriptions → See total cost → Check history

### After Phase 7 (Emails)

✅ Perform actions → Check email → Verify notifications received

### After Phase 8 (Polish)

✅ Test all flows → Verify smooth UX → Check error handling

---

## Recommended Implementation Order

**Start Here**: Phase 1 (Foundation)
**First User-Testable**: Phase 2 (Feature Gates)
**MVP Complete**: Phase 5 (Management)
**Production Ready**: Phase 8 (Polish)

Each phase builds on the previous one, and each phase (after Phase 1) gives you something concrete to test as a user in the app!
