import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/services/endpoints';
import { buildMutationOptions } from '@/services/utilities';
import { post } from '@/services/network';
import { CreateScopePostPermissionRole } from '@/models/types/create-scope-post-permission-role';

export const useCreateScopePostPermissionRoleMutation = (scopeId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    buildMutationOptions(
      (payload: CreateScopePostPermissionRole) =>
        post<CreateScopePostPermissionRole>(
          `${ENDPOINTS.scopes.base}/${scopeId}/permissions/roles`,
          payload
        ),
      queryClient,
      [
        [
          {
            queryKey: ['scopes', scopeId, 'permissions'],
          },
          undefined,
        ],
      ]
    )
  );
};
