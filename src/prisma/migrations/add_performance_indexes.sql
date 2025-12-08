-- Migration: Add Performance Indexes
-- Created: 2025-12-08
-- Description: Add database indexes to improve query performance
-- 
-- This migration adds indexes to speed up:
-- - Scope member counts (fixes 9+ second API response)
-- - Feed queries
-- - User post lookups
-- - Reaction lookups
--
-- These indexes can be added without downtime and will not affect existing data.

-- Add index on ScopeRole.userId for faster user scope lookups
CREATE INDEX IF NOT EXISTS "ScopeRole_userId_idx" ON "ScopeRole"("userId");

-- Add index on ScopeRole.scopeId for faster scope member lookups and counts
-- THIS IS THE CRITICAL INDEX THAT FIXES THE 9+ SECOND API RESPONSE
CREATE INDEX IF NOT EXISTS "ScopeRole_scopeId_idx" ON "ScopeRole"("scopeId");

-- Add composite index on Post for faster feed queries (scopeId + createdAt DESC)
CREATE INDEX IF NOT EXISTS "Post_scopeId_createdAt_idx" ON "Post"("scopeId", "createdAt" DESC);

-- Add index on Post.issuedById for faster user post lookups
CREATE INDEX IF NOT EXISTS "Post_issuedById_idx" ON "Post"("issuedById");

-- Add index on Post.issuedToId for faster recipient lookups
CREATE INDEX IF NOT EXISTS "Post_issuedToId_idx" ON "Post"("issuedToId");

-- Add index on PostReaction.postId for faster reaction lookups
CREATE INDEX IF NOT EXISTS "PostReaction_postId_idx" ON "PostReaction"("postId");

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname IN (
    'ScopeRole_userId_idx',
    'ScopeRole_scopeId_idx',
    'Post_scopeId_createdAt_idx',
    'Post_issuedById_idx',
    'Post_issuedToId_idx',
    'PostReaction_postId_idx'
)
ORDER BY tablename, indexname;