'use client';

import { HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { FiHash } from "react-icons/fi";

interface ScopeValueProps {
    name: string;
    description: string;
}

export const ScopeValue = ({ name, description }: ScopeValueProps) => (
    <HStack align="top">
        <Icon as={FiHash} color="chakra-primary-color" />
        <VStack align="stretch" gap={0}>
            <Heading size="sm" lineHeight={1}>{name}</Heading>
            <Text fontSize="sm" color="chakra-subtle-text">{description}</Text>
        </VStack>
    </HStack>
);