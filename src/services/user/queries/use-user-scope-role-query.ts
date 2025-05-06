import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { UserScopeRole } from '@/models/types/user-scope-role';

export const useUserScopeRoleQuery = (id: string, scopeId: number) => {
  return useQuery({
    queryKey: ['users', id, 'roles', scopeId],
    queryFn: ({ signal }: QueryFunctionContext) =>
      id
        ? get<UserScopeRole>(`${ENDPOINTS.user.base}/${id}/roles/${scopeId}`, {
          signal,
        })
        : Promise.resolve(undefined),
  });
};
