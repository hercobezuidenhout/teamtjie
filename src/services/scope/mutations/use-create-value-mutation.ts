import { CreateScopeValueDto } from '@/models';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { put } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { buildMutationOptions } from '@/services/utilities';

interface CreateValuePayload {
  name: string;
  description: string;
}

export const useCreateValueMutation = (scopeId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    buildMutationOptions(
      (payload: CreateValuePayload) =>
        put<CreateScopeValueDto>(
          `${ENDPOINTS.scopes.base}/${scopeId}/values`,
          payload
        ),
      queryClient,
      [
        [
          {
            queryKey: ['scopes', scopeId, 'values'],
          },
          undefined,
        ],
      ]
    )
  );
};
