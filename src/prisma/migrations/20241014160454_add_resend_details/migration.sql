-- CreateTable
CREATE TABLE "ScopeResendDetails" (
    "id" SERIAL NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "apiKey" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,

    CONSTRAINT "ScopeResendDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScopeResendDetails" ADD CONSTRAINT "ScopeResendDetails_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
