/*
  Warnings:

  - The primary key for the `SpaceInstallation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `SlackEnterprise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SlackInstallation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SlackTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "SpaceInstallation" DROP CONSTRAINT "SpaceInstallation_pkey",
ADD COLUMN     "installationType" TEXT NOT NULL DEFAULT 'team',
ADD CONSTRAINT "SpaceInstallation_pkey" PRIMARY KEY ("spaceId", "installationId", "installationType");

-- DropTable
DROP TABLE "SlackEnterprise";

-- DropTable
DROP TABLE "SlackInstallation";

-- DropTable
DROP TABLE "SlackTeam";

-- CreateTable
CREATE TABLE "SlackTeamInstallation" (
    "id" SERIAL NOT NULL,
    "tokenType" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,

    CONSTRAINT "SlackTeamInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlackEnterpriseInstallation" (
    "id" SERIAL NOT NULL,
    "tokenType" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "enterpriseId" TEXT NOT NULL,
    "enterpriseName" TEXT NOT NULL,

    CONSTRAINT "SlackEnterpriseInstallation_pkey" PRIMARY KEY ("id")
);
