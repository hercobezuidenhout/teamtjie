import { CreateScopeLinkDto } from '@/models';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/services/endpoints';
import { buildMutationOptions } from '@/services/utilities';
import { post } from '@/services/network';

interface CreateLinkPayload {
  url: string;
  title: string;
  isPublic: boolean;
}

export const useCreateLinkMutation = (scopeId: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    buildMutationOptions(
      (payload: CreateLinkPayload) =>
        post<CreateScopeLinkDto>(
          `${ENDPOINTS.scopes.base}/${scopeId}/links`,
          payload
        ),
      queryClient,
      [
        [
          {
            queryKey: ['scopes', scopeId, 'links'],
          },
          undefined,
        ],
      ]
    )
  );
};
