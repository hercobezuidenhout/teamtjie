import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { put } from '@/services/network';
import { DailySentiment } from '../types';

interface UpdateSentimentDto {
  id: number;
  note: string;
}

export const useUpdateSentimentMutation = (): UseMutationResult<
  DailySentiment,
  Error,
  UpdateSentimentDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, note }: UpdateSentimentDto) => {
      return put<{ note: string }, DailySentiment>(
        `/api/sentiments/${id}`,
        { note }
      );
    },
    onSuccess: (data) => {
      const dateParam = new Date().toISOString().split('T')[0];

      // Invalidate the daily sentiment query
      queryClient.invalidateQueries({
        queryKey: ['sentiments', data.scopeId, dateParam],
      });
    },
  });
};
