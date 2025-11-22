/*
  Warnings:

  - You are about to drop the `FeatureFlag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScopeFeatureFlag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ScopeFeatureFlag" DROP CONSTRAINT "ScopeFeatureFlag_featureFlagId_fkey";

-- DropForeignKey
ALTER TABLE "ScopeFeatureFlag" DROP CONSTRAINT "ScopeFeatureFlag_scopeId_fkey";

-- DropTable
DROP TABLE "FeatureFlag";

-- DropTable
DROP TABLE "ScopeFeatureFlag";

-- DropEnum
DROP TYPE "FeatureFlagType";
