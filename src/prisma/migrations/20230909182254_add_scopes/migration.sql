-- CreateEnum
CREATE TYPE "ScopeType" AS ENUM ('SPACE', 'TEAM');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "scopeId" INTEGER;

-- AlterTable
ALTER TABLE "Fine" ADD COLUMN     "scopeId" INTEGER;

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "scopeId" INTEGER;

-- CreateTable
CREATE TABLE "Scope" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "type" "ScopeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentScopeId" INTEGER,

    CONSTRAINT "Scope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopeRole" (
    "role" "RoleType" NOT NULL DEFAULT 'MEMBER',
    "userId" TEXT NOT NULL,
    "scopeId" INTEGER NOT NULL,

    CONSTRAINT "ScopeRole_pkey" PRIMARY KEY ("role","scopeId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scope_parentScopeId_name_key" ON "Scope"("parentScopeId" DESC, "name");

-- AddForeignKey
ALTER TABLE "ScopeRole" ADD CONSTRAINT "ScopeRole_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeRole" ADD CONSTRAINT "ScopeRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scope" ADD CONSTRAINT "Team_parentScopeId_fkey" FOREIGN KEY ("parentScopeId") REFERENCES "Scope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateSpaceScopes
INSERT INTO "Scope" (name, image, "createdAt", "updatedAt", type) SELECT name, image, "createdAt", "updatedAt", 'SPACE' FROM "Space";

-- CreateTeamScopes
INSERT INTO "Scope" (name, image, "createdAt", "updatedAt", type, "parentScopeId")
SELECT "Team"."name", "Team"."image", "Team"."createdAt", "Team"."updatedAt", 'TEAM' , "Scope"."id"
FROM "Team"
INNER JOIN "Space"
ON "Team"."spaceId" = "Space"."id"
INNER JOIN "Scope"
ON "Space"."name" = "Scope"."name";

-- CreateSpaceScopeRoles
INSERT INTO "ScopeRole" (role, "userId", "scopeId")
SELECT MIN("role"), "userId", "Scope"."id"
FROM "SpaceRole"
INNER JOIN "Space"
ON "Space"."id" = "SpaceRole"."spaceId"
INNER JOIN "Scope"
ON "Space"."name" = "Scope"."name"
GROUP BY "userId", "Scope"."id";

-- CreateTeamScopeRoles
INSERT INTO "ScopeRole" (role, "userId", "scopeId")
SELECT MIN("role"), "userId", "Scope"."id"
FROM "TeamRole"
INNER JOIN "Team"
ON "Team"."id" = "TeamRole"."teamId"
INNER JOIN "Scope"
ON "Team"."name" = "Scope"."name"
GROUP BY "userId", "Scope"."id";

-- UpdateTeamEventScope
UPDATE "Event"
SET "scopeId" = "Scope"."id"
FROM "TeamEvent"
INNER JOIN "Team"
ON "TeamEvent"."teamId" = "Team"."id"
INNER JOIN "Scope"
ON "Team"."name" = "Scope"."name"
WHERE "TeamEvent"."eventId" = "Event"."id";

-- UpdateSpaceEventScope
UPDATE "Event"
SET "scopeId" = "Scope"."id"
FROM "SpaceEvent"
INNER JOIN "Space"
ON "SpaceEvent"."spaceId" = "Space"."id"
INNER JOIN "Scope"
ON "Space"."name" = "Scope"."name"
WHERE "SpaceEvent"."eventId" = "Event"."id";

-- UpdateSpaceFineScope
UPDATE "Fine"
SET "scopeId" = "Scope"."id"
FROM "Space"
INNER JOIN "Scope"
ON "Space"."name" = "Scope"."name"
WHERE "Space"."id" = "Fine"."spaceId";

-- UpdateSpaceFineScope
UPDATE "Fine"
SET "scopeId" = "Scope"."id"
FROM "Team"
INNER JOIN "Scope"
ON "Team"."name" = "Scope"."name"
WHERE "Team"."id" = "Fine"."teamId";

-- UpdateTeamInvitationScope
UPDATE "Invitation"
SET "scopeId" = "Scope"."id"
FROM "TeamInvitation"
INNER JOIN "Team"
ON "TeamInvitation"."teamId" = "Team"."id"
INNER JOIN "Scope"
ON "Team"."name" = "Scope"."name"
WHERE "TeamInvitation"."invitationId" = "Invitation"."id";

-- UpdateSpaceInvitationScope
UPDATE "Invitation"
SET "scopeId" = "Scope"."id"
FROM "SpaceInvitation"
INNER JOIN "Space"
ON "SpaceInvitation"."spaceId" = "Space"."id"
INNER JOIN "Scope"
ON "Space"."name" = "Scope"."name"
WHERE "SpaceInvitation"."invitationId" = "Invitation"."id";
