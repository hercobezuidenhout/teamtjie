-- CreateTable
CREATE TABLE "FineScopeValue" (
    "scopeValueId" INTEGER NOT NULL,
    "fineId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FineScopeValue_scopeValueId_fineId_key" ON "FineScopeValue"("scopeValueId", "fineId");

-- AddForeignKey
ALTER TABLE "FineScopeValue" ADD CONSTRAINT "FineScopeValue_scopeValueId_fkey" FOREIGN KEY ("scopeValueId") REFERENCES "ScopeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FineScopeValue" ADD CONSTRAINT "FineScopeValue_fineId_fkey" FOREIGN KEY ("fineId") REFERENCES "Fine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
