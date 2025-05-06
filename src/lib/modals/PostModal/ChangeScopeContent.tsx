'use client';

import { useAbilities } from "@/contexts/AbilityContextProvider";
import { useScopes } from "@/contexts/ScopeProvider";
import { GetScopeValueDto } from "@/prisma";
import { AnyAbility, subject } from "@casl/ability";
import { Avatar, HStack, Heading, Input, ModalBody, ModalHeader, VStack } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useMemo, useState } from "react";

interface ChangeScopeContentProps {
    selectedScope: Scope;
    onScopeChange: (newScope: Scope | undefined) => void;
}

const flattenScopes = (
    scopes: GetScopeValueDto[],
    currentSpaceId: number,
    abilities: AnyAbility
): GetScopeValueDto[] => {
    const space = scopes.find((scope) => scope.id === currentSpaceId);

    if (!space) {
        return [];
    }

    const filteredScopes = scopes.filter(
        (scope) => scope.parentScopeId === currentSpaceId
    );

    if (abilities.can('read', subject('Scope', { id: currentSpaceId }))) {
        return [space, ...filteredScopes];
    } else {
        return filteredScopes;
    }
};

export const ChangeScopeContent = ({ onScopeChange }: ChangeScopeContentProps) => {
    const [filter, setFilter] = useState('');

    const abilities = useAbilities();
    const { scopes, current } = useScopes();

    const userScopes: GetScopeValueDto[] = useMemo(
        () => flattenScopes(scopes, current.space.id, abilities),
        [scopes, current, abilities]
    );

    return (
        <>
            <ModalHeader>Select your team</ModalHeader>
            <ModalBody>
                <VStack alignItems="stretch" width="full" gap={5}>
                    <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search for your team" borderColor="chakra-subtle-bg" _placeholder={{
                        fontWeight: "bold",
                        color: "#C8C8C8"
                    }} backgroundColor="chakra-body-bg" borderRadius="lg" />
                    <VStack alignItems="stretch" width="full" gap={2}>
                        {userScopes.filter(item => item.name.includes(filter)).map(scope => (
                            <HStack onClick={() => onScopeChange(scope)} key={scope.id} cursor="pointer" _hover={{
                                backgroundColor: 'chakra-subtle-bg'
                            }} borderRadius="lg" paddingX={2} paddingY={3}>
                                <Avatar size="sm" name={scope.name} src={scope.image ?? undefined} />
                                <Heading size="sm">{scope.name}</Heading>
                            </HStack>
                        ))}
                    </VStack>
                </VStack>
            </ModalBody>
        </>
    );
};