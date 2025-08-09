'use client';

import { ConfirmationModal } from "@/lib/modals/ConfirmationModal/ConfirmationModal";
import { useDeleteScopeMutation } from "@/services/scope/mutations/use-delete-scope-mutation";
import { Card, CardHeader, Heading, CardBody, FormControl, FormLabel, Input, FormHelperText, Text, CardFooter, HStack, Button, useDisclosure, useToast } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteTeamProps {
    scope: Scope;
}

export const DeleteTeam = ({ scope }: DeleteTeamProps) => {
    const { mutateAsync: deleteScope, isPending } = useDeleteScopeMutation(scope.id);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [teamName, setTeamName] = useState('');
    const toast = useToast();
    const router = useRouter();

    const handleCancel = () => {
        setTeamName('');
        onClose();
    };

    const handleConfirm = async () => {
        setTeamName('');
        onClose();

        await deleteScope();

        toast({
            title: 'Team Deleted',
            description: `${scope.name} has successfully been deleted.`,
            variant: 'success',
            duration: 2000,
            icon: '🤘'
        });

        localStorage.clear();
        router.push('/');
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <Heading>Delete team</Heading>
                    <Text mt={2}>
                        This cannot be undone. Once the team has been deleted, all team and user data will be lost.
                    </Text>
                </CardHeader>
                <CardBody pt={0}>
                    <FormControl>
                        <FormLabel>Please enter the team&apos;s name to confirm</FormLabel>
                        <Input type='email' value={teamName} onChange={(event) => setTeamName(event.target.value)} />
                        <FormHelperText>All data will be lost when deleting team.</FormHelperText>
                    </FormControl>
                </CardBody>
                <CardFooter>
                    <HStack justifyContent="flex-end" width="full">
                        <Button isLoading={isPending} isDisabled={isPending || scope.name !== teamName} variant="primary" onClick={onOpen}>Deactivate</Button>
                    </HStack>
                </CardFooter>
            </Card>
            <ConfirmationModal isOpen={isOpen} onCancel={handleCancel} onConfirm={handleConfirm} />
        </>
    );
};