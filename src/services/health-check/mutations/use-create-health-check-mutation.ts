import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { post } from '@/services/network';
import { HealthCheck, CreateHealthCheckDto } from '../types';

export const useCreateHealthCheckMutation = (): UseMutationResult<
  HealthCheck,
  Error,
  CreateHealthCheckDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHealthCheckDto) => {
      return post<HealthCheck>('/api/health-checks', data);
    },
    onSuccess: (data) => {
      // Invalidate health checks list
      queryClient.invalidateQueries({
        queryKey: ['health-checks', data.scopeId],
      });
    },
  });
};
