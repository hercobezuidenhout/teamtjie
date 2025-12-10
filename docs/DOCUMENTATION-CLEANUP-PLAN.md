# Documentation Cleanup Plan

**Created**: 2025-12-09
**Purpose**: Consolidate and update billing documentation to reflect actual implementation

---

## Current Documentation Issues

### Problem 1: Payment Provider Mismatch
- All docs reference **PayFast**
- Actual implementation uses **Paystack**
- Field names in DB use "payfast" prefix
- Migration named `add_payfast_tables`

### Problem 2: Too Many Similar Documents
We have **10 billing documentation files** with overlapping content:
- `billing-implementation-plan-part2.md`
- `billing-implementation-plan-updated.md`
- `billing-implementation-plan.md`
- `BILLING-IMPLEMENTATION.md`
- `BILLING-IMPLEMENTATION-PHASES.md`
- `PHASE-1-IMPLEMENTATION-PLAN.md`
- `PHASE-1-ARCHITECTURE.md`
- `PHASE-1-QUICK-START.md`
- `PHASE-1-SUMMARY.md`
- `BILLING-IMPLEMENTATION-SUMMARY.md`

### Problem 3: Outdated Content
- Documents describe features not implemented
- Implementation plan assumes PayFast
- Architecture diagrams show PayFast integration
- Phase documents completed but docs not updated

---

## Recommended Documentation Structure

### Keep & Update (3 files)

#### 1. **BILLING-CURRENT-STATUS.md** ✅ (NEW - Just Created)
- **Purpose**: Current state of implementation
- **Audience**: Developers continuing the work
- **Content**: What's done, what's not, issues, next steps
- **Action**: Already created - keep updated

#### 2. **BILLING-IMPLEMENTATION-GUIDE.md** (Consolidate & Update)
- **Purpose**: Complete implementation guide
- **Audience**: Developers implementing billing
- **Content**:
  - Overview of billing system
  - Paystack integration (updated from PayFast)
  - Database schema
  - API endpoints (what exists and what's needed)
  - Frontend components
  - Testing guide
- **Action**: Create by merging best parts of existing docs

#### 3. **BILLING-ROADMAP.md** (Simplify)
- **Purpose**: Future enhancements and phases
- **Audience**: Product/dev planning
- **Content**:
  - Remaining work to complete MVP
  - Future enhancements (Phase 2 features)
  - Nice-to-haves
- **Action**: Extract from BILLING-IMPLEMENTATION-PHASES.md

### Archive (7 files)

Move to `docs/archive/billing/` for reference:
- `billing-implementation-plan-part2.md`
- `billing-implementation-plan-updated.md`
- `billing-implementation-plan.md`
- `BILLING-IMPLEMENTATION.md`
- `PHASE-1-IMPLEMENTATION-PLAN.md`
- `PHASE-1-ARCHITECTURE.md`
- `PHASE-1-QUICK-START.md`
- `PHASE-1-SUMMARY.md`

**Reasoning**: Historical value but outdated. Keep for reference.

### Delete (2 files)

Too generic or fully superseded:
- `BILLING-IMPLEMENTATION-SUMMARY.md` (superseded by BILLING-CURRENT-STATUS.md)
- `BILLING-IMPLEMENTATION-PHASES.md` (superseded by BILLING-ROADMAP.md)

---

## New Documentation Structure

```
docs/
├── BILLING-CURRENT-STATUS.md          ← Current state (NEW)
├── BILLING-IMPLEMENTATION-GUIDE.md    ← How to implement (NEW)
├── BILLING-ROADMAP.md                 ← Future work (NEW)
│
└── archive/
    └── billing/
        ├── billing-implementation-plan-part2.md
        ├── billing-implementation-plan-updated.md
        ├── billing-implementation-plan.md
        ├── BILLING-IMPLEMENTATION.md
        ├── PHASE-1-IMPLEMENTATION-PLAN.md
        ├── PHASE-1-ARCHITECTURE.md
        ├── PHASE-1-QUICK-START.md
        └── PHASE-1-SUMMARY.md
```

---

## Action Items

### Phase 1: Immediate Cleanup ✅
- [x] Create `BILLING-CURRENT-STATUS.md` with actual state
- [ ] Create `docs/archive/billing/` directory
- [ ] Move 8 old docs to archive
- [ ] Delete 2 superseded docs

### Phase 2: Create New Docs
- [ ] Create `BILLING-IMPLEMENTATION-GUIDE.md` (consolidated)
- [ ] Create `BILLING-ROADMAP.md` (future work)
- [ ] Update `README.md` to reference new structure

### Phase 3: Update Code Comments
- [ ] Update inline docs referencing PayFast
- [ ] Add JSDoc comments to billing functions
- [ ] Update API endpoint descriptions

---

## BILLING-IMPLEMENTATION-GUIDE.md Outline

### Proposed Content

```markdown
# Billing Implementation Guide

## Overview
- What: R99/month subscription per team
- Why: Unlock Daily Sentiments and Health Checks
- Provider: Paystack (South African payment gateway)

## Architecture
- Database: Subscription + SubscriptionTransaction tables
- Frontend: Paystack Inline JS modal
- Backend: Webhook processing (TODO)
- APIs: REST endpoints for subscription management

## Database Schema
[Current schema with field explanations]
- Note: Field names use "payfast" prefix for historical reasons

## Payment Flow
1. User clicks upgrade
2. Paystack modal opens
3. Payment processes
4. Webhook received (TODO: implement)
5. Subscription activated
6. Premium features unlocked

## Implementation Status
- [x] Phase 1: Database & queries
- [x] Phase 2: Feature gates
- [x] Phase 3: UI
- [ ] Phase 4: Webhook & activation (CRITICAL)
- [ ] Phase 5: Subscription management
- [ ] Phase 6: User dashboard
- [ ] Phase 7: Email notifications

## Setting Up Development

### Environment Variables
[List with examples]

### Paystack Test Mode
[How to test payments]

### Database Setup
[Migration commands]

## API Endpoints

### Implemented
- Protected endpoints (sentiments, health-checks)

### Not Implemented
- POST /api/v1/billing/webhook
- GET/POST /api/v1/billing/subscriptions
- [etc...]

## Frontend Components
- PremiumFeatureGate
- UpgradeCard
- [What each does and where to use]

## Testing
- Unit tests (TODO)
- Integration tests (TODO)
- Manual testing checklist

## Common Issues
- Payments work but don't activate subscriptions
- [Solutions]

## Security Considerations
- Webhook signature verification
- Payment data handling
- Environment variables

## Next Steps
[Link to BILLING-CURRENT-STATUS.md]
```

---

## BILLING-ROADMAP.md Outline

### Proposed Content

```markdown
# Billing Roadmap

## Current Status
[Brief summary, link to BILLING-CURRENT-STATUS.md]

## MVP Completion (Required for Production)

### Critical: Payment Processing
- [ ] Implement webhook handler
- [ ] Create subscription activation logic
- [ ] Test end-to-end payment flow
- [ ] Verify premium feature access

### High Priority: Management
- [ ] Subscription cancellation
- [ ] View subscription status
- [ ] Manage billing page

### Medium Priority: UX
- [ ] User billing dashboard
- [ ] Payment history
- [ ] Email notifications

## Phase 2: Enhancements (Post-MVP)

### Pricing Options
- Annual billing (R990/year save 17%)
- Team bundles (3+ teams discount)
- Enterprise pricing

### Features
- Promo codes
- Free trials (7 or 14 days)
- Referral program
- Usage-based billing

### Technical
- Multiple payment methods
- Invoice generation
- Better analytics
- Dunning management (retry failed payments)
- Subscription pausing

### Regional
- Multi-currency support
- Additional payment providers
- Regional pricing

## Phase 3: Advanced Features

### Self-Service
- Customer portal
- Upgrade/downgrade plans
- Add-on features
- Seat-based pricing

### Analytics
- Revenue dashboard
- Churn analysis
- MRR/ARR tracking
- Conversion funnel

### Compliance
- Tax handling (VAT)
- GDPR compliance
- PCI compliance audit
- Invoice requirements

## Timeline Estimate
- MVP Completion: 2-3 weeks
- Phase 2: 4-6 weeks
- Phase 3: 8-12 weeks

## Dependencies
- Paystack account approved
- Stripe added for international (Phase 2)
- Accounting system integration (Phase 3)
```

---

## Migration Instructions

### Step 1: Create Archive Directory
```bash
mkdir -p docs/archive/billing
```

### Step 2: Move Old Docs
```bash
# Move to archive
mv docs/billing-implementation-plan-part2.md docs/archive/billing/
mv docs/billing-implementation-plan-updated.md docs/archive/billing/
mv docs/billing-implementation-plan.md docs/archive/billing/
mv docs/BILLING-IMPLEMENTATION.md docs/archive/billing/
mv docs/PHASE-1-IMPLEMENTATION-PLAN.md docs/archive/billing/
mv docs/PHASE-1-ARCHITECTURE.md docs/archive/billing/
mv docs/PHASE-1-QUICK-START.md docs/archive/billing/
mv docs/PHASE-1-SUMMARY.md docs/archive/billing/
```

### Step 3: Delete Superseded Docs
```bash
rm docs/BILLING-IMPLEMENTATION-SUMMARY.md
rm docs/BILLING-IMPLEMENTATION-PHASES.md
```

### Step 4: Create New Docs
```bash
# Create new consolidated docs
touch docs/BILLING-IMPLEMENTATION-GUIDE.md
touch docs/BILLING-ROADMAP.md
```

### Step 5: Update README
Add section:
```markdown
## Billing Documentation

- **[Current Status](docs/BILLING-CURRENT-STATUS.md)** - What's implemented, what's not, next steps
- **[Implementation Guide](docs/BILLING-IMPLEMENTATION-GUIDE.md)** - How to implement billing features
- **[Roadmap](docs/BILLING-ROADMAP.md)** - Future enhancements and phases

Historical documentation available in `docs/archive/billing/`.
```

---

## Benefits of This Cleanup

### For Developers
- ✅ Single source of truth for current state
- ✅ Clear implementation guide
- ✅ No confusion between PayFast and Paystack
- ✅ Up-to-date information
- ✅ Clear next steps

### For Project Management
- ✅ Easy to see what's done and what's left
- ✅ Clear roadmap for future
- ✅ Better effort estimates

### For New Team Members
- ✅ Quick onboarding
- ✅ Less time reading outdated docs
- ✅ Clear architecture understanding

---

## Review Checklist

Before finalizing cleanup:
- [ ] Verify all important info from old docs captured
- [ ] Check code references to documentation
- [ ] Update any inline `// See docs/...` comments
- [ ] Test that archive docs are accessible
- [ ] Update project README
- [ ] Notify team of doc restructure

---

## Timeline

**Phase 1** (Today):
- ✅ Create BILLING-CURRENT-STATUS.md
- Move old docs to archive (5 min)
- Delete superseded docs (1 min)

**Phase 2** (Next 1-2 days):
- Create BILLING-IMPLEMENTATION-GUIDE.md (2-3 hours)
- Create BILLING-ROADMAP.md (1 hour)
- Update README (15 min)

**Phase 3** (Ongoing):
- Keep BILLING-CURRENT-STATUS.md updated
- Update guides as implementation progresses
- Archive this cleanup plan when done

---

## Questions?

Contact: [Your team lead / maintainer]
Reference: This cleanup plan
