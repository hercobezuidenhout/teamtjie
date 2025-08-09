/*
  Warnings:

  - Added the required column `scopeId` to the `Win` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Win" ADD COLUMN     "scopeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Win" ADD CONSTRAINT "Win_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
