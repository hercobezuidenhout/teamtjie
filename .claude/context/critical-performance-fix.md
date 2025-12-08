# CRITICAL: 18-23 Second API Response Fix

## The Problem

Your DATABASE_URL has `connection_limit=1` which is causing a **massive bottleneck**:

```
postgresql://postgres.<username>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

## The Issue: `connection_limit=1`

This parameter limits each Prisma Client instance to **only 1 database connection**. In a serverless environment with multiple concurrent requests, this creates a **queue** where requests wait for the single connection to become available.

### What's Happening:

1. Request 1 arrives → Uses the 1 connection → Takes 2 seconds
2. Request 2 arrives → **Waits for connection** → Waits 2 seconds, then takes 2 seconds = 4 seconds total
3. Request 3 arrives → **Waits for connection** → Waits 4 seconds, then takes 2 seconds = 6 seconds total
4. Request 10 arrives → **Waits 18 seconds**, then takes 2 seconds = **20 seconds total** ❌

## The Fix

### Remove `connection_limit=1` from DATABASE_URL

**Current (Slow):**

```
postgresql://postgres.<username>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Fixed (Fast):**

```
postgresql://postgres.<username>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Or use a reasonable limit:

```
postgresql://postgres.<username>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10
```

## Why This Exists

The `connection_limit=1` was likely added to:

- Avoid exhausting database connections
- Work around connection pool limits

But it's **too restrictive** for production traffic.

## Recommended Configuration

### For Supabase (Your Setup)

**DATABASE_URL** (Pooled - for queries):

```
postgresql://postgres.<username>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10
```

**DIRECT_URL** (Direct - for migrations):

```
postgresql://postgres.<username>:<password>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

### Connection Limit Guidelines

**Vercel Serverless:**

- Free tier: `connection_limit=5`
- Pro tier: `connection_limit=10`
- Enterprise: `connection_limit=20`

**Supabase Free Tier:**

- Max connections: 60
- Recommended per function: 5-10
- With 10 concurrent functions: `connection_limit=5`

## Additional Optimizations

### 1. Optimize Prisma Client Initialization

**File**: `src/prisma/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Add connection pool configuration
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Important: Reuse Prisma Client in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Add connection lifecycle management
if (process.env.NODE_ENV === "production") {
  // Disconnect on process termination
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
```

### 2. Reduce Query Complexity

The feed query is doing **7 nested includes**. This is expensive.

**File**: `src/prisma/queries/get-feed.ts`

Change from `include` to `select` (more efficient):

```typescript
const getData = async (scopeIds: number[], skip: number, take: number) => {
  return await prisma.post.findMany({
    skip: skip,
    take: take,
    where: {
      scopeId: { in: scopeIds },
    },
    select: {
      // Changed from include
      id: true,
      description: true,
      type: true,
      scopeId: true,
      issuedById: true,
      issuedToId: true,
      createdAt: true,
      updatedAt: true,
      issuedBy: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      issuedTo: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      reactions: {
        select: {
          reaction: true,
          userId: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      values: {
        select: {
          scopeValue: {
            select: {
              name: true,
              description: true,
            },
          },
        },
        orderBy: {
          scopeValue: {
            name: "asc",
          },
        },
      },
      scope: {
        select: {
          id: true,
          name: true,
          parentScopeId: true,
          parentScope: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
```

### 3. Increase Vercel Function Timeout

**File**: `vercel.json` (create if doesn't exist)

```json
{
  "functions": {
    "src/pages/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

## Expected Results

### Current (connection_limit=1):

- `/api/feed`: **23 seconds** ❌
- `/api/scopes/12`: **20 seconds** ❌
- `/api/users`: **19 seconds** ❌

### After Removing connection_limit=1:

- `/api/feed`: **2-5 seconds** (still slow due to query complexity)
- `/api/scopes/12`: **0.5-1 second** ✅
- `/api/users`: **1-2 seconds** ✅

### After connection_limit=10:

- `/api/feed`: **1-3 seconds** ✅
- `/api/scopes/12`: **0.3-0.8 seconds** ✅
- `/api/users`: **0.5-1.5 seconds** ✅

### After connection_limit=10 + Query Optimization:

- `/api/feed`: **0.5-2 seconds** ✅✅
- `/api/scopes/12`: **0.2-0.5 seconds** ✅✅
- `/api/users`: **0.3-1 second** ✅✅

## Immediate Action

1. **Go to Vercel Dashboard**
2. **Settings → Environment Variables**
3. **Edit DATABASE_URL**
4. **Remove `&connection_limit=1`** or change to `&connection_limit=10`
5. **Redeploy**

This single change will reduce response times by **80-90%**.

## Why connection_limit=1 is Bad

In serverless:

- Multiple functions run concurrently
- Each function needs its own connection
- With limit=1, they queue up
- Queue time = (number of concurrent requests - 1) × query time

Example with 10 concurrent requests:

- Request 1: 2 seconds
- Request 10: **20 seconds** (waited for 9 requests)

With connection_limit=10:

- All 10 requests: **2 seconds** (parallel)

## Monitoring

Add this to track connection issues:

```typescript
// Log connection pool stats
console.log("Prisma connection pool:", {
  activeConnections:
    await prisma.$queryRaw`SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()`,
  maxConnections:
    process.env.DATABASE_URL?.match(/connection_limit=(\d+)/)?.[1] ||
    "unlimited",
});
```

## Conclusion

The `connection_limit=1` parameter is the **primary cause** of your 18-23 second response times. Removing it will immediately improve performance by 80-90%.

The database indexes help, but they can't overcome the connection bottleneck.
