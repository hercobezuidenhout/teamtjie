# Next.js Upgrade Plan: 14.2.5 → 15.x (Latest)

## Current State Analysis

### Current Version
- **Next.js**: 14.2.5
- **React**: 18.2.0
- **TypeScript**: 5.3.3

### Architecture
- ✅ **App Router**: Already using Next.js 13+ App Router
- ✅ **Server Components**: Using async server components
- ✅ **Route Groups**: Extensive use of route groups `(auth)`, `(spaces)`, etc.
- ✅ **Parallel Routes**: Using `@menu` parallel route
- ✅ **Middleware**: Using Next.js middleware for auth
- ⚠️ **Pages Router**: Still using for API routes (`/pages/api`)
- ⚠️ **Legacy Patterns**: Some outdated patterns in contexts

## Breaking Changes in Next.js 15

### 1. React 19 Requirement
Next.js 15 requires React 19 (currently on React 18.2.0)

### 2. Async Request APIs (Breaking)
```typescript
// OLD (Next.js 14)
import { cookies, headers } from 'next/headers';
const cookieStore = cookies();
const headersList = headers();

// NEW (Next.js 15)
import { cookies, headers } from 'next/headers';
const cookieStore = await cookies();
const headersList = await headers();
```

**Impact**: Affects ~15-20 files in the project

### 3. Route Handler Changes
- `GET` and `HEAD` methods are no longer cached by default
- Must explicitly opt-in to caching

### 4. `fetch` Caching Changes
- `fetch` requests are no longer cached by default
- Must use `cache: 'force-cache'` explicitly

### 5. Middleware Changes
- `NextRequest.geo` and `NextRequest.ip` removed (use Vercel functions)
- More strict about what can be done in middleware

### 6. TypeScript Changes
- Stricter type checking for Server Components
- Better inference for async components

## Upgrade Strategy

### Phase 1: Preparation (Low Risk)
**Estimated Time**: 2-3 hours

#### 1.1 Update Dependencies (Non-Breaking)

```json
{
  "dependencies": {
    "@chakra-ui/icons": "^2.2.4",
    "@chakra-ui/react": "^2.10.4",
    "@chakra-ui/system": "^2.6.2",
    "@emotion/react": "^11.13.5",
    "@emotion/styled": "^11.13.5",
    "@mdx-js/loader": "^3.1.0",
    "@mdx-js/react": "^3.1.0",
    "@next/mdx": "^15.1.3",
    "@prisma/client": "^6.1.0",
    "@sendgrid/client": "^8.1.4",
    "@sendgrid/mail": "^8.1.4",
    "@supabase/auth-helpers-react": "^0.5.0",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.46.2",
    "@tanstack/react-query": "^5.62.11",
    "class-validator": "^0.14.1",
    "date-fns": "^4.1.0",
    "downshift": "^9.0.8",
    "emoji-picker-react": "^4.12.0",
    "formidable": "^3.5.2",
    "framer-motion": "^11.15.0",
    "immer": "^10.1.1",
    "mixpanel-browser": "^2.56.0",
    "next": "^15.1.3",
    "next-api-decorators": "^2.0.2",
    "path-to-regexp": "^8.2.0",
    "ramda": "^0.30.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "react-icons": "^5.4.0",
    "react-image-crop": "^11.0.7",
    "react-use": "^17.5.1",
    "recharts": "^2.15.0",
    "resend": "^4.0.1",
    "typescript": "^5.7.2",
    "use-debounce": "^10.0.4",
    "uuid": "^11.0.3",
    "class-transformer": "^0.5.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@types/formidable": "^3.4.5",
    "@types/node": "^22.10.2",
    "@types/ramda": "^0.30.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@types/testing-library__jest-dom": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^8.18.1",
    "@typescript-eslint/parser": "^8.18.1",
    "barrelsby": "^2.8.1",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.3",
    "jest": "^29.7.0",
    "prettier": "^3.4.2",
    "prisma": "^6.1.0"
  }
}
```

#### 1.2 Update TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "noImplicitAny": false,
    "incremental": true,
    "baseUrl": ".",
    "strictNullChecks": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/atoms": ["./src/components/atoms"],
      "@/buttons": ["./src/components/buttons"],
      "@/inputs": ["./src/components/inputs"],
      "@/modals": ["./src/components/modals"],
      "@/molecules": ["./src/components/molecules"],
      "@/organisms": ["./src/components/organisms"],
      "@/tags": ["./src/components/tags"],
      "@/templates": ["./src/components/templates"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "**/node_modules/*"]
}
```

#### 1.3 Update Next.js Configuration

```javascript
const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { tsconfigPath: './tsconfig.build.json' },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  // Next.js 15 specific optimizations
  experimental: {
    // Enable PPR (Partial Prerendering) for better performance
    ppr: 'incremental',
    
    // Optimize package imports
    optimizePackageImports: ['@chakra-ui/react', 'react-icons'],
  },
};

module.exports = withMDX(nextConfig);
```

---

### Phase 2: Code Migration (Medium Risk)
**Estimated Time**: 4-6 hours

#### 2.1 Update Async Request APIs

**Files to Update** (~15-20 files):

1. **src/middleware.tsx**
```typescript
// BEFORE
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        // ...
      },
    }
  );
  // ...
}

// AFTER (Next.js 15)
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        // ...
      },
    }
  );
  // ...
}
// No changes needed for middleware - cookies are still sync
```

2. **src/app/utils.ts**
```typescript
// BEFORE
import { cookies } from 'next/headers';

export const getSession = async () => {
  const cookieStore = cookies();
  // ...
};

// AFTER (Next.js 15)
import { cookies } from 'next/headers';

export const getSession = async () => {
  const cookieStore = await cookies();
  // ...
};
```

3. **All Server Components using cookies/headers**

Search and replace pattern:
```bash
# Find all files using cookies() or headers()
grep -r "cookies()" src/app --include="*.tsx" --include="*.ts"
grep -r "headers()" src/app --include="*.tsx" --include="*.ts"
```

Files likely affected:
- `src/app/(spaces)/spaces/[spaceId]/layout.tsx` (if using cookies)
- `src/app/(settings)/settings/[scopeId]/utils/securely-get-scope-from-page-props.ts`
- Any other server components using cookies/headers

#### 2.2 Update API Route Handlers

**Files**: All files in `src/pages/api/`

```typescript
// BEFORE (Next.js 14)
@Get()
public async get(@Req() req: UserApiRequest) {
  // Cached by default
  return data;
}

// AFTER (Next.js 15)
@Get()
public async get(@Req() req: UserApiRequest) {
  // Must explicitly cache if needed
  return data;
}

// Add to route handler if caching is desired:
export const dynamic = 'force-static';
export const revalidate = 3600; // Cache for 1 hour
```

#### 2.3 Update Fetch Calls

**Files**: All files using `fetch()`

```typescript
// BEFORE (Next.js 14)
const data = await fetch('https://api.example.com/data');
// Cached by default

// AFTER (Next.js 15)
const data = await fetch('https://api.example.com/data', {
  cache: 'force-cache', // Explicitly cache
  next: { revalidate: 3600 } // Revalidate every hour
});

// OR for no cache:
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});
```

#### 2.4 Remove Deprecated Chakra Pattern

**File**: `src/contexts/Chakra.tsx`

```typescript
// DELETE THIS FILE - No longer needed in Next.js 15
// Chakra UI works directly with App Router now
```

**Update**: `src/app/providers.tsx`

```typescript
'use client';

import { AbilityContextProvider } from '@/contexts/AbilityContextProvider';
import { AnalyticsProvider } from '@/contexts/AnalyticsProvider';
import { DialogProvider } from '@/contexts/DialogProvider';
import { theme } from '@/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserClient } from '@supabase/ssr';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

const getBrowserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

interface AppProvidersProps extends PropsWithChildren {
  initialSession?: Session | null;
}

export const AppProviders = ({
  children,
  initialSession,
}: AppProvidersProps) => {
  const [supabaseClient] = useState(getBrowserClient);
  const [queryClient] = useState(getQueryClient);

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={initialSession}
        >
          <AnalyticsProvider>
            <AbilityContextProvider>
              <DialogProvider>
                {children}
              </DialogProvider>
            </AbilityContextProvider>
          </AnalyticsProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};
```

---

### Phase 3: Testing & Validation (Critical)
**Estimated Time**: 3-4 hours

#### 3.1 Create Test Checklist

```markdown
## Authentication Flow
- [ ] Login with Google
- [ ] Login with Microsoft
- [ ] OTP Login
- [ ] Logout
- [ ] Session persistence
- [ ] Protected routes redirect

## Core Functionality
- [ ] Create space
- [ ] Create team
- [ ] Post win
- [ ] React to post
- [ ] View feed
- [ ] Filter feed by team
- [ ] Invite members
- [ ] Accept invitation
- [ ] Update profile
- [ ] Upload avatar

## Settings
- [ ] Update space settings
- [ ] Update team settings
- [ ] Manage members
- [ ] Manage permissions
- [ ] Leave team
- [ ] Delete team

## Performance
- [ ] Initial page load < 2s
- [ ] Navigation between pages
- [ ] Feed scrolling
- [ ] Image loading
- [ ] API response times

## Edge Cases
- [ ] No spaces (redirect to create)
- [ ] No teams in space
- [ ] Empty feed
- [ ] Network errors
- [ ] Invalid invitations
```

#### 3.2 Run Automated Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Unit tests
npm run test

# E2E tests
npm run e2e

# Build test
npm run build
```

---

### Phase 4: Optimization (Optional)
**Estimated Time**: 2-3 hours

#### 4.1 Enable Partial Prerendering (PPR)

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
};
```

Add to static pages:
```typescript
// src/app/(marketing)/page.tsx
export const experimental_ppr = true;
```

#### 4.2 Optimize Bundle Size

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@chakra-ui/react',
      '@chakra-ui/icons',
      'react-icons',
      'date-fns',
      'ramda',
    ],
  },
};
```

#### 4.3 Add Server Actions (Optional)

Convert some mutations to Server Actions for better performance:

```typescript
// src/app/actions/create-post.ts
'use server';

import { createPost } from '@/prisma/commands/create-post';
import { revalidatePath } from 'next/cache';

export async function createPostAction(formData: FormData) {
  const post = await createPost({
    description: formData.get('description') as string,
    // ...
  });
  
  revalidatePath('/spaces/[spaceId]');
  return post;
}
```

---

## Migration Checklist

### Pre-Migration
- [ ] Create feature branch: `feat/nextjs-15-upgrade`
- [ ] Backup database
- [ ] Document current performance metrics
- [ ] Review all breaking changes
- [ ] Update local development environment

### Phase 1: Preparation
- [ ] Update package.json dependencies
- [ ] Update tsconfig.json
- [ ] Update next.config.js
- [ ] Run `npm install`
- [ ] Fix any immediate type errors
- [ ] Test dev server starts

### Phase 2: Code Migration
- [ ] Update all `cookies()` calls to `await cookies()`
- [ ] Update all `headers()` calls to `await headers()`
- [ ] Update fetch calls with explicit caching
- [ ] Update API route handlers
- [ ] Remove deprecated Chakra context
- [ ] Update middleware (if needed)
- [ ] Fix TypeScript errors

### Phase 3: Testing
- [ ] Run type checking
- [ ] Run linting
- [ ] Run unit tests
- [ ] Run E2E tests
- [ ] Manual testing of critical flows
- [ ] Performance testing
- [ ] Cross-browser testing

### Phase 4: Deployment
- [ ] Test build locally
- [ ] Deploy to staging
- [ ] Smoke test staging
- [ ] Monitor staging for 24h
- [ ] Deploy to production
- [ ] Monitor production metrics

---

## Risk Assessment

### Low Risk
- ✅ Already using App Router
- ✅ Already using Server Components
- ✅ No Pages Router pages (only API routes)
- ✅ Modern React patterns

### Medium Risk
- ⚠️ React 18 → 19 upgrade (some libraries may not be compatible)
- ⚠️ Chakra UI compatibility with React 19
- ⚠️ Supabase auth helpers compatibility
- ⚠️ next-api-decorators compatibility

### High Risk
- 🔴 Multiple async request API changes
- 🔴 Caching behavior changes
- 🔴 Potential performance regressions if not handled correctly

---

## Rollback Plan

If critical issues are discovered:

1. **Immediate Rollback**
   ```bash
   git revert <commit-hash>
   npm install
   npm run build
   # Deploy previous version
   ```

2. **Partial Rollback**
   - Keep dependency updates
   - Revert code changes
   - Fix issues incrementally

3. **Database Rollback**
   - No schema changes expected
   - Data should be unaffected

---

## Timeline Estimate

### Conservative Approach (Recommended)
- **Week 1**: Preparation + Code Migration (8-10 hours)
- **Week 2**: Testing + Bug Fixes (8-10 hours)
- **Week 3**: Staging Deployment + Monitoring (4-6 hours)
- **Week 4**: Production Deployment + Monitoring (2-4 hours)

**Total**: 22-30 hours over 4 weeks

### Aggressive Approach
- **Day 1-2**: Preparation + Code Migration (8-10 hours)
- **Day 3-4**: Testing + Bug Fixes (8-10 hours)
- **Day 5**: Deployment (4-6 hours)

**Total**: 20-26 hours over 1 week

---

## Post-Migration Optimizations

After successful migration, consider:

1. **Enable Turbopack** (Next.js 15 stable)
   ```bash
   npm run dev --turbo
   ```

2. **Implement Server Actions** for forms
3. **Enable PPR** for static pages
4. **Optimize images** with Next.js Image
5. **Add React Compiler** (when stable)
6. **Implement Streaming** for slow pages

---

## Known Issues & Workarounds

### Issue 1: Chakra UI + React 19
**Status**: Chakra UI v2 has some compatibility issues with React 19

**Workaround**:
```json
{
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

Or consider upgrading to Chakra UI v3 (beta):
```bash
npm install @chakra-ui/react@next
```

### Issue 2: next-api-decorators
**Status**: May need updates for Next.js 15

**Workaround**: Monitor GitHub issues, consider migrating to Route Handlers

### Issue 3: Supabase Auth Helpers
**Status**: Should be compatible, but test thoroughly

**Workaround**: Use latest `@supabase/ssr` package

---

## Resources

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Chakra UI v3 Migration](https://www.chakra-ui.com/docs/get-started/migration)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## Conclusion

The upgrade from Next.js 14.2.5 to 15.x is **moderately complex** due to:
1. React 19 requirement
2. Async request API changes
3. Caching behavior changes

However, the project is well-positioned for the upgrade because:
- ✅ Already using App Router
- ✅ Modern architecture
- ✅ Good separation of concerns

**Recommendation**: Take the conservative 4-week approach to minimize risk and ensure thorough testing.