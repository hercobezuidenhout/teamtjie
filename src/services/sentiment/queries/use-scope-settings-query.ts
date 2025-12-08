import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { get } from '@/services/network';
import { ScopeSettings } from '../types';

interface UseScopeSettingsQueryProps {
  scopeId: number;
}

export const useScopeSettingsQuery = ({
  scopeId,
}: UseScopeSettingsQueryProps): UseQueryResult<ScopeSettings> => {
  return useQuery({
    queryKey: ['scopes', scopeId, 'settings'],
    queryFn: async ({ signal }) => {
      return get<ScopeSettings>(
        `/api/scopes/${scopeId}/settings`,
        { signal }
      );
    },
  });
};
