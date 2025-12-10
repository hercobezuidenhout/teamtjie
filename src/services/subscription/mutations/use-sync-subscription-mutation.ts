import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/services/network';

export const useSyncSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => post('/api/v1/billing/subscriptions/sync', {}),
    onSuccess: () => {
      // Invalidate all subscription queries to refresh
      queryClient.invalidateQueries({
        queryKey: ['subscription'],
      });
    },
  });
};
