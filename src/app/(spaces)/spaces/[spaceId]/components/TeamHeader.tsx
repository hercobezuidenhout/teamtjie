'use client';

import { ScopeMembersCard } from "@/lib/cards/ScopeMembersCard/ScopeMembersCard";
import { Avatar, HStack, Heading } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { TeamCharterButton } from "./TeamCharterButton";
import { TeamSettingsButton } from "./TeamSettingsButton";
import { TeamInsightsButton } from "./TeamInsightsButton";

interface TeamHeaderProps {
    scope: Scope;
}

export const TeamHeader = ({ scope }: TeamHeaderProps) => (
    <HStack width="full" justifyContent="space-between">
        <HStack spacing={5}>
            <Avatar size="md" name={scope.name} src={scope.image ?? undefined} />
            <Heading size="lg">{scope.name}</Heading>
        </HStack>
        <HStack>
            <ScopeMembersCard scope={scope} />
            <TeamCharterButton scope={scope} />
            <TeamInsightsButton scope={scope} />
            <TeamSettingsButton scope={scope} />
        </HStack>
    </HStack>
);