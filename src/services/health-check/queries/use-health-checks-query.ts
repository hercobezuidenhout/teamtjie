import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { get } from '@/services/network';
import { HealthCheck } from '../types';

interface UseHealthChecksQueryProps {
  scopeId: number;
}

export const useHealthChecksQuery = ({
  scopeId,
}: UseHealthChecksQueryProps): UseQueryResult<HealthCheck[]> => {
  return useQuery({
    queryKey: ['health-checks', scopeId],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        scopeId: scopeId.toString(),
      });
      return get<HealthCheck>(`/api/health-checks?${params}`, { signal });
    },
  });
};
