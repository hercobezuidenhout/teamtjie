import { useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';

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
    queryFn: () =>
      get<SubscriptionResponse>(`${ENDPOINTS.billing.subscriptions}/${scopeId}`),
    enabled: !!scopeId && scopeId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
