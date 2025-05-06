import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';
import { ScopeLink } from '@prisma/client';
import { ENDPOINTS } from '@/services/endpoints';

export const useScopeLinksQuery = (id: number) => {
  return useQuery({
    queryKey: ['scopes', id, 'links'],
    queryFn: ({ signal }: QueryFunctionContext) =>
      get<ScopeLink[]>(`${ENDPOINTS.scopes.base}/${id}/links`, { signal }),
  });
};
