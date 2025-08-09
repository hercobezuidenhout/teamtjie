import { RoleType } from "@prisma/client";

export interface RemoveScopePostPermissionRole {
    scopePostPermissionId: number;
    role: RoleType;
}