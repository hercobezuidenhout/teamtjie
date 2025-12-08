import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { get } from '@/services/network';
import { CultureInsight } from '../types';

interface UseCultureInsightsQueryProps {
  scopeId: number;
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

export const useCultureInsightsQuery = ({
  scopeId,
  from,
  to,
}: UseCultureInsightsQueryProps): UseQueryResult<CultureInsight> => {
  return useQuery({
    queryKey: ['insights', 'culture', scopeId, from, to],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        scopeId: scopeId.toString(),
        from,
        to,
      });
      return get<CultureInsight>(
        `/api/insights/culture?${params}`,
        { signal }
      );
    },
  });
};
