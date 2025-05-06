'use client';

import { ScopeValueForm } from "@/lib/forms/ScopeValueForm/ScopeValueForm";
import { CreateScopeValueDto } from "@/models";
import { useCreateValueMutation } from "@/services/scope/mutations/use-create-value-mutation";
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface AddScopeValueModalProps {
    isOpen: boolean;
    onClose: () => void;
    id: number;
}

export const AddScopeValueModal = ({ isOpen, onClose, id }: AddScopeValueModalProps) => {
    const { handleSubmit, reset, ...rest } = useForm<CreateScopeValueDto>();
    const { mutateAsync: addValue, isPending } = useCreateValueMutation(id);
    const toast = useToast();

    const onSubmit = async (payload: CreateScopeValueDto) => {
        await addValue(payload);

        toast({
            title: 'Value Added',
            description: 'A new value has been added to your team charter',
            variant: 'success',
            duration: 2000,
            icon: '🤘'
        });

        reset();

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }}>
            <ModalOverlay />
            <ModalContent backgroundColor="chakra-card-bg">
                <ModalHeader>Add Value</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ScopeValueForm {...rest} />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button isLoading={isPending} isDisabled={isPending} variant='primary' onClick={handleSubmit(onSubmit)}>Add</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};