import { useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';
import { Subscription } from '@prisma/client';

export function useScopeSubscriptionQuery(scopeId: number | undefined) {
    return useQuery({
        queryKey: ['subscription', scopeId],
        queryFn: async ({ signal }) => {
            if (!scopeId) return null;
            return get<Subscription | null>(`/api/v1/billing/subscriptions/${scopeId}`, { signal });
        },
        enabled: !!scopeId,
    });
}