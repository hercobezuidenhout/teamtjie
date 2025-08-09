'use client';

import { VStackStretch } from "@/lib/layout/VStackStretch";
import { Button, Card, CardBody, CardFooter, CardHeader, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { BackToAccountButton } from "../components/BackToAccountButton/BackToAccountButton";
import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { ConfirmationModal } from "@/lib/modals/ConfirmationModal/ConfirmationModal";
import { useDeleteUserMutation } from "@/services/user/mutations/use-delete-user-mutation";
import { useRouter } from "next/navigation";

const Page = () => {
    const { auth } = useSupabaseClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { mutateAsync: deleteUser, isPending } = useDeleteUserMutation();
    const [email, setEmail] = useState<string>('');
    const toast = useToast();
    const router = useRouter();

    const [user, setUser] = useState<User>();

    const refreshUser = () => auth
        .getUser()
        .then(({ data, error }) => {
            if (error) {
                console.info(error.message);

                if (error.message === 'AuthApiError: User from sub claim in JWT does not exist') {
                    router.replace('/');
                }
            }
            setUser(data.user ?? undefined);
        });

    const handleCancel = () => {
        setEmail('');
        onClose();
    };

    const handleConfirm = async () => {
        setEmail('');
        onClose();

        if (!user) {
            toast({ title: "Something went wrong.", variant: 'error', icon: '🥲' });
            return;
        }

        await deleteUser();

        toast({
            title: 'Account Deactivated',
            description: 'Your account has successfully been deactivated.',
            variant: 'success',
            duration: 2000,
            icon: '🤘'
        });

        await auth.signOut();
        router.push('/deactivated');
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <>
            <VStackStretch gap={2}>
                <BackToAccountButton />
                <Card>
                    <CardHeader>
                        <Heading>Deactivate Account</Heading>
                        <Text mt={2}>
                            This cannot be undone. Once your account has been deactivated, all user data will be lost.
                        </Text>
                    </CardHeader>
                    <CardBody py={0}>
                        <FormControl>
                            <FormLabel>Please enter your email address to confirm</FormLabel>
                            <Input type='email' value={email} onChange={(event) => setEmail(event.target.value)} />
                            <FormHelperText>All data will be lost when deactivating account.</FormHelperText>
                        </FormControl>
                    </CardBody>
                    <CardFooter>
                        <HStack justifyContent="flex-end" width="full">
                            <Button isLoading={isPending} isDisabled={user?.email !== email} variant="primary" onClick={onOpen}>Deactivate</Button>
                        </HStack>
                    </CardFooter>
                </Card>
            </VStackStretch>
            <ConfirmationModal isOpen={isOpen} onCancel={handleCancel} onConfirm={handleConfirm} />
        </>
    );
};

export default Page;