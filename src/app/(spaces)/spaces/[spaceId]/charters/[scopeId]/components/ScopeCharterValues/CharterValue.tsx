import { useAbilities } from "@/contexts/AbilityContextProvider";
import { EditScopeValueModal } from "@/lib/modals/EditScopeValueModal/EditScopeValueModal";
import { subject } from "@casl/ability";
import { Flex, HStack, Heading, Icon, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { ScopeValue } from "@prisma/client";
import { FiHash } from "react-icons/fi";

interface CharterValueProps {
    value: ScopeValue;
}

export const CharterValue = ({ value }: CharterValueProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const abilities = useAbilities();

    const handleValueClick = () => {
        if (abilities.can('edit', subject('Scope', { id: value.scopeId }))) {
            onOpen();
        }
    };

    return (
        <>
            <HStack onClick={handleValueClick} gap={5} py={3} borderRadius="md" transition="0.3s" alignItems="top" cursor="pointer" _hover={{
                backgroundColor: "chakra-primary-color-soft"
            }}>
                <Flex backgroundColor="chakra-primary-color-soft" padding="3" borderRadius="md" height="fit-content">
                    <Icon color="chakra-primary-color" as={FiHash} />
                </Flex>
                <VStack alignItems="stretch">
                    <HStack>
                        <Heading size="sm">{value.name}</Heading>
                    </HStack>
                    <Flex>
                        <Text>{value.description}</Text>
                    </Flex>
                </VStack>
            </HStack>
            <EditScopeValueModal value={value} isOpen={isOpen} onClose={onClose} />
        </>
    );
};