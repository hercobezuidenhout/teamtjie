'use client';

import { Button, Card, CardBody, CardHeader, HStack, Heading, Icon, VStack, useDisclosure } from "@chakra-ui/react";
import { CharterValue } from "./CharterValue";
import { FiPlus } from "react-icons/fi";
import { useScopeValuesQuery } from "@/services/scope/queries/use-scope-values-query";
import { AddScopeValueModal } from "@/lib/modals/AddScopeValueModal/AddScopeValueModal";
import { Can } from "@/lib/casl/Can";
import { subject } from "@casl/ability";

interface ScopeCharterValuesProps {
    id: number;
}

export const ScopeCharterValues = ({ id }: ScopeCharterValuesProps) => {
    const { data: values } = useScopeValuesQuery(id);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Card>
                <CardHeader>
                    <HStack justifyContent="space-between">
                        <Heading>Values</Heading>
                        <Can I="edit" this={subject('Scope', { id: id })}>
                            <Button onClick={onOpen} leftIcon={<Icon as={FiPlus} />} size="xs">Add Value</Button>
                        </Can>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <VStack alignItems="stretch" gap={5}>
                        {values?.map(value => <CharterValue key={value.id} value={value} />)}
                    </VStack>
                </CardBody>
            </Card>
            <AddScopeValueModal id={id} isOpen={isOpen} onClose={onClose} />
        </>
    );
};