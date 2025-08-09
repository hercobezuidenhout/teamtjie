-- CreateEnum
CREATE TYPE "ScopePostPermissionAction" AS ENUM ('post', 'read', 'view_author');

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

-- AddForeignKey
ALTER TABLE "ScopePostPermission" ADD CONSTRAINT "ScopePostPermission_scopeId_scope_fk" FOREIGN KEY ("scopeId") REFERENCES "Scope"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopePostPermissionRole" ADD CONSTRAINT "ScopePostPermissionRole_scopeId_scope_fk" FOREIGN KEY ("scopePostPermissionId") REFERENCES "ScopePostPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
