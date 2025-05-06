import { ScopeRole } from "@prisma/client";
import prisma from "../prisma";

export const updateScopeRoleToAdmin = async (newAdmin: ScopeRole) =>
    await prisma.scopeRole.update({
        where: {
            role_scopeId_userId: {
                role: newAdmin.role,
                scopeId: newAdmin.scopeId,
                userId: newAdmin.userId,
            },
        },
        data: {
            role: 'ADMIN',
        },
    });