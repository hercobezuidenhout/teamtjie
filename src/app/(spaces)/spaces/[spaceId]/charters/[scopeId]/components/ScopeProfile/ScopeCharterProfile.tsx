'use client';

import { Box, Card, CardBody, HStack, Heading, VStack } from "@chakra-ui/react";
import { ScopeLogo } from "./ScopeLogo";
import { EditScopeProfileButton } from "./EditScopeProfileButton";
import { useScopeQuery } from "@/services/scope/queries/use-scope-query";
import { Can } from "@/lib/casl/Can";
import { subject } from "@casl/ability";

interface ScopeCharterProfileProps {
    id: number;
}

export const ScopeCharterProfile = ({ id }: ScopeCharterProfileProps) => {
    const { data: scope } = useScopeQuery(id);

    return scope && (
        <Card>
            <CardBody>
                <HStack justifyContent="space-between">
                    <HStack gap={4}>
                        <Box>
                            <ScopeLogo scope={scope} />
                        </Box>
                        <VStack alignItems="stretch" gap={0}>
                            <Heading>{scope.name}</Heading>
                        </VStack>
                    </HStack>
                    <Can I="edit" this={subject('Scope', { id: scope.id })}>
                        <EditScopeProfileButton scope={scope} />
                    </Can>
                </HStack>
            </CardBody>
        </Card>
    );
};