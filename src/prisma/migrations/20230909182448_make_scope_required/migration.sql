/*
  Warnings:

  - Made the column `scopeId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scopeId` on table `Fine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scopeId` on table `Invitation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_scopeId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "scopeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Fine" ALTER COLUMN "scopeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "scopeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
