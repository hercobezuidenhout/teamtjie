'use client';

import { Button, Heading, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export const ConfirmationModal = ({ isOpen, onCancel, onConfirm }: ConfirmationModalProps) => (
    <Modal isOpen={isOpen} onClose={onCancel} size={{ base: 'full', md: 'sm' }}>
        <ModalOverlay />
        <ModalContent backgroundColor="chakra-card-bg">
            <ModalHeader>
                <Heading>Confirm</Heading>
            </ModalHeader>
            <ModalBody minH="fit-content">
                <Text>Are you sure you want to continue?</Text>
            </ModalBody>
            <ModalFooter gap={3}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm} variant="primary">Confirm</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);
