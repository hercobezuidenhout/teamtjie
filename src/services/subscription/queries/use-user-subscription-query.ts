import { useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';

interface Team {
  id: number;
  scopeId: number;
  scopeName: string;
  scopeType: string;
  addedAt: string;
}

interface UserSubscriptionResponse {
  hasSubscription: boolean;
  subscription: {
    id: number;
    status: string;
    subscriptionType: string;
    amount: number;
    currency: string;
    currentPeriodStart?: string | null;
    currentPeriodEnd?: string | null;
    cancelAtPeriodEnd?: boolean;
    externalSubscriptionId?: string | null;
    externalCustomerId?: string | null;
    createdAt: string;
    teams: Team[];
    teamCount: number;
  } | null;
}

/**
 * Get current user's subscription with included teams
 */
export const useUserSubscriptionQuery = () => {
  return useQuery<UserSubscriptionResponse>({
    queryKey: ['subscription', 'me'],
    queryFn: () => get<UserSubscriptionResponse>('/api/v1/billing/subscriptions/me'),
    staleTime: 60 * 1000, // 1 minute
  });
};
