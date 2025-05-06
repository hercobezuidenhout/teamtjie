import { RoleType } from "@prisma/client";
import prisma from "../prisma";

export const remvoeScopePostPermissionRole = async (scopePostPermissionId: number, role: RoleType) =>
    await prisma.scopePostPermissionRole.delete({
        where: {
            scopePostPermissionId_role: {
                role: role,
                scopePostPermissionId: scopePostPermissionId
            }
        }
    });