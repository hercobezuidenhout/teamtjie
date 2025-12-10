import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/services/network';

interface AddTeamParams {
  scopeId: number;
}

export const useAddTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AddTeamParams) =>
      post('/api/v1/billing/subscriptions/teams/add', {
        scopeId: params.scopeId,
      }),
    onSuccess: () => {
      // Invalidate user subscription to refresh team list
      queryClient.invalidateQueries({
        queryKey: ['subscription', 'me'],
      });
      // Also invalidate all scope subscription queries
      queryClient.invalidateQueries({
        queryKey: ['subscription'],
      });
    },
  });
};
