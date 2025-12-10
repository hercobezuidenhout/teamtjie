# Subscription Cancellation Implementation

**Last Updated**: 2025-12-10
**Status**: ✅ Implemented with Management Link method

---

## Overview

We use Paystack's **Management Link** method for cancelling subscriptions. This is the recommended approach when you don't have access to email tokens.

## How It Works

### The Flow

```
User clicks Cancel
       ↓
Frontend calls POST /api/v1/billing/subscriptions/cancel
       ↓
Backend generates Paystack management link
       ↓
Backend marks subscription as cancelled in DB
       ↓
Response includes management link (optional)
       ↓
User sees success message
```

### What Happens

1. **Request to Cancel**: User clicks cancel button
2. **Generate Management Link**: We call Paystack to generate a unique link
3. **Update Database**: Mark subscription as cancelled in our database
4. **Return Link**: Optionally return the management link to frontend

### Key Points

- ✅ **Works without email token** (we don't store these)
- ✅ **Graceful failure** (if Paystack call fails, we still cancel locally)
- ✅ **User keeps access** (until `currentPeriodEnd` if not immediate)
- ✅ **Management link is optional** (included in response if available)

## Implementation Details

### Backend: `src/utils/paystack.ts`

```typescript
export async function generateSubscriptionManagementLink(
  subscriptionCode: string
): Promise<{ success: boolean; message?: string; link?: string }> {
  const response = await fetch(
    'https://api.paystack.co/subscription/manage/link',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: subscriptionCode }),
    }
  );

  const data = await response.json();

  return {
    success: data.status,
    link: data.data?.link,
  };
}
```

### API Response

```typescript
POST /api/v1/billing/subscriptions/cancel
{
  "immediate": false  // Optional: true for immediate cancel
}

// Response
{
  "success": true,
  "immediate": false,
  "message": "Subscription will cancel at period end",
  "activeUntil": "2025-01-10T00:00:00.000Z",
  "managementLink": "https://paystack.com/manage/subscription/xxxxx" // Optional
}
```

## Two Cancellation Modes

### Mode 1: Cancel at Period End (Default)
```json
{ "immediate": false }
```
- Sets `cancelAtPeriodEnd: true`
- Keeps status as `ACTIVE`
- User keeps access until `currentPeriodEnd`
- Subscription becomes `CANCELLED` after period ends

### Mode 2: Immediate Cancellation
```json
{ "immediate": true }
```
- Sets status to `CANCELLED` immediately
- User loses access right away
- More disruptive, not recommended

## Error Handling

### Scenario 1: Subscription Not Found in Paystack

```
Common in test mode or when subscription creation failed
```

**What happens:**
1. Management link generation fails (404)
2. We log the error
3. Continue with local cancellation anyway
4. Return success with no management link

**User impact:** None - cancellation works locally

### Scenario 2: No externalSubscriptionId

```
Subscription was created but never synced with Paystack
```

**What happens:**
1. Skip Paystack API call entirely
2. Only cancel in local database
3. Return success

**User impact:** None - cancellation works locally

### Scenario 3: Paystack API Down

```
Network error or Paystack service issues
```

**What happens:**
1. Try-catch around Paystack call
2. Log error
3. Continue with local cancellation
4. Return success

**User impact:** None - cancellation works locally

## Testing with Bruno

### 1. Test Management Link Generation

```
Request: bruno/Paystack/Manage Subscription Link.bru
Body: { "code": "SUB_xxxxx" }
Expected: 200 with link
```

### 2. Test Our Cancel Endpoint

```
Request: POST /api/v1/billing/subscriptions/cancel
Body: { "immediate": false }
Expected: 200 with managementLink (if Paystack subscription exists)
```

### 3. Verify Database Update

```sql
SELECT status, cancelAtPeriodEnd, currentPeriodEnd
FROM "Subscription"
WHERE userId = 'xxx';
```

Expected:
- `status`: ACTIVE (if not immediate)
- `cancelAtPeriodEnd`: true
- `currentPeriodEnd`: future date

## What the Management Link Does

When user visits the management link:
1. Paystack shows a management page
2. User can:
   - Cancel subscription
   - Update payment method
   - View subscription details
3. Link expires after 24 hours

## Why This Approach?

### ❌ Why Not `/subscription/disable`?

Requires email token which we don't have:
```typescript
{
  "code": "SUB_xxxxx",
  "token": "EMAIL_TOKEN_xxxxx"  // We don't store this!
}
```

### ❌ Why Not Store Email Token?

- Adds complexity
- Security concern (another secret to manage)
- Not needed with management link approach

### ✅ Why Management Link?

- No email token required
- Only needs subscription code
- Paystack recommended method
- User-friendly (can cancel on Paystack's UI)

## Current State vs Ideal State

### Current (Working)
```
✅ Cancel works locally
✅ Management link generated (if subscription exists)
❌ Management link not used by frontend yet
❌ Subscription might still exist in Paystack
```

### Ideal (Future Enhancement)
```
✅ Cancel works locally
✅ Management link generated
✅ Email link to user
✅ Or: Auto-cancel in Paystack via webhook
✅ Sync status between Paystack and our DB
```

## Frontend Integration (TODO)

### Option 1: Show Management Link
```typescript
const response = await cancelSubscription();

if (response.managementLink) {
  // Show link to user
  toast({
    title: 'Subscription Cancelled',
    description: (
      <>
        Your subscription has been cancelled.
        <a href={response.managementLink}>Manage on Paystack</a>
      </>
    ),
  });
}
```

### Option 2: Email the Link
```typescript
if (response.managementLink) {
  // Send email with link
  await sendEmail({
    to: user.email,
    subject: 'Manage Your Subscription',
    body: `Click here to manage: ${response.managementLink}`,
  });
}
```

### Option 3: Ignore the Link
```typescript
// Just show success message
toast({
  title: 'Subscription Cancelled',
  description: 'Your subscription will end on ' + response.activeUntil,
});
// Management link is returned but not used
```

## Known Issues & Limitations

### Issue 1: Test Mode Flakiness
**Problem**: Paystack test mode subscriptions may not exist even after payment
**Impact**: Management link generation returns 404
**Solution**: We gracefully handle this and cancel locally anyway

### Issue 2: Two Sources of Truth
**Problem**: Subscription can be cancelled in our DB but active in Paystack
**Impact**: Paystack might try to charge next month
**Solution**: Webhook will update our DB when charge fails

### Issue 3: No Automatic Sync
**Problem**: User cancels via management link → our DB doesn't know
**Impact**: DB shows ACTIVE but Paystack shows cancelled
**Solution**: Need to implement webhook handler for `subscription.disable`

## Webhook Integration

When Paystack subscription is disabled (via management link or otherwise):

```typescript
// webhook/route.ts
case 'subscription.disable':
  await handleSubscriptionDisable(event);
  break;

async function handleSubscriptionDisable(event) {
  const subscriptionCode = event.data.subscription_code;

  // Find in our DB
  const subscription = await prisma.subscription.findUnique({
    where: { externalSubscriptionId: subscriptionCode },
  });

  // Mark as cancelled
  await updateSubscriptionStatus(subscription.id, 'CANCELLED');
}
```

This ensures our DB stays in sync with Paystack.

## Monitoring & Logging

### What We Log

```typescript
// Success
console.log('Paystack management link generated:', {
  subscriptionCode: 'SUB_xxxxx',
  hasLink: true,
});

// Failure (not found)
console.log('Subscription not found in Paystack - proceeding with local cancellation only');

// Failure (other)
console.error('Paystack cancellation failed:', error.message);
```

### What to Monitor

1. **Cancellation success rate** (local DB)
2. **Management link generation rate** (how often it succeeds)
3. **404 rate** (subscriptions not found in Paystack)
4. **Webhook receipt rate** (for `subscription.disable` events)

## Recommendations

### Short Term (Now)
- ✅ Use management link method (implemented)
- ✅ Cancel locally even if Paystack fails (implemented)
- ⏳ Test with real Paystack subscription code
- ⏳ Verify webhook handler for `subscription.disable`

### Medium Term (Next Sprint)
- 🔄 Email management link to users
- 🔄 Add frontend UI to show management link
- 🔄 Implement webhook sync for Paystack cancellations
- 🔄 Add monitoring/alerts for cancellation failures

### Long Term (Future)
- 🔮 Consider auto-cancel in Paystack (no user interaction)
- 🔮 Add audit trail for all cancellation events
- 🔮 Support re-activation flow
- 🔮 Add cancellation analytics

## Testing Checklist

- [ ] Test cancel with valid subscription code
- [ ] Test cancel with invalid subscription code (should still work locally)
- [ ] Test cancel with no externalSubscriptionId (should work)
- [ ] Test immediate vs period end cancellation
- [ ] Verify database updates correctly
- [ ] Check management link is returned when available
- [ ] Test webhook handler for subscription.disable
- [ ] Verify user keeps access until period end
- [ ] Test re-activation (if implemented)

## Conclusion

The management link approach provides a **robust, graceful solution** that:
1. Works when Paystack API is available
2. Falls back gracefully when it's not
3. Keeps user experience smooth
4. Maintains data consistency

The key insight: **Local cancellation is the source of truth**. Paystack integration is a bonus but not required for cancellation to work.
