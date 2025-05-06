import { ScopeType } from '@/models';
import { User } from '@prisma/client';
import { Dispatch, SetStateAction, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useUserSearchQuery } from '@/services/user/queries/use-users-search-query';

type UserSearchValue = [
  string | undefined,
  Dispatch<SetStateAction<string | undefined>>,
  { userOptions: User[]; isLoading: boolean; },
];

export const useUserSearch = (
  scopeType: ScopeType,
  scopeId: number
): UserSearchValue => {
  const [searchText, setSearchText] = useState<string>();
  const [debouncedSearchText] = useDebounce(searchText, 200);
  const { data: userOptions = [], isLoading } = useUserSearchQuery(
    scopeType,
    scopeId,
    debouncedSearchText
  );

  return [searchText, setSearchText, { userOptions, isLoading }];
};
