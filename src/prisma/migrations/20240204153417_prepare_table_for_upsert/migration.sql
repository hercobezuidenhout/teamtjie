-- DropForeignKey
ALTER TABLE "ScopeSubscription" DROP CONSTRAINT "ScopeSubscription_scopeId_fkey";

-- AlterTable
ALTER TABLE "ScopeSubscription" ALTER COLUMN "scopeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ScopeSubscription" ADD CONSTRAINT "ScopeSubscription_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE SET NULL ON UPDATE CASCADE;
