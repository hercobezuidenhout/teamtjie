'use client';

import { VStackStretch } from "@/lib/layout/VStackStretch";
import { UpdateUserDto } from "@/models";
import { useUpdateUserMutation } from "@/services/user/mutations/use-update-user-mutation";
import { Button, Card, CardBody, CardFooter, CardHeader, FormControl, FormLabel, HStack, Heading, Input, Textarea, useToast } from "@chakra-ui/react";
import { User } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";

interface ProfileSettings {
    user: User;
}

export const EditProfileSettings = ({ user }: ProfileSettings) => {
    const { mutateAsync, isPending } = useUpdateUserMutation();
    const toast = useToast();
    const { register, handleSubmit } = useForm<UpdateUserDto>({
        values: { ...user }
    });

    const onSubmit: SubmitHandler<UpdateUserDto> = async (data) => {
        await mutateAsync(data);

        toast({
            title: 'Profile updated',
            description: 'Your details have been successfully updated.',
            variant: 'success',
            duration: 2000,
            icon: '🤘'
        });
    };

    return (
        <Card>
            <CardHeader>
                <Heading>Edit Profile</Heading>
            </CardHeader>
            <CardBody pt={0} pb={0}>
                <VStackStretch>
                    <FormControl>
                        <FormLabel>Full Name</FormLabel>
                        <Input type='text' {...register("name")} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Textarea resize="none" {...register("aboutMe")} />
                    </FormControl>
                </VStackStretch>
            </CardBody>
            <CardFooter>
                <HStack justifyContent="flex-end" width="full">
                    <Button onClick={handleSubmit(onSubmit)} isLoading={isPending} isDisabled={isPending} variant="primary">Save</Button>
                </HStack>
            </CardFooter>
        </Card>
    );
};