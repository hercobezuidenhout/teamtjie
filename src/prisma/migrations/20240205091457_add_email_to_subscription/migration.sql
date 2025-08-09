/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ScopeSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ScopeSubscription" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ScopeSubscription_email_key" ON "ScopeSubscription"("email");
