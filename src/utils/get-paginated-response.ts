import { PaginatedResponse } from '../models/types/paginated-response';

export const getPaginatedResponse = <T>(
  data: T[],
  skip: number,
  take: number,
  count: number
): PaginatedResponse<T> => ({
  data,
  metadata: {
    skip,
    take,
    page: Math.floor(skip / take) + 1,
    pageSize: take,
    totalPages: Math.ceil(count / take),
    totalCount: count,
  },
});
