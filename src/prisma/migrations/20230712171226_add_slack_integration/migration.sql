-- CreateTable
CREATE TABLE "SlackTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "installationId" INTEGER NOT NULL,

    CONSTRAINT "SlackTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlackUser" (
    "id" TEXT NOT NULL,
    "token" TEXT,
    "scopes" TEXT,
    "installationId" INTEGER NOT NULL,

    CONSTRAINT "SlackUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlackEnterprise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "installationId" INTEGER NOT NULL,

    CONSTRAINT "SlackEnterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlackInstallation" (
    "id" SERIAL NOT NULL,
    "tokenType" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,

    CONSTRAINT "SlackInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceInstallation" (
    "spaceId" INTEGER NOT NULL,
    "installationId" INTEGER NOT NULL,

    CONSTRAINT "SpaceInstallation_pkey" PRIMARY KEY ("spaceId","installationId")
);
