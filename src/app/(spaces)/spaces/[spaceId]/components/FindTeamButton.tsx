'use client';

import { Flex, HStack, Icon, Heading } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

export const FindTeamButton = () => {
    return (
        <>
            <HStack cursor="pointer" width="full" borderRadius="md" paddingX="2" paddingY="2">
                <Flex padding="1.5" backgroundColor="#42131F" alignItems="center" borderRadius="md">
                    <Icon color="#C4031A" fontSize="xl" as={FiSearch} />
                </Flex>
                <Heading size="sm">Find team</Heading>
            </HStack>
        </>
    );
};