import { RoleType } from "@prisma/client";

export interface CreateScopePostPermissionRole {
    scopePostPermissionId: number;
    role: RoleType;
}