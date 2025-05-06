import {
    QueryFunctionContext,
    QueryKey,
    useInfiniteQuery,
} from '@tanstack/react-query';

import { get } from '@/services/network';
import { ENDPOINTS } from '@/services/endpoints';
import { GetFeedDto } from '@/prisma/queries/get-feed';
import { PageParam, getInfiniteQueryOptions, toUrlSearchParams } from '../../utilities';
import { PaginatedResponse } from '@/models/types/paginated-response';

export const useFeedQuery = (
    scopeId: number,
    filterId?: number
) => {
    const url = filterId
        ? `${ENDPOINTS.feed.base}?scopeId=${scopeId}&filterId=${filterId}`
        : `${ENDPOINTS.feed.base}?scopeId=${scopeId}`;
    const infiniteQueryOptions = getInfiniteQueryOptions({
        queryKey: ['feed', scopeId, filterId],
        queryFn: ({
            pageParam,
            signal,
        }: QueryFunctionContext<QueryKey, PageParam>) => {
            const queryParams = toUrlSearchParams(pageParam);
            return get<PaginatedResponse<GetFeedDto>>(
                `${url}&${queryParams}`,
                { signal }
            );
        },
    });

    return useInfiniteQuery(infiniteQueryOptions);
};
