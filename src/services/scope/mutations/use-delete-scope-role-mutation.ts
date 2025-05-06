import { RemoveScopeRoleDto } from '@/models/dtos/scope/remove-scope-role';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/services/endpoints';
import { put } from '@/services/network';

interface RemoveScopeRolePayload {
  userId: string;
  role: string;
}

export const useRemoveScopeRoleMutation = (
  scopeId: number,
  queryKey: QueryKey
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveScopeRolePayload) =>
      put<RemoveScopeRoleDto>(
        `${ENDPOINTS.scopes.base}/${scopeId}/roles/remove`,
        payload
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
};
