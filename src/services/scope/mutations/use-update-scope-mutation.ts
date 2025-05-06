import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildMutationOptions } from '@/services/utilities';
import { put } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';

interface UpdateScopePayload {
  id: string | number;
  name: string;
  description?: string;
}

export const useUpdateScopeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    buildMutationOptions(
      ({ id, name, description }: UpdateScopePayload) =>
        put(`${ENDPOINTS.scopes.base}/${id}`, {
          name,
          description,
        }),
      queryClient,
      [
        [
          {
            queryKey: ['scopes'],
          },
          undefined,
        ],
      ]
    )
  );
};
