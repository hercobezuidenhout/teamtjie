'use client';

import { ScopeValueForm } from "@/lib/forms/ScopeValueForm/ScopeValueForm";
import { UpdateScopeValueDto } from "@/models";
import { useDeleteValueMutation } from "@/services/scope/mutations/use-delete-value-mutation";
import { useUpdateValueMutation } from "@/services/scope/mutations/use-update-value-mutation";
import { Button, HStack, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { ScopeValue } from "@prisma/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiTrash } from "react-icons/fi";

interface EditScopeValueModalProps {
    value: ScopeValue;
    isOpen: boolean;
    onClose: () => void;
}

export const EditScopeValueModal = ({ isOpen, onClose, value }: EditScopeValueModalProps) => {
    const { handleSubmit, reset, ...rest } = useForm<UpdateScopeValueDto>({
        values: { ...value }
    });

    const { mutateAsync: updateValue, isPending } = useUpdateValueMutation(value.scopeId);
    const { mutateAsync: deleteValue, isPending: isPendingDelete } = useDeleteValueMutation(value.scopeId);

    const toast = useToast();

    const onSubmit = async (payload: UpdateScopeValueDto) => {
        await updateValue({ id: value.id, ...payload });

        toast({
            title: 'Value Updated',
            description: 'The value has been updated',
            variant: 'success',
            duration: 2000,
            icon: '🤘'
        });

        onClose();
    };

    const removeValue = async () => {
        await deleteValue(value.id);

        onClose();

        toast({
            title: 'Value Removed',
            description: 'The value has been removed',
            variant: 'success',
            duration: 2000,
            icon: '🤘'
        });
    };

    useEffect(() => {
        return () => {
            reset();
        };
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }}>
            <ModalOverlay />
            <ModalContent backgroundColor="chakra-card-bg">
                <ModalHeader>Edit Value</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ScopeValueForm {...rest} />
                </ModalBody>
                <ModalFooter justifyContent="space-between">
                    <Button isLoading={isPendingDelete} isDisabled={isPendingDelete || isPending} onClick={removeValue} leftIcon={<Icon as={FiTrash} />} variant="ghost">Remove</Button>
                    <HStack>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button isLoading={isPending} isDisabled={isPending || isPendingDelete} variant='primary' onClick={handleSubmit(onSubmit)}>Update</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};