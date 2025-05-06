import { ScopeType } from '@/models';
import { flattenPagination } from '@/utils/flatten-pagination';
import { useMemo } from 'react';
import { useUsersInfiniteQuery } from './use-users-infinite-query';

//TODO: Replace with useUsersInfiniteQuery
export const useUserSearchQuery = (
  scopeType: ScopeType,
  scopeId: number,
  filter?: string
) => {
  const { data: pagination, isLoading } = useUsersInfiniteQuery({
    scopeType,
    scopeId,
    filter,
  });
  const { data, count } = useMemo(
    () => flattenPagination(pagination),
    [pagination]
  );

  return { data, count, isLoading };
};
