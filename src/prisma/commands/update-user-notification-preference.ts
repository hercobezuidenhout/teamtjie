import prisma from "../prisma";
import { UserNotificationPreference } from "@prisma/client";

type UpdateUserNotificationPreferenceCommand = Omit<UserNotificationPreference, 'id'>;

export const updateUserNotificationPreference = async ({ enabled, ...preference }: UpdateUserNotificationPreferenceCommand) =>
    await prisma.userNotificationPreference.upsert({
        where: {
            userId_type_event: {
                ...preference
            }
        },
        update: { enabled },
        create: {
            enabled,
            ...preference
        }
    });