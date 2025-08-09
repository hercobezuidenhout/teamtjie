import { PostType, RoleType, ScopePostPermissionAction } from "@prisma/client";
import prisma from "../prisma";

export interface ScopePostPermission {
    scopePostPermissionId: number;
    scopeId: number;
    action: ScopePostPermissionAction;
    type: PostType,
    roles: RoleType[];
}

export const getScopePermissions = async (scopeId: number | number[]) => {
    const isSingleId = typeof (scopeId) === 'number';
    const permissions = await prisma.scopePostPermission.findMany({
        where: {
            scopeId: isSingleId ? scopeId : {
                in: scopeId
            }
        },
        include: {
            roles: {
                select: {
                    role: true
                }
            }
        }
    });

    return permissions.map(permission => ({
        scopeId: permission.scopeId,
        scopePostPermissionId: permission.id,
        action: permission.action,
        type: permission.type,
        roles: permission.roles.map(role => role.role)
    }));
};