import prisma from "../prisma";

export const getDeactivatedUserByEmail = async (email: string) => {
    return await prisma.deactivateUser.findFirst({
        where: { email }
    });
};