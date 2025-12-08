import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { get } from '@/services/network';
import { HealthCheckInsight } from '../types';

interface UseHealthCheckInsightsQueryProps {
  scopeId: number;
}

export const useHealthCheckInsightsQuery = ({
  scopeId,
}: UseHealthCheckInsightsQueryProps): UseQueryResult<HealthCheckInsight | null> => {
  return useQuery({
    queryKey: ['insights', 'health-checks', scopeId],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        scopeId: scopeId.toString(),
      });
      return get<HealthCheckInsight>(
        `/api/insights/health-checks?${params}`,
        { signal }
      );
    },
  });
};
