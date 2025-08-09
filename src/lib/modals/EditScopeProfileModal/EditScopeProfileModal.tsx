'use client';

import { EditScopeProfileForm } from "@/lib/forms/EditScopeProfileForm/EditScopeProfileForm";
import { UpdateScopeDto } from "@/models";
import { useUpdateScopeMutation } from "@/services/scope/mutations/use-update-scope-mutation";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, ModalProps, useToast } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useForm } from "react-hook-form";

interface EditScopeProfileModalProps extends Pick<ModalProps, 'isOpen'> {
    onClose: () => void;
    scope: Scope;
}

export const EditScopeProfileModal = ({ isOpen, onClose, scope }: EditScopeProfileModalProps) => {
    const { mutateAsync: updateScope, isPending } = useUpdateScopeMutation();
    const toast = useToast();
    const { handleSubmit, ...rest } = useForm<UpdateScopeDto>({
        values: {
            name: scope.name,
            description: scope.description ?? ''
        }
    });

    const onSubmit = async (payload: UpdateScopeDto) => {
        await updateScope({
            id: scope.id,
            name: payload.name,
            description: payload.description
        });

        toast({
            title: 'Team updated',
            description: 'Your team has been successfully updated.',
            variant: 'success',
            duration: 2000,
            icon: '🤘'
        });

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'lg' }}>
            <ModalOverlay />
            <ModalContent backgroundColor="chakra-card-bg">
                <ModalHeader>Edit Charter</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <EditScopeProfileForm {...rest} />
                </ModalBody>

                <ModalFooter>
                    <Button mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='primary' isLoading={isPending} isDisabled={isPending} onClick={handleSubmit(onSubmit)}>Update</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};