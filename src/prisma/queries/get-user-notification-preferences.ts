import prisma from "../prisma";

export const getUserNotificationPreferences = async (userId: string) =>
    await prisma.userNotificationPreference.findMany({
        where: { userId }
    });