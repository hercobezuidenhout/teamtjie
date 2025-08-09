import { PaginatedResponse } from '../models/types/paginated-response';

export const getEmptyPaginatedResponse = <T>(): PaginatedResponse<T> => ({
  data: [],
  metadata: {
    skip: 0,
    take: 0,
    page: 0,
    pageSize: 0,
    totalCount: 0,
    totalPages: 0,
  },
});
