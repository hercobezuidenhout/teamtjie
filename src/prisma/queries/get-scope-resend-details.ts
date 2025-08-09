import prisma from "../prisma";

export const getScopeResendDetails = async (scopeId: number) =>
    await prisma.scopeResendDetails.findFirst({
        where: { scopeId }
    });