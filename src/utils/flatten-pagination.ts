import { InfiniteData } from '@tanstack/react-query';
import { PaginatedResponse } from '../models/types/paginated-response';

export const flattenPagination = <T>(
  pagination: InfiniteData<PaginatedResponse<T>> | undefined
) => {
  const data = pagination?.pages.flatMap((page) => page.data).flat() ?? [];
  const count = pagination?.pages[0].metadata.totalCount ?? 0;

  return { data, count };
};
