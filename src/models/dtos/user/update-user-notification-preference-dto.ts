import { NotificationType } from "@prisma/client";

export interface UpdateUserNotificationPreferenceDto {
    id?: number;
    type: NotificationType;
    event: string;
    enabled: boolean;
}