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
import { Scope } from '@/models';
import { ENDPOINTS } from '@/services/endpoints';
import { GetUserListDto } from '@/prisma/queries/get-users';

interface GetUsersOptions extends Scope {
  filter?: string;
}

export const useUsersInfiniteQuery = (options: GetUsersOptions) => {
  return useInfiniteQuery(
    getInfiniteQueryOptions({
      queryKey: ['users', options.scopeType, options.scopeId, options.filter],
      queryFn: ({
        pageParam,
        signal,
      }: QueryFunctionContext<QueryKey, PageParam>) => {
        const queryParams = toUrlSearchParams({ ...options, ...pageParam });
        return get<PaginatedResponse<GetUserListDto>>(
          `${ENDPOINTS.user.base}?${queryParams}`,
          {
            signal,
          }
        );
      },
    })
  );
};
