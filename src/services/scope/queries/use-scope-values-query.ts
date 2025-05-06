import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';
import { ScopeValue } from '@prisma/client';
import { ENDPOINTS } from '@/services/endpoints';

export const useScopeValuesQuery = (id: number) => {
  return useQuery({
    queryKey: ['scopes', id, 'values'],
    queryFn: ({ signal }: QueryFunctionContext) =>
      get<ScopeValue[]>(`${ENDPOINTS.scopes.base}/${id}/values`, { signal }),
  });
};
