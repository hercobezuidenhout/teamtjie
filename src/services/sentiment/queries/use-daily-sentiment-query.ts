import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { get } from '@/services/network';
import { DailySentiment } from '../types';

interface UseDailySentimentQueryProps {
  scopeId: number;
  date?: string; // YYYY-MM-DD format
}

export const useDailySentimentQuery = ({
  scopeId,
  date,
}: UseDailySentimentQueryProps): UseQueryResult<DailySentiment | null> => {
  const dateParam = date || new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['sentiments', scopeId, dateParam],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        scopeId: scopeId.toString(),
        date: dateParam,
      });
      const response = await get<DailySentiment>(
        `/api/sentiments?${params}`,
        { signal }
      );
      return response || null;
    },
  });
};
