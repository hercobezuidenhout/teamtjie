import { RoleType, ScopeType } from "@prisma/client";

export interface UserScopeRole {
    userId: string;
    scopeId: number;
    role: RoleType;
    scopeType: ScopeType;
}