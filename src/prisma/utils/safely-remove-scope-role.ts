import { RoleType } from "@prisma/client";
import { deleteScope } from "../commands/delete-scope";
import { updateScopeRoleToAdmin } from "../commands/update-scope-role-to-admin";
import { deleteScopeRole } from "../commands/delete-scope-role";
import { deleteUserPostsFromScope } from "../commands/delete-user-posts-from-scope";

export type ScopeWithRoles = {
    id: number;
    roles: {
        role: RoleType;
        userId: string;
        scopeId: number;
    }[];
};

const scopeHasMoreThanOneAdmin = (scope: ScopeWithRoles) =>
    scope.roles.filter((role) => role.role === 'ADMIN').length > 1;

export const assignNewRoleAndRemoveUserFromScope = async (
    scope: ScopeWithRoles,
    userId: string
) => {
    const filteredRoles = scope.roles.filter((role) => role.userId !== userId);

    const scopeHasMoreThanOneRole = filteredRoles.length > 0;
    if (scopeHasMoreThanOneRole) {
        if (!scopeHasMoreThanOneAdmin(scope)) {
            const newAdmin = filteredRoles[0];
            await updateScopeRoleToAdmin(newAdmin);
        }
    }

    await deleteScopeRole({ role: 'ADMIN', userId: userId, scopeId: scope.id });

    if (!scopeHasMoreThanOneRole) {
        await deleteScope(scope.id);
    }
};

const userIsScopeAdmin = (scope: ScopeWithRoles, userId: string) =>
    scope.roles.find((role) => role.userId === userId)?.role === 'ADMIN';


export const safelyRemoveScopeRole = async (scope: ScopeWithRoles, userId: string) => {
    if (userIsScopeAdmin(scope, userId)) {
        try {
            await assignNewRoleAndRemoveUserFromScope(scope, userId);
        } catch (error) {
            throw new Error(
                `Failed to assign new role and remove user from scope. ${(error as Error).message
                }`
            );
        }
    } else {
        try {
            await deleteScopeRole({
                userId: userId,
                scopeId: scope.id,
                role: 'MEMBER',
            });

            await deleteUserPostsFromScope(scope.id, userId);
        } catch (error) {
            throw new Error(
                `Failed to delete user scope role. ${(error as Error).message}`
            );
        }
    }
};