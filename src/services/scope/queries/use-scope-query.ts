import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { get } from '@/services/network';
import { GetScopeProfileDto } from '@/prisma';
import { ENDPOINTS } from '@/services/endpoints';

export const useScopeQuery = (id: number) => {
  return useQuery({
    queryKey: ['scopes', id],
    queryFn: ({ signal }: QueryFunctionContext) =>
      get<GetScopeProfileDto>(`${ENDPOINTS.scopes.base}/${id}`, {
        signal,
      }),
  });
};
