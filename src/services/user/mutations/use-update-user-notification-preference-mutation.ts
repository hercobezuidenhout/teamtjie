import { UpdateUserNotificationPreferenceDto } from "@/models/dtos/user/update-user-notification-preference-dto";
import { ENDPOINTS } from "@/services/endpoints";
import { put } from "@/services/network";
import { buildMutationOptions } from "@/services/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUserNotificationPreferenceMutation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        buildMutationOptions(
            (payload: UpdateUserNotificationPreferenceDto) =>
                put<UpdateUserNotificationPreferenceDto>(`${ENDPOINTS.user.base}/${userId}/notifications/preferences`, payload),
            queryClient,
            [
                [
                    {
                        queryKey: ['users', userId, 'notifications', 'preferences'],
                    },
                    undefined,
                ],
            ]
        )
    );
};