-- DropIndex
DROP INDEX "DailySentiment_userId_scopeId_date_key";

-- DropIndex
DROP INDEX "DailySentiment_userId_scopeId_idx";

-- CreateIndex
CREATE INDEX "DailySentiment_userId_scopeId_createdAt_idx" ON "DailySentiment"("userId", "scopeId", "createdAt" DESC);
