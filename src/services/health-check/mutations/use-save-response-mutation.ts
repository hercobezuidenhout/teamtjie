import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { post } from '@/services/network';
import { HealthCheckResponse, SaveResponseDto } from '../types';

export const useSaveResponseMutation = (): UseMutationResult<
  HealthCheckResponse,
  Error,
  SaveResponseDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SaveResponseDto) => {
      return post<HealthCheckResponse>(
        `/api/health-checks/${data.healthCheckId}/responses`,
        data
      );
    },
    onSuccess: (data) => {
      // Invalidate the specific health check
      queryClient.invalidateQueries({
        queryKey: ['health-checks', data.healthCheckId],
      });

      // Invalidate the health checks list to update completion status
      queryClient.invalidateQueries({
        queryKey: ['health-checks'],
      });
    },
  });
};
