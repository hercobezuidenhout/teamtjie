'use client';

import { useScopeQuery } from "@/services/scope/queries/use-scope-query";
import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";

interface ScopeCharterMissionProps {
    id: number;
}

export const ScopeCharterMission = ({ id }: ScopeCharterMissionProps) => {
    const { data: scope } = useScopeQuery(id);

    return scope && (
        <Card>
            <CardHeader>
                <Heading>Mission</Heading>
            </CardHeader>
            <CardBody pt={0}>
                <Heading whiteSpace="break-spaces" size="sm">{scope.description}</Heading>
            </CardBody>
        </Card>
    );
};