import { getScopePermissions } from "@/prisma/queries/get-scope-permissions";
import { abilities } from "./abilities";
import { userRoles } from "./roles";

export const getPermissions = async (id: string) => {
    const roles = await userRoles(id);
    const scopeRoles = await getScopePermissions(roles.map(role => role.scopeId));
    return abilities(roles, scopeRoles);
};