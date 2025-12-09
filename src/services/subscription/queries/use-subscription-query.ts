import { useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';

interface SubscriptionResponse {
  hasSubscription: boolean;
  subscription: any | null;
}

/**
 * Check if a scope has an active subscription
 */
export const useSubscriptionQuery = (scopeId: number) => {
  return useQuery<SubscriptionResponse>({
    queryKey: ['subscription', scopeId],
    queryFn: async () => {
      // For now, return false since we haven't implemented the API endpoint yet
      // This will be updated when we implement the subscription endpoints
      return { hasSubscription: false, subscription: null };
    },
    enabled: !!scopeId && scopeId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
