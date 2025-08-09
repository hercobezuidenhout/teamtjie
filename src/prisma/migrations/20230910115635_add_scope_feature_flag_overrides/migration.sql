-- CreateTable
CREATE TABLE "ScopeFeatureFlag" (
    "featureFlagId" INTEGER NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ScopeFeatureFlag_pkey" PRIMARY KEY ("featureFlagId","scopeId")
);

-- AddForeignKey
ALTER TABLE "ScopeFeatureFlag" ADD CONSTRAINT "ScopeFeatureFlag_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeFeatureFlag" ADD CONSTRAINT "ScopeFeatureFlag_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
