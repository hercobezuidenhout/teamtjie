import { RoleType } from "@prisma/client";
import prisma from "../prisma";

export const checkAndCreateScopePermissions = async (scopeId: number) => {
    const scopePermissions = await prisma.scopePostPermission.findMany({
        where: { scopeId }
    });

    if (scopePermissions.length) return;

    const DEFAULT_ROLES = {
        createMany: {
            data: [
                { role: RoleType.ADMIN },
                { role: RoleType.MEMBER },
                { role: RoleType.GUEST }
            ]
        }
    };

    await prisma.scopePostPermission.create({
        data: {
            scopeId: scopeId,
            action: 'post',
            type: 'FINE',
            roles: DEFAULT_ROLES
        }
    });

    await prisma.scopePostPermission.create({
        data: {
            scopeId: scopeId,
            action: 'post',
            type: 'WIN',
            roles: DEFAULT_ROLES
        }
    });

    await prisma.scopePostPermission.create({
        data: {
            scopeId: scopeId,
            action: 'post',
            type: 'PAYMENT',
            roles: DEFAULT_ROLES
        }
    });

    await prisma.scopePostPermission.create({
        data: {
            scopeId: scopeId,
            action: 'read',
            type: 'FINE',
            roles: DEFAULT_ROLES
        }
    });

    await prisma.scopePostPermission.create({
        data: {
            scopeId: scopeId,
            action: 'read',
            type: 'WIN',
            roles: DEFAULT_ROLES
        }
    });

    await prisma.scopePostPermission.create({
        data: {
            scopeId: scopeId,
            action: "read",
            type: 'PAYMENT',
            roles: DEFAULT_ROLES
        }
    });

    await prisma.scopePostPermission.create({
        data: {
            scopeId: scopeId,
            action: 'view_author',
            type: 'FINE',
            roles: DEFAULT_ROLES
        }
    });

    await prisma.scopePostPermission.create({
        data: {
            scopeId: scopeId,
            action: 'view_author',
            type: 'WIN',
            roles: DEFAULT_ROLES
        }
    });

    await prisma.scopePostPermission.create({
        data: {
            scopeId: scopeId,
            action: 'view_author',
            type: 'PAYMENT',
            roles: DEFAULT_ROLES
        }
    });
};