import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { get } from '@/services/network';
import { SentimentAverage } from '../types';

interface UseSentimentAverageQueryProps {
  scopeId: number;
  date?: string; // YYYY-MM-DD format
  enabled?: boolean;
}

export const useSentimentAverageQuery = ({
  scopeId,
  date,
  enabled = true,
}: UseSentimentAverageQueryProps): UseQueryResult<SentimentAverage> => {
  const dateParam = date || new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['sentiments', 'average', scopeId, dateParam],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        scopeId: scopeId.toString(),
        date: dateParam,
      });
      return get<SentimentAverage>(
        `/api/sentiments/average?${params}`,
        { signal }
      );
    },
    enabled,
  });
};
