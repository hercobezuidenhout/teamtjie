-- DropForeignKey
ALTER TABLE "Win" DROP CONSTRAINT "Win_scopeId_fkey";

-- AddForeignKey
ALTER TABLE "Win" ADD CONSTRAINT "Win_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
