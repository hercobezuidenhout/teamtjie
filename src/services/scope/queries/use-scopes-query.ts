import { GetScopeValueDto } from '@/prisma';
import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { get } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';

export const useScopesQuery = (): UseQueryResult<GetScopeValueDto[]> => {
  return useQuery({
    queryKey: ['scopes'],
    queryFn: ({ signal }: QueryFunctionContext) =>
      get<GetScopeValueDto>(`${ENDPOINTS.scopes.base}`, {
        signal,
      }),
  });
};
