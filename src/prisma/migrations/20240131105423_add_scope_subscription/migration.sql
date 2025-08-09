-- CreateEnum
CREATE TYPE "ScopeSubscriptionStatus" AS ENUM ('ACTIVE', 'NONRENEWING', 'ATTENTION', 'COMPLETED', 'CANCELLED', 'PENDING');

-- CreateTable
CREATE TABLE "ScopeSubscription" (
    "id" SERIAL NOT NULL,
    "authCode" TEXT NOT NULL,
    "subCode" TEXT,
    "status" "ScopeSubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "scopeId" INTEGER NOT NULL,

    CONSTRAINT "ScopeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScopeSubscription_authCode_key" ON "ScopeSubscription"("authCode");

-- CreateIndex
CREATE UNIQUE INDEX "ScopeSubscription_subCode_key" ON "ScopeSubscription"("subCode");

-- AddForeignKey
ALTER TABLE "ScopeSubscription" ADD CONSTRAINT "ScopeSubscription_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
