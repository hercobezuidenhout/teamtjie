'use client';

import { GetFeedDto } from "@/prisma/queries/get-feed";
import { useFeedQuery } from "@/services/feed/queries/use-feed-query";
import { flattenPagination } from "@/utils/flatten-pagination";
import { PostCard } from "../../../../../lib/cards/PostCard/PostCard";
import { useCurrentUser } from "@/contexts/CurrentUserProvider";
import { InfiniteList } from "@/lib/lists/InfiniteList";
import { Skeleton, useBreakpointValue } from "@chakra-ui/react";
import { Can } from "@/lib/casl/Can";
import { subject } from "@casl/ability";

interface FeedProps {
    scopeId: number;
    filterId?: number;
}

export const Feed = ({ scopeId, filterId }: FeedProps) => {
    const { user } = useCurrentUser();
    const isSmallScreen = !!useBreakpointValue({ base: true, md: false });
    const {
        data: pagination,
        fetchNextPage,
        isLoading,
    } = useFeedQuery(scopeId, filterId);

    const { data, count } = flattenPagination<GetFeedDto>(pagination);

    const handleNextPage = () => fetchNextPage();
    const SkeletonTemplate = (index: number) => <Skeleton key={index} width="full" height="15" />;

    return (
        <InfiniteList
            spacing={5}
            data={data}
            count={count}
            itemTemplate={(post) => (
                <Can I="read" this={subject('Post', { scopeId: post.scopeId, type: post.type })}>
                    <PostCard
                        {...post}
                        scopeId={post.scopeId}
                        postType={post.type}
                        spaceName={post.space.name}
                        teamName={post.team?.name}
                        date={post.createdAt}
                        currentUser={user!}
                        isSmall={isSmallScreen}
                    />
                </Can>
            )}
            onNextPage={handleNextPage}
            isLoading={isLoading}
            skeletonTemplate={SkeletonTemplate}
        />
    );
};