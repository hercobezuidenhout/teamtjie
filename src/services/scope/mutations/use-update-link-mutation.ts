import { UpdateScopeLinkDto } from '@/models';
import { ScopeLink } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildMutationOptions } from '@/services/utilities';
import { ENDPOINTS } from '@/services/endpoints';
import { put } from '@/services/network';

interface UpdateLinkPayload {
  id: number;
  url: string;
  title: string;
  isPublic: boolean;
}

const updateLink = (payload) => (draft: ScopeLink[] | undefined) => {
  const Link = (draft ?? []).find(({ id }) => id == payload.id);

  if (!Link) {
    return;
  }

  Link.url = payload.url;
  Link.title = payload.title;
};

export const useUpdateLinkMutation = (scopeId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    buildMutationOptions(
      (payload: UpdateLinkPayload) =>
        put<UpdateScopeLinkDto>(
          `${ENDPOINTS.scopes.base}/${scopeId}/links/${payload.id}`,
          payload
        ),
      queryClient,
      [
        [
          {
            queryKey: ['scopes', scopeId, 'links'],
          },
          updateLink,
        ],
      ]
    )
  );
};
