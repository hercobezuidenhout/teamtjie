/*
  Warnings:

  - You are about to drop the column `spaceId` on the `Fine` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Fine` table. All the data in the column will be lost.
  - You are about to drop the `Space` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpaceEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpaceFeatureFlag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpaceInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpaceRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamFeatureFlag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamInvitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_teamId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceEvent" DROP CONSTRAINT "SpaceEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceEvent" DROP CONSTRAINT "SpaceEvent_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceFeatureFlag" DROP CONSTRAINT "SpaceFeatureFlag_featureFlagId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceFeatureFlag" DROP CONSTRAINT "SpaceFeatureFlag_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceInvitation" DROP CONSTRAINT "SpaceInvitation_invitationId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceInvitation" DROP CONSTRAINT "SpaceInvitation_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceRole" DROP CONSTRAINT "SpaceRole_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceRole" DROP CONSTRAINT "SpaceRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "TeamEvent" DROP CONSTRAINT "TeamEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "TeamEvent" DROP CONSTRAINT "TeamEvent_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamFeatureFlag" DROP CONSTRAINT "TeamFeatureFlag_featureFlagId_fkey";

-- DropForeignKey
ALTER TABLE "TeamFeatureFlag" DROP CONSTRAINT "TeamFeatureFlag_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvitation" DROP CONSTRAINT "TeamInvitation_invitationId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvitation" DROP CONSTRAINT "TeamInvitation_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamRole" DROP CONSTRAINT "TeamRole_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamRole" DROP CONSTRAINT "TeamRole_userId_fkey";

-- DropIndex
DROP INDEX "Scope_parentScopeId_name_key";

-- AlterTable
ALTER TABLE "Fine" DROP COLUMN "spaceId",
DROP COLUMN "teamId";

-- DropTable
DROP TABLE "Space";

-- DropTable
DROP TABLE "SpaceEvent";

-- DropTable
DROP TABLE "SpaceFeatureFlag";

-- DropTable
DROP TABLE "SpaceInvitation";

-- DropTable
DROP TABLE "SpaceRole";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamEvent";

-- DropTable
DROP TABLE "TeamFeatureFlag";

-- DropTable
DROP TABLE "TeamInvitation";

-- DropTable
DROP TABLE "TeamRole";

-- RenameForeignKey
ALTER TABLE "Scope" RENAME CONSTRAINT "Team_parentScopeId_fkey" TO "Scope_parentScopeId_fkey";
