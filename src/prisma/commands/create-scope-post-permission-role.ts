import { RoleType } from "@prisma/client";
import prisma from "../prisma";

export const createScopePostPermissionRole = async (scopePostPermissionId: number, role: RoleType) =>
    await prisma.scopePostPermissionRole.create({
        data: { scopePostPermissionId, role }
    });