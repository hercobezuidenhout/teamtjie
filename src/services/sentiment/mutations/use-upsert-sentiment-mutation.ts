import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { post } from '@/services/network';
import { DailySentiment, CreateSentimentDto } from '../types';

export const useCreateSentimentMutation = (): UseMutationResult<
  DailySentiment,
  Error,
  CreateSentimentDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSentimentDto) => {
      return post<DailySentiment>('/api/sentiments', data);
    },
    onSuccess: (data) => {
      const dateParam = new Date().toISOString().split('T')[0];

      // Invalidate the daily sentiment query
      queryClient.invalidateQueries({
        queryKey: ['sentiments', data.scopeId, dateParam],
      });

      // Invalidate the average sentiment query
      queryClient.invalidateQueries({
        queryKey: ['sentiments', 'average', data.scopeId, dateParam],
      });
    },
  });
};

// Keep old name for backward compatibility
export const useUpsertSentimentMutation = useCreateSentimentMutation;
