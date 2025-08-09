'use client';

import { VStackStretch } from "@/lib/layout/VStackStretch";
import { Button, Card, CardBody, CardFooter, CardHeader, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, useDisclosure, useToast } from "@chakra-ui/react";
import { BackToAccountButton } from "../components/BackToAccountButton/BackToAccountButton";
import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { VerifyOtpModal } from "@/lib/modals/VerifyOtpModal/VerifyOtpModal";
import { useUpdateUserEmailMutation } from "@/services/user/mutations/use-update-user-email-mutation";
import { UpdateUserEmailDto } from "@/models/dtos/user/update-user-email-dto";

const Page = () => {
    const { auth } = useSupabaseClient();
    const { mutateAsync: updateUser } = useUpdateUserEmailMutation();

    const [user, setUser] = useState<User>();
    const [email, setEmail] = useState<string>('');
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleUpdate = async () => {
        const response = await auth.updateUser({ email: email });

        console.info("updateUser", response);

        if (response.error) {
            console.error(response.error.message);

            toast({ title: response.error.message, variant: 'error', icon: '🥲' });
        } else {
            onOpen();
        }
    };

    const handleClose = async (verified?: boolean, error?: string) => {
        if (error) {
            toast({ title: error, variant: 'error', icon: '🥲' });
            return;
        }

        if (verified) {
            const updateUserPayload: UpdateUserEmailDto = {
                email: email
            };

            await updateUser(updateUserPayload);

            toast({
                title: 'Email Changed',
                description: 'Your email has successfully been updated.',
                variant: 'success',
                duration: 2000,
                icon: '🤘'
            });
        }

        onClose();
    };

    useEffect(() => {
        auth
            .getUser()
            .then(({ data }) => {
                setEmail(data.user?.email ?? '');
                setUser(data.user ?? undefined);
            });
    }, []);

    return (
        <>
            <VStackStretch gap={2}>
                <BackToAccountButton />
                <Card>
                    <CardHeader>
                        <Heading>Change Email</Heading>
                    </CardHeader>
                    <CardBody py={0}>
                        <FormControl>
                            <FormLabel>Email address</FormLabel>
                            <Input type='email' value={email} onChange={(event) => setEmail(event.target.value)} />
                            <FormHelperText>An OTP will be sent to the new email.</FormHelperText>
                        </FormControl>
                    </CardBody>
                    <CardFooter>
                        <HStack justifyContent="flex-end" width="full">
                            <Button isDisabled={user?.email == email} isLoading={isOpen} onClick={handleUpdate} variant="primary">Update</Button>
                        </HStack>
                    </CardFooter>
                </Card>
            </VStackStretch>
            <VerifyOtpModal isOpen={isOpen} onClose={handleClose} email={email} />
        </>
    );
};

export default Page;