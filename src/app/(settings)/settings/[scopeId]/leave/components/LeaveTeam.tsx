'use client';

import { ConfirmationModal } from "@/lib/modals/ConfirmationModal/ConfirmationModal";
import { useLeaveScopeMutation } from "@/services/scope/mutations/use-leave-scope-mutation";
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface LeaveTeamProps {
    scopeId: number;
}

export const LeaveTeam = ({ scopeId }: LeaveTeamProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { mutateAsync: leaveTeam, isPending } = useLeaveScopeMutation(scopeId);
    const router = useRouter();

    const handleConfirm = async () => {
        await leaveTeam();
        router.push('/');
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <Heading>Leave Team</Heading>
                </CardHeader>
                <CardBody pt={0}>
                    <Text>Are you sure you want to leave the team? This cannot be undone and all of your data will be removed from the team.</Text>
                </CardBody>
                <CardFooter>
                    <HStack justifyContent="flex-end" width="full">
                        <Button isLoading={isPending} isDisabled={isPending} variant="primary" onClick={onOpen}>Continue</Button>
                    </HStack>
                </CardFooter>
            </Card>
            <ConfirmationModal isOpen={isOpen} onCancel={onClose} onConfirm={handleConfirm} />
        </>
    );
};