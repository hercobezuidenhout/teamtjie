'use client';

import { Heading, VStack } from "@chakra-ui/react";
import { TeamListLink } from "./TeamListLink";
import { Scope } from "@prisma/client";
import { CreateTeamButton } from "./CreateTeamButton";
import { subject } from "@casl/ability";
import { Can } from "@/lib/casl/Can";
import { useScopesQuery } from "@/services/scope/queries/use-scopes-query";

interface TeamListProps {
    scope: Scope;
}

export const TeamList = ({ scope }: TeamListProps) => {
    const { data } = useScopesQuery();

    return (
        <VStack align="stretch">
            <Heading variant="menu-heading">Teams</Heading>

            {data?.filter(team => !team.parentScopeId).map(team => (
                <TeamListLink key={team.id} href={`/spaces/${team.id}`} {...team} image={team.image ? team.image : undefined} />
            ))}

            <Can I="read" this={subject('Scope', { id: scope.id })}>
                <CreateTeamButton />
            </Can>
        </VStack >
    );
};