import prisma from "../prisma";

export const deactivateUser = async (id: string, email: string) => {
    await prisma.deactivateUser.create({
        data: { id, email }
    });
};