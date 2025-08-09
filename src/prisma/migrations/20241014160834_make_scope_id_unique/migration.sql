/*
  Warnings:

  - A unique constraint covering the columns `[scopeId]` on the table `ScopeResendDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScopeResendDetails_scopeId_key" ON "ScopeResendDetails"("scopeId");
