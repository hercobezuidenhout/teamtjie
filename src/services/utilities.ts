import { PaginatedResponse } from '@/models/types/paginated-response';
import {
  MutationFunction,
  QueryClient,
  QueryFilters,
  QueryFunctionContext,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import produce, { Draft } from 'immer';
import * as R from 'ramda';

export const toUrlSearchParams = (item: object | undefined) => {
  return !item
    ? new URLSearchParams()
    : new URLSearchParams(
      Object.entries(item)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, value.toString()] as [string, string])
    );
};

export const containsAllElements = (queryKey: QueryKey, match: unknown[]) =>
  Array.isArray(queryKey) && R.isEmpty(R.difference(match, queryKey));

export type QueryFiltersFactory<TOptions> =
  | ((options: TOptions) => QueryFilters)
  | QueryFilters;

export type QueryOptionsOverride<T> = Omit<
  UseQueryOptions<T, AxiosError, T>,
  'queryKey' | 'queryFn'
>;

export type RecipeFactory<TOptions> = (
  options: TOptions
) => (draft: Draft<never>) => void;

type QueryData = [QueryKey, unknown][];

type MutationContext = { previousData: QueryData; };

export type RecipeCollection<TOptions> = [
  QueryFiltersFactory<TOptions>,
  RecipeFactory<TOptions> | undefined,
][];

export const updateCache = async <TData>(
  queryClient: QueryClient,
  filters: QueryFilters,
  recipe?: (draft: Draft<TData>) => void
): Promise<QueryData> => {
  const queries = queryClient.getQueriesData<TData>(filters);

  for (const [queryKey, data] of queries) {
    if (recipe) {
      const newData = produce(data, recipe);
      queryClient.setQueryData(queryKey, newData);
    }

    await queryClient.cancelQueries({ queryKey });
  }

  return queries;
};

export const buildMutationOptions = <TVariables, TData>(
  mutationFn: MutationFunction<TData, TVariables>,
  queryClient: QueryClient,
  recipes: RecipeCollection<TVariables>
): UseMutationOptions<TData, Error, TVariables, MutationContext> => {
  return {
    mutationFn,
    onMutate: async (options: TVariables) => {
      const previousData: [QueryKey, unknown][] = [];

      for (const [filtersFactory, recipeFactory] of recipes) {
        const queryFilters =
          typeof filtersFactory === 'function'
            ? filtersFactory(options)
            : filtersFactory;
        const result = await updateCache(
          queryClient,
          queryFilters,
          recipeFactory ? recipeFactory(options) : undefined
        );

        previousData.push(...result);
      }

      return { previousData };
    },
    onError: (_error, _options, context) =>
      context?.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      }),
    onSettled: async (_data, _error, _options, context) => {
      if (!context) {
        return;
      }
      for (const query of context?.previousData) {
        await queryClient.invalidateQueries({ queryKey: query[0] });
      }
    },
  };
};

export type PageParam = { skip: number; take: number; };

export const getNextPageParam = <T>({
  metadata: { skip, take, page, totalPages },
}: PaginatedResponse<T>): PageParam | undefined => {
  if (page >= totalPages) {
    return undefined;
  }
  return {
    skip: skip + take,
    take: take,
  };
};

export const initialPageParam: PageParam = { skip: 0, take: 20 };

export const getInfiniteQueryOptions = <T>(options: {
  queryKey: QueryKey;
  queryFn: (
    context: QueryFunctionContext<QueryKey, PageParam>
  ) => Promise<PaginatedResponse<T>>;
}) => ({
  ...options,
  getNextPageParam,
  initialPageParam,
});
