'use client';

import { Card, CardBody, Heading, VStack } from "@chakra-ui/react";
import { ScopeValue } from "./ScopeValue";
import { useScopeValuesQuery } from "@/services/scope/queries/use-scope-values-query";

interface ScopeValuesProps {
    id: number;
}

export const ScopeValues = ({ id }: ScopeValuesProps) => {
    const { data: values, isLoading } = useScopeValuesQuery(id);

    return !isLoading && values && values.length > 0 ? (
        <>
            <Heading variant="menu-heading">Values</Heading>
            <Card>
                <CardBody>
                    <VStack align="stretch" whiteSpace="break-spaces">
                        {values?.map(value => <ScopeValue key={value.id} name={value.name} description={value.description} />)}
                    </VStack>
                </CardBody>
            </Card>
        </>
    ) : <></>;
};