import { ScopeLink } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCallback } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { buildMutationOptions } from '@/services/utilities';

export const useDeleteLinkMutation = (scopeId: number) => {
  const queryClient = useQueryClient();

  const deleteLink = (id) => (draft: ScopeLink[] | undefined) => {
    return draft?.filter((Link) => Link.id !== id);
  };

  return useMutation(
    buildMutationOptions(
      (id: number) =>
        deleteCallback(`${ENDPOINTS.scopes.base}/${scopeId}/links/${id}`),
      queryClient,
      [
        [
          {
            queryKey: ['scopes', scopeId, 'links'],
          },
          deleteLink,
        ],
      ]
    )
  );
};
