import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { get } from '@/services/network';
import { SentimentInsight } from '../types';

interface UseSentimentInsightsQueryProps {
  scopeId: number;
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

export const useSentimentInsightsQuery = ({
  scopeId,
  from,
  to,
}: UseSentimentInsightsQueryProps): UseQueryResult<SentimentInsight[]> => {
  return useQuery({
    queryKey: ['insights', 'sentiment', scopeId, from, to],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        scopeId: scopeId.toString(),
        from,
        to,
      });
      const response = await get<SentimentInsight[]>(
        `/api/insights/sentiment?${params}`,
        { signal }
      );
      return response || [];
    },
  });
};
