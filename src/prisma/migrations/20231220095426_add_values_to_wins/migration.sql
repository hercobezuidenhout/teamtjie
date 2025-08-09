-- CreateTable
CREATE TABLE "WinScopeValue" (
    "scopeValueId" INTEGER NOT NULL,
    "winId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WinScopeValue_scopeValueId_winId_key" ON "WinScopeValue"("scopeValueId", "winId");

-- AddForeignKey
ALTER TABLE "WinScopeValue" ADD CONSTRAINT "WinScopeValue_scopeValueId_fkey" FOREIGN KEY ("scopeValueId") REFERENCES "ScopeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WinScopeValue" ADD CONSTRAINT "WinScopeValue_winId_fkey" FOREIGN KEY ("winId") REFERENCES "Win"("id") ON DELETE CASCADE ON UPDATE CASCADE;
