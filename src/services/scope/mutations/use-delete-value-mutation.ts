import { ScopeValue } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/services/endpoints';
import { buildMutationOptions } from '@/services/utilities';
import { deleteCallback } from '@/services/network';

export const useDeleteValueMutation = (scopeId: number) => {
  const queryClient = useQueryClient();

  const deleteValue = (id) => (draft: ScopeValue[] | undefined) => {
    return draft?.filter((value) => value.id !== id);
  };

  return useMutation(
    buildMutationOptions(
      (id: number) =>
        deleteCallback(`${ENDPOINTS.scopes.base}/${scopeId}/values/${id}`),
      queryClient,
      [
        [
          {
            queryKey: ['scopes', scopeId, 'values'],
          },
          deleteValue,
        ],
      ]
    )
  );
};
