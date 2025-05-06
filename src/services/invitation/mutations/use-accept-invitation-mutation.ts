import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/services/network';
import { Invitation } from '@prisma/client';
import { ENDPOINTS } from '@/services/endpoints';

export const useAcceptInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hash: string) =>
      post<Invitation>(`${ENDPOINTS.invitations.base}/${hash}/accept`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['spaces'],
      });
    },
  });
};
