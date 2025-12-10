/*
  Warnings:

  - You are about to drop the column `scopeId` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('TEAMTJIE_PLUS', 'ENTERPRISE');

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_scopeId_fkey";

-- DropIndex
DROP INDEX "Subscription_scopeId_key";

-- DropIndex
DROP INDEX "Subscription_scopeId_status_idx";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "scopeId",
ADD COLUMN     "subscriptionType" "SubscriptionType" NOT NULL DEFAULT 'TEAMTJIE_PLUS',
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SubscriptionScope" (
    "id" SERIAL NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedBy" TEXT NOT NULL,

    CONSTRAINT "SubscriptionScope_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionScope_scopeId_key" ON "SubscriptionScope"("scopeId");

-- CreateIndex
CREATE INDEX "SubscriptionScope_subscriptionId_idx" ON "SubscriptionScope"("subscriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionScope_scopeId_idx" ON "SubscriptionScope"("scopeId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionScope" ADD CONSTRAINT "SubscriptionScope_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionScope" ADD CONSTRAINT "SubscriptionScope_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
