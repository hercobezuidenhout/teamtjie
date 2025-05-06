'use client';

import { CreateScopeForm } from "@/lib/forms/CreateScopeForm/CreateScopeForm";
import { Flex, HStack, Icon, Heading, Modal, ModalOverlay, ModalContent, useDisclosure } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

export const CreateTeamButton = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <HStack onClick={onOpen} cursor="pointer" width="full" borderRadius="md" paddingX="2" paddingY="2">
                <Flex padding="1.5" backgroundColor="chakra-primary-color-soft" alignItems="center" borderRadius="md">
                    <Icon color="chakra-primary-color" fontSize="xl" as={FiPlus} />
                </Flex>
                <Heading size="sm">Create team</Heading>
            </HStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <CreateScopeForm onCancel={onClose} type="SPACE" onSuccess={onClose} />
                </ModalContent>
            </Modal>
        </>
    );
};