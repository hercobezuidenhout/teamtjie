# Pre-Production Deployment Checklist - Billing & Webhooks

## ⚠️ Critical: Customer Money at Risk

### 🔴 Test Before Deploy (Use PayStack Test Mode)
1. **Test cancellation flow end-to-end**
   - Cancel on PayStack management page
   - Verify subscription stays ACTIVE with `cancelAtPeriodEnd = true`
   - Confirm user can still access premium features
   - Simulate failed charge webhook at period end
   - Verify status changes to CANCELLED

2. **Test re-subscription flow**
   - Cancel subscription
   - Re-subscribe before period end
   - Verify successful charge resets `cancelAtPeriodEnd = false`

3. **Test webhook signature verification**
   - Send test webhook with invalid signature → should reject (401)
   - Send test webhook with valid signature → should accept (200)

---

## 🚨 Potential Pitfalls

### 1. **Webhook Signature Bypass**
- **Risk**: If signature verification fails, attacker could fake webhooks
- **Check**: Verify `BILLING_CONFIG.paystack.secretKey` is set correctly
- **Location**: `src/utils/paystack.ts:86-99`

### 2. **Race Conditions**
- **Risk**: User cancels + re-subscribes quickly → conflicting webhook events
- **Impact**: Subscription might stay cancelled even after successful payment
- **Mitigation**: Webhooks check current state before updating

### 3. **Subscription Not Found**
- **Risk**: Webhook arrives before subscription synced to DB
- **Impact**: Cancellation not recorded, user charged but shows active
- **Check**: Ensure `externalSubscriptionId` is always set during initial payment
- **Location**: `webhook/route.ts:117-123`

### 4. **Amount Validation**
- **Currently**: Hardcoded to 9900 kobo (R99)
- **Risk**: If price changes, webhooks fail silently
- **Location**: `webhook/route.ts:104-110`
- **Fix Later**: Make price configurable

### 5. **Timezone Issues**
- **Risk**: `currentPeriodEnd` comparison uses server time
- **Impact**: Subscription might cancel 1 day early/late depending on timezone
- **Location**: `webhook/route.ts:224`

---

## 🟡 Future Improvements

### 1. **Idempotency**
- Webhooks can be sent multiple times by PayStack
- Currently no duplicate detection
- Could charge user twice or flip subscription state

### 2. **Webhook Retry Handling**
- We return 200 on all errors (prevents PayStack retry)
- Silent failures = lost events
- **Add**: Alerting when webhook processing fails

### 3. **Failed Payment Notifications**
- User doesn't know their card failed
- **Add**: Email notification on `charge.failed`
- **Location**: `webhook/route.ts:289`

### 4. **Subscription Expiry Grace Period**
- Currently: Cancelled immediately when charge fails
- Better: 3-day grace period for payment retry
- **Add**: EXPIRED status separate from CANCELLED

### 5. **Audit Trail**
- All transaction records logged
- But no webhook event log
- **Add**: Store raw webhook payloads for debugging

---

## ✅ Pre-Deploy Verification

### Environment Variables
```bash
# Verify these are set in production
PAYSTACK_SECRET_KEY=sk_live_...  # NOT sk_test_!
DATABASE_URL=postgresql://...
```

### Database
```bash
# Verify PAYMENT_FAILED exists in enum
psql $DATABASE_URL -c "SELECT unnest(enum_range(NULL::\"TransactionType\"));"
# Should show: PAYMENT_COMPLETE, PAYMENT_FAILED, SUBSCRIPTION_CANCELLED
```

### PayStack Dashboard
1. **Set webhook URL**: `https://yourdomain.com/api/v1/billing/paystack/webhook`
2. **Enable events**: `charge.success`, `charge.failed`, `subscription.create`, `subscription.disable`
3. **Test webhook delivery** using PayStack dashboard

### Monitoring
- [ ] Set up alerts for webhook failures
- [ ] Monitor `charge.failed` events (card declines)
- [ ] Track `cancelAtPeriodEnd = true` subscriptions (churn risk)

---

## 🔍 What to Watch After Deploy

### First 24 Hours
- Monitor webhook logs for signature failures
- Check all cancellations create transaction records
- Verify no duplicate subscription creation

### First Week
- Watch for subscriptions stuck in limbo (ACTIVE but should be CANCELLED)
- Check users aren't charged after cancellation
- Monitor failed charge handling

### Red Flags
- Subscription CANCELLED but user still has access
- Subscription ACTIVE but period expired
- Missing `externalSubscriptionId` on active subscriptions
- Transaction records with wrong amounts

---

## 💰 Financial Safety Net

**If something goes wrong:**
1. Check PayStack dashboard for actual payment status (source of truth)
2. Compare DB state vs PayStack state
3. Manual refund via PayStack dashboard if user overcharged
4. Never delete transaction records (audit trail)

**Rollback Plan:**
- Disable webhook endpoint (returns 503)
- Fix issue
- Replay missed webhooks manually from PayStack logs
