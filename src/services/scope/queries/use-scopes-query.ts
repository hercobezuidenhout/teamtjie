import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { get } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { GetScopeIncludingValuesDto } from '@/prisma';

export const useScopesQuery = (): UseQueryResult<GetScopeIncludingValuesDto[]> => {
  return useQuery({
    queryKey: ['scopes'],
    queryFn: ({ signal }: QueryFunctionContext) =>
      get<GetScopeIncludingValuesDto>(`${ENDPOINTS.scopes.base}`, {
        signal,
      }),
  });
};
