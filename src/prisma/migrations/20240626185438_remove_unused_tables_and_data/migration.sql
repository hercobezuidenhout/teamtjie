/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FineEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FineReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FineScopeValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScopeSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Win` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WinScopeValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- Drop Views
DROP VIEW "SpaceEvent";
DROP VIEW "TeamEvent";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_scopeId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_id_fkey";

-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_issuedById_fkey";

-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_issuedToId_fkey";

-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_scopeId_scope_fk";

-- DropForeignKey
ALTER TABLE "FineEvent" DROP CONSTRAINT "FineEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "FineEvent" DROP CONSTRAINT "FineEvent_fineId_fkey";

-- DropForeignKey
ALTER TABLE "FineReview" DROP CONSTRAINT "FineReview_fineId_fkey";

-- DropForeignKey
ALTER TABLE "FineReview" DROP CONSTRAINT "FineReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "FineScopeValue" DROP CONSTRAINT "FineScopeValue_fineId_fkey";

-- DropForeignKey
ALTER TABLE "FineScopeValue" DROP CONSTRAINT "FineScopeValue_scopeValueId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_fineId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_id_fkey";

-- DropForeignKey
ALTER TABLE "PaymentReview" DROP CONSTRAINT "PaymentReview_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentReview" DROP CONSTRAINT "PaymentReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "ScopeSubscription" DROP CONSTRAINT "ScopeSubscription_scopeId_fkey";

-- DropForeignKey
ALTER TABLE "Win" DROP CONSTRAINT "Win_id_fkey";

-- DropForeignKey
ALTER TABLE "Win" DROP CONSTRAINT "Win_issuedById_fkey";

-- DropForeignKey
ALTER TABLE "Win" DROP CONSTRAINT "Win_issuedToId_fkey";

-- DropForeignKey
ALTER TABLE "Win" DROP CONSTRAINT "Win_scopeId_fkey";

-- DropForeignKey
ALTER TABLE "WinScopeValue" DROP CONSTRAINT "WinScopeValue_scopeValueId_fkey";

-- DropForeignKey
ALTER TABLE "WinScopeValue" DROP CONSTRAINT "WinScopeValue_winId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Fine";

-- DropTable
DROP TABLE "FineEvent";

-- DropTable
DROP TABLE "FineReview";

-- DropTable
DROP TABLE "FineScopeValue";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PaymentReview";

-- DropTable
DROP TABLE "Reaction";

-- DropTable
DROP TABLE "ScopeSubscription";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "Win";

-- DropTable
DROP TABLE "WinScopeValue";

-- DropEnum
DROP TYPE "EventType";

-- DropEnum
DROP TYPE "FineStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "ReviewStatus";

-- DropEnum
DROP TYPE "ScopeSubscriptionStatus";

-- DropEnum
DROP TYPE "TransactionType";
