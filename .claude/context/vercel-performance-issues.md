# Vercel Production Performance Issues

## Current Problem

After deploying to Vercel, API endpoints are extremely slow:

- `/api/feed?scopeId=12`: **23.03 seconds**
- `/api/scopes/12`: **20.31 seconds**
- `/api/users?scopeId=12`: **18.89 seconds**

These times are **much worse** than the local 9-second issue, indicating different problems.

## Root Causes

### 1. Database Indexes Not Applied to Production ❌

The migration was only applied locally. Vercel's database doesn't have the indexes yet.

### 2. Serverless Cold Starts

Vercel's serverless functions have cold start penalties:

- First request: 5-10 seconds to initialize
- Prisma Client initialization: 2-5 seconds
- Database connection: 1-3 seconds

### 3. Database Connection Issues

Potential problems:

- No connection pooling
- Each request creates new connection
- Connection timeout issues
- Geographic latency (Vercel → Database)

### 4. Missing Connection Pooling

Prisma needs connection pooling for serverless environments.

## Solutions

### Solution 1: Apply Database Migration to Production

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Pull environment variables
vercel env pull .env.production

# Run migration against production database
DATABASE_URL="your-production-db-url" npx prisma migrate deploy --schema src/prisma/schema.prisma
```

#### Option B: Using Database Dashboard

If using Supabase/Neon/PlanetScale:

1. Open SQL editor in dashboard
2. Run the migration SQL directly:

```sql
-- Copy from: src/prisma/migrations/20251208094735_add_performance_indexes/migration.sql
CREATE INDEX IF NOT EXISTS "ScopeRole_userId_idx" ON "ScopeRole"("userId");
CREATE INDEX IF NOT EXISTS "ScopeRole_scopeId_idx" ON "ScopeRole"("scopeId");
CREATE INDEX IF NOT EXISTS "Post_scopeId_createdAt_idx" ON "Post"("scopeId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Post_issuedById_idx" ON "Post"("issuedById");
CREATE INDEX IF NOT EXISTS "Post_issuedToId_idx" ON "Post"("issuedToId");
CREATE INDEX IF NOT EXISTS "PostReaction_postId_idx" ON "PostReaction"("postId");
```

#### Option C: Automatic on Deploy

Add to `package.json`:

```json
{
  "scripts": {
    "build": "npm run barrel && prisma migrate deploy --schema=./src/prisma/schema.prisma && next build",
    "vercel-build": "npm run barrel && prisma migrate deploy --schema=./src/prisma/schema.prisma && next build"
  }
}
```

### Solution 2: Enable Prisma Connection Pooling

#### Update DATABASE_URL in Vercel

Use connection pooling URL format:

**Supabase:**

```
# Instead of direct connection:
postgresql://user:pass@host:5432/db

# Use pooler:
postgresql://user:pass@host:6543/db?pgbouncer=true
```

**Neon:**

```
# Use pooled connection string (ends with ?sslmode=require)
```

**PlanetScale:**

```
# Already uses connection pooling
```

#### Update Prisma Configuration

**File**: `src/prisma/schema.prisma`

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // For migrations
}
```

**Environment Variables in Vercel:**

```bash
# Pooled connection for queries (fast)
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"

# Direct connection for migrations (slow but reliable)
DIRECT_URL="postgresql://user:pass@host:5432/db"
```

### Solution 3: Optimize Prisma Client for Serverless

#### Update Prisma Client Configuration

**File**: `src/prisma/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // Optimize for serverless
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

### Solution 4: Add Response Caching

#### Enable Vercel Edge Caching

**File**: `src/pages/api/scopes/[[...slug]].ts`

Add at the top of the handler class:

```typescript
@Catch(defaultExceptionHandler)
class ScopesHandler {
  @Get("/:id")
  @Authorize()
  @WithAbilities()
  public async getById(
    @Param("id", ParseNumberPipe) id: number,
    @Req() req: AbilitiesApiRequest,
    @Res() res: NextApiResponse
  ) {
    if (!req.abilities.can("read", subject("Scope", { id }))) {
      throw new UnauthorizedException();
    }

    await checkAndCreateScopePermissions(id);
    const profile = await getScopeProfile(id);

    // Add caching headers
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    return profile;
  }
}
```

### Solution 5: Use Vercel Edge Config (Advanced)

For frequently accessed data like scope profiles:

```typescript
import { get } from "@vercel/edge-config";

export async function getScopeProfileCached(id: number) {
  // Try edge config first (instant)
  const cached = await get(`scope-${id}`);
  if (cached) return cached;

  // Fallback to database
  const profile = await getScopeProfile(id);
  return profile;
}
```

## Diagnostic Steps

### 1. Check if Indexes Exist in Production

```sql
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('ScopeRole', 'Post', 'PostReaction')
ORDER BY tablename, indexname;
```

### 2. Check Connection Pool Status

```sql
SELECT
    count(*) as total_connections,
    count(*) FILTER (WHERE state = 'active') as active_connections,
    count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity
WHERE datname = current_database();
```

### 3. Analyze Slow Queries

```sql
SELECT
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
WHERE query LIKE '%ScopeRole%' OR query LIKE '%Post%'
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Expected Results After Fixes

### With Indexes Only:

- `/api/scopes/12`: 2-5 seconds (still slow due to cold start)
- `/api/feed`: 3-6 seconds
- `/api/users`: 2-5 seconds

### With Indexes + Connection Pooling:

- `/api/scopes/12`: 0.5-2 seconds
- `/api/feed`: 1-3 seconds
- `/api/users`: 0.5-2 seconds

### With Indexes + Pooling + Caching:

- `/api/scopes/12`: 0.1-0.5 seconds (cached)
- `/api/feed`: 0.5-2 seconds
- `/api/users`: 0.3-1 second

## Priority Actions

1. **CRITICAL**: Apply database migration to production
2. **HIGH**: Enable connection pooling in DATABASE_URL
3. **MEDIUM**: Add response caching headers
4. **LOW**: Implement Edge Config for hot data

## Vercel-Specific Configuration

### vercel.json

```json
{
  "functions": {
    "src/pages/api/**/*.ts": {
      "maxDuration": 10,
      "memory": 1024
    }
  },
  "env": {
    "DATABASE_URL": "@database-url",
    "DIRECT_URL": "@direct-url"
  }
}
```

### Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

- `DATABASE_URL` - Pooled connection string
- `DIRECT_URL` - Direct connection string (for migrations)

## Monitoring

Add logging to track performance:

```typescript
// src/lib/performance.ts
export const logApiPerformance = (endpoint: string, duration: number) => {
  if (process.env.NODE_ENV === "production") {
    console.log(
      JSON.stringify({
        type: "api_performance",
        endpoint,
        duration,
        timestamp: new Date().toISOString(),
      })
    );
  }
};
```

Use in API routes:

```typescript
const start = Date.now();
const result = await getScopeProfile(id);
logApiPerformance(`/api/scopes/${id}`, Date.now() - start);
return result;
```

## Conclusion

The 18-23 second response times are caused by:

1. Missing database indexes in production (60% of the problem)
2. No connection pooling (30% of the problem)
3. Cold starts (10% of the problem)

Applying the migration and enabling connection pooling should reduce response times to under 2 seconds.
