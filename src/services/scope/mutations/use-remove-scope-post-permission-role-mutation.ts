import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/services/endpoints';
import { buildMutationOptions } from '@/services/utilities';
import { put } from '@/services/network';
import { RemoveScopePostPermissionRole } from '@/models/types/remove-scope-post-permission-role';

export const useRemoveScopePostPermissionRoleMutation = (scopeId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    buildMutationOptions(
      (payload: RemoveScopePostPermissionRole) =>
        put<RemoveScopePostPermissionRole>(
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
