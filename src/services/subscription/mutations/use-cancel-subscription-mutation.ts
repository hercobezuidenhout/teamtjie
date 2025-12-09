import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/services/network';

interface CancelSubscriptionParams {
  immediate?: boolean;
}

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CancelSubscriptionParams) =>
      post('/api/v1/billing/subscriptions/cancel', {
        immediate: params.immediate || false,
      }),
    onSuccess: () => {
      // Invalidate all subscription queries to refresh UI
      queryClient.invalidateQueries({
        queryKey: ['subscription'],
      });
    },
  });
};
