import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/services/network';

interface RemoveTeamParams {
  scopeId: number;
}

export const useRemoveTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RemoveTeamParams) =>
      post('/api/v1/billing/subscriptions/teams/remove', {
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
