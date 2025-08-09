'use client';

import { ScopeMembers } from "@/app/(spaces)/spaces/[spaceId]/@menu/components/ScopeMembersMenu/ScopeMembers";
import { Can } from "@/lib/casl/Can";
import { useUsersInfiniteQuery } from "@/services/user/queries/use-users-infinite-query";
import { subject } from "@casl/ability";
import { Avatar, AvatarGroup, Card, HStack, Icon, Tooltip, useDisclosure } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { FiUserPlus } from "react-icons/fi";

interface ScopeMembersCardProps {
    scope: Scope;
}

export const ScopeMembersCard = ({ scope }: ScopeMembersCardProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const {
        data: pagination,
        isLoading
    } = useUsersInfiniteQuery({
        scopeId: scope.id,
        scopeType: scope.type
    });

    const members = pagination?.pages[0].data;

    return (
        <Can I="read" this={subject('Scope', { id: scope.id })}>
            <Tooltip label='Members' borderRadius="md" backgroundColor="chakra-subtle-bg" color="chakra-subtle-text">
                <Card padding={1.5} borderRadius="full" cursor="pointer" onClick={onOpen} backgroundColor="chakra-subtle-bg" _hover={{ backgroundColor: "gray.200" }}>
                    <HStack>
                        <AvatarGroup size='xs' max={2}>
                            {isLoading ? (
                                [0, 1, 3].map(item => (
                                    <Avatar key={item} name='Ryan Florence' src='https://bit.ly/ryan-florence' />
                                ))
                            ) : (
                                members?.map(member => <Avatar key={member.id} name={member.name} src={member.image ?? undefined} />)
                            )}

                        </AvatarGroup>

                        <Icon as={FiUserPlus} ml={2} mr={1} />
                    </HStack>
                </Card>
            </Tooltip>
            <ScopeMembers scope={scope} isOpen={isOpen} onClose={onClose} />
        </Can>
    );
};