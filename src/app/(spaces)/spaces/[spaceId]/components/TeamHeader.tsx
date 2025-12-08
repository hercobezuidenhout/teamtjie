'use client';

import { ScopeMembersCard } from "@/lib/cards/ScopeMembersCard/ScopeMembersCard";
import { Avatar, HStack, Heading } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { TeamCharterButton } from "./TeamCharterButton";
import { TeamSettingsButton } from "./TeamSettingsButton";

interface TeamHeaderProps {
    scope: Scope;
}

export const TeamHeader = ({ scope }: TeamHeaderProps) => (
    <HStack width="full" justifyContent="space-between">
        <HStack spacing={{ base: 2, md: 4 }}>
            <Avatar size={{ base: "sm", md: "md" }} name={scope.name} src={scope.image ?? undefined} />
            <Heading size={{ base: 'md', md: 'lg' }}>{scope.name}</Heading>
        </HStack>
        <HStack>
            <ScopeMembersCard scope={scope} />
            <TeamCharterButton scope={scope} />
            <TeamSettingsButton scope={scope} />
        </HStack>
    </HStack>
);