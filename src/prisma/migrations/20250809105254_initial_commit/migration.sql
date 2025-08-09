-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "FeatureFlagType" AS ENUM ('STRING', 'DATE', 'INT', 'BOOLEAN');

-- CreateEnum
CREATE TYPE "ScopeType" AS ENUM ('SPACE', 'TEAM');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('WIN');

-- CreateEnum
CREATE TYPE "ScopePostPermissionAction" AS ENUM ('post', 'read', 'view_author');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'IN_APP');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "image" TEXT,
    "aboutMe" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeactivateUser" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DeactivateUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scope" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "type" "ScopeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentScopeId" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Scope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopeValue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scopeId" INTEGER NOT NULL,

    CONSTRAINT "ScopeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopeLink" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL,

    CONSTRAINT "ScopeLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopeFeatureFlag" (
    "featureFlagId" INTEGER NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ScopeFeatureFlag_pkey" PRIMARY KEY ("featureFlagId","scopeId")
);

-- CreateTable
CREATE TABLE "ScopeRole" (
    "role" "RoleType" NOT NULL DEFAULT 'MEMBER',
    "userId" TEXT NOT NULL,
    "scopeId" INTEGER NOT NULL,

    CONSTRAINT "ScopeRole_pkey" PRIMARY KEY ("role","scopeId","userId")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FeatureFlagType" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "defaultRole" "RoleType" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "issuedById" TEXT NOT NULL,
    "issuedToId" TEXT,
    "description" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostReaction" (
    "postId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("postId","userId","reaction")
);

-- CreateTable
CREATE TABLE "PostValue" (
    "scopeValueId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "TeamtjieToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamtjieToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopePostPermission" (
    "id" SERIAL NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "action" "ScopePostPermissionAction" NOT NULL,
    "type" "PostType" NOT NULL,

    CONSTRAINT "ScopePostPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopePostPermissionRole" (
    "scopePostPermissionId" INTEGER NOT NULL,
    "role" "RoleType" NOT NULL,

    CONSTRAINT "ScopePostPermissionRole_pkey" PRIMARY KEY ("scopePostPermissionId","role")
);

-- CreateTable
CREATE TABLE "AcceptedInvite" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitationId" INTEGER NOT NULL,

    CONSTRAINT "AcceptedInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotificationPreference" (
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "event" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,

    CONSTRAINT "UserNotificationPreference_pkey" PRIMARY KEY ("userId","type","event")
);

-- CreateTable
CREATE TABLE "ScopeResendDetails" (
    "id" SERIAL NOT NULL,
    "scopeId" INTEGER NOT NULL,
    "apiKey" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,

    CONSTRAINT "ScopeResendDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DeactivateUser_email_key" ON "DeactivateUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ScopeValue_scopeId_name_key" ON "ScopeValue"("scopeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ScopeLink_scopeId_title_key" ON "ScopeLink"("scopeId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "ScopeLink_scopeId_url_key" ON "ScopeLink"("scopeId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_name_key" ON "FeatureFlag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PostValue_scopeValueId_postId_key" ON "PostValue"("scopeValueId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "ScopeResendDetails_scopeId_key" ON "ScopeResendDetails"("scopeId");

-- AddForeignKey
ALTER TABLE "Scope" ADD CONSTRAINT "Scope_parentScopeId_fkey" FOREIGN KEY ("parentScopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeValue" ADD CONSTRAINT "ScopeValue_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeLink" ADD CONSTRAINT "ScopeLink_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeFeatureFlag" ADD CONSTRAINT "ScopeFeatureFlag_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeFeatureFlag" ADD CONSTRAINT "ScopeFeatureFlag_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeRole" ADD CONSTRAINT "ScopeRole_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeRole" ADD CONSTRAINT "ScopeRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_issuedToId_fkey" FOREIGN KEY ("issuedToId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_scopeId_scope_fk" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostValue" ADD CONSTRAINT "PostValue_scopeValueId_fkey" FOREIGN KEY ("scopeValueId") REFERENCES "ScopeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostValue" ADD CONSTRAINT "PostValue_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopePostPermission" ADD CONSTRAINT "ScopePostPermission_scopeId_scope_fk" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopePostPermissionRole" ADD CONSTRAINT "ScopePostPermissionRole_scopeId_scope_fk" FOREIGN KEY ("scopePostPermissionId") REFERENCES "ScopePostPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptedInvite" ADD CONSTRAINT "AcceptedInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptedInvite" ADD CONSTRAINT "AcceptedInvite_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotificationPreference" ADD CONSTRAINT "UserNotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeResendDetails" ADD CONSTRAINT "ScopeResendDetails_scopeId_fkey" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
