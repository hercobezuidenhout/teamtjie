-- CreateTable
CREATE TABLE "DailySentiment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "sentiment" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailySentiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopeSettings" (
    "id" SERIAL NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "showAverageSentiment" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ScopeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailySentiment_scopeId_date_idx" ON "DailySentiment"("scopeId", "date");

-- CreateIndex
CREATE INDEX "DailySentiment_userId_scopeId_idx" ON "DailySentiment"("userId", "scopeId");

-- CreateIndex
CREATE UNIQUE INDEX "DailySentiment_userId_scopeId_date_key" ON "DailySentiment"("userId", "scopeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ScopeSettings_scopeId_key" ON "ScopeSettings"("scopeId");

-- AddForeignKey
ALTER TABLE "DailySentiment" ADD CONSTRAINT "DailySentiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailySentiment" ADD CONSTRAINT "DailySentiment_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeSettings" ADD CONSTRAINT "ScopeSettings_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
