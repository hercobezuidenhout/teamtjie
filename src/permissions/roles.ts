import { getUserWithRoles } from "@/prisma";
import { getAllScopesForParentScope } from "@/prisma/queries/get-all-scopes-for-parent-scope";
import { RoleType } from "@prisma/client";

export const userRoles = async (id: string) => {
    const user = await getUserWithRoles(id);
    const userSuperRoles = user.roles
        .filter(role => role.scopeType === 'SPACE' && role.role === 'ADMIN')
        .map(role => role.scopeId);

    const allScopesForParentScope = await getAllScopesForParentScope(userSuperRoles);
    const superRoles = allScopesForParentScope.map(scope => ({
        userId: id,
        scopeId: scope.id,
        scopeType: scope.type,
        role: RoleType.ADMIN
    }));

    const roles = [...user.roles, ...superRoles];
    return roles;
};