import { NotificationType } from "@prisma/client";
import prisma from "../prisma";

export const getUserEmailPreferences = async (userId: string) =>
    await prisma.userNotificationPreference.findMany({
        where: {
            userId: userId,
            type: NotificationType.EMAIL
        }
    });