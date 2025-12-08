import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { get } from '@/services/network';
import { HealthCheck } from '../types';

interface UseHealthCheckQueryProps {
  healthCheckId: number;
}

export const useHealthCheckQuery = ({
  healthCheckId,
}: UseHealthCheckQueryProps): UseQueryResult<HealthCheck> => {
  return useQuery({
    queryKey: ['health-checks', healthCheckId],
    queryFn: async ({ signal }) => {
      return get<HealthCheck>(`/api/health-checks/${healthCheckId}`, { signal });
    },
    staleTime: 0, // Always refetch
    refetchOnMount: true,
  });
};
