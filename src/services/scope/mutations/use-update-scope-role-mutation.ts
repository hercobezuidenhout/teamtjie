import { UpdateScopeRoleDto } from '@/models/dtos/scope/update-scope-role';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { put } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';

interface UpdateScopeRolePayload {
  userId: string;
  currentRole: string;
  newRole: string;
}

export const useUpdateScopeRoleMutation = (
  scopeId: number,
  queryKey: QueryKey
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateScopeRolePayload) =>
      put<UpdateScopeRoleDto>(
        `${ENDPOINTS.scopes.base}/${scopeId}/roles`,
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
