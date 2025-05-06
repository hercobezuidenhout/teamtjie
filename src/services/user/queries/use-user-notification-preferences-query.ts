import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { UserNotificationPreference } from '@prisma/client';

export const useUserNotificationPreferencesQuery = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'notifications', 'preferences'],
    queryFn: ({ signal }: QueryFunctionContext) =>
      get<UserNotificationPreference[]>(`${ENDPOINTS.user.base}/${userId}/notifications/preferences`, {
        signal,
      }),
  });
};
