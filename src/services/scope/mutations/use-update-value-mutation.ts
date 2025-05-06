import { UpdateScopeValueDto } from '@/models';
import { ScopeValue } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildMutationOptions } from '@/services/utilities';
import { ENDPOINTS } from '@/services/endpoints';
import { put } from '@/services/network';

interface UpdateValuePayload {
  id: number;
  name: string;
  description: string;
}

const updateValue = (payload) => (draft: ScopeValue[] | undefined) => {
  const value = (draft ?? []).find(({ id }) => id == payload.id);

  if (!value) {
    return;
  }

  value.name = payload.name;
  value.description = payload.description;
};

export const useUpdateValueMutation = (scopeId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    buildMutationOptions(
      (payload: UpdateValuePayload) =>
        put<UpdateScopeValueDto>(
          `${ENDPOINTS.scopes.base}/${scopeId}/values/${payload.id}`,
          payload
        ),
      queryClient,
      [
        [
          {
            queryKey: ['scopes', scopeId, 'values'],
          },
          updateValue,
        ],
      ]
    )
  );
};
