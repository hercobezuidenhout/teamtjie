'use client';

import { InfiniteList } from "@/lib/lists/InfiniteList";
import { useUsersInfiniteQuery } from "@/services/user/queries/use-users-infinite-query";
import { flattenPagination } from "@/utils/flatten-pagination";
import { InputGroup, InputLeftElement, Icon, Input, VStack, Skeleton } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDebounce } from "use-debounce";
import { MemberListItem } from "./MemberListItem";

interface MembersListProps {
    scope: Scope;
}

export const MembersList = ({ scope }: MembersListProps) => {
    const [filter, setFilter] = useState<string>();
    const [debouncedFilter] = useDebounce(filter, 200);
    const { data: pagination, isLoading: isLoadingMembers, fetchNextPage, } = useUsersInfiniteQuery({
        filter: debouncedFilter,
        scopeId: scope.id,
        scopeType: scope.type
    });

    const { data, count } = flattenPagination(pagination);

    return (
        <VStack>
            <InputGroup mb={5}>
                <InputLeftElement pointerEvents='none'>
                    <Icon as={FiSearch} />
                </InputLeftElement>
                <Input type='text' placeholder='Search members' value={filter} onChange={event => setFilter(event.target.value)} />
            </InputGroup>
            <VStack alignItems="stretch" gap={3} w="full" maxH="lg" overflow="scroll" __css={{
                '::-webkit-scrollbar-corner': {
                    background: 'rgba(0,0,0,0)'
                }
            }}>
                <InfiniteList
                    count={count}
                    data={data}
                    spacing={5}
                    isLoading={isLoadingMembers}
                    onNextPage={fetchNextPage}
                    itemTemplate={(member, _) => <MemberListItem member={member} scope={scope} />}
                    skeletonTemplate={() => <Skeleton />}
                />
            </VStack>
        </VStack>
    );
};;