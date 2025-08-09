import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';
import { UserWithWinCount } from '@/models';
import { ENDPOINTS } from '@/services/endpoints';

export const useUserQuery = (id?: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: ({ signal }: QueryFunctionContext) =>
      id
        ? get<UserWithWinCount>(`${ENDPOINTS.user.base}/${id}`, {
          signal,
        })
        : Promise.resolve(undefined),
  });
};
