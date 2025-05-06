import {
  QueryFunctionContext,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  getInfiniteQueryOptions,
  PageParam,
  toUrlSearchParams,
} from '@/services/utilities';
import { get } from '@/services/network';
import { PaginatedResponse } from '@/models/types/paginated-response';
import { GetChildScopeDto } from '@/prisma';
import { ENDPOINTS } from '@/services/endpoints';

export const useScopeChildrenQuery = (id: number, filter?: string) => {
  return useInfiniteQuery(
    getInfiniteQueryOptions({
      queryKey: ['scopes', id, 'children', filter],
      queryFn: ({
        pageParam,
        signal,
      }: QueryFunctionContext<QueryKey, PageParam>) => {
        const queryParams = toUrlSearchParams({ filter, ...pageParam });
        return get<PaginatedResponse<GetChildScopeDto>>(
          `${ENDPOINTS.scopes.base}/${id}/children?${queryParams}`,
          { signal }
        );
      },
    })
  );
};
