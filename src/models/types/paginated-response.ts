export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    skip: number;
    take: number;
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}
