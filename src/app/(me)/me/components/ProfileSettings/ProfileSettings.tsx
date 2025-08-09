'use client';

import { Box, Card, CardBody, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { EditProfileButton } from "./EditProfileButton";
import { ProfileAvatar } from "./ProfileAvatar";
import { useCurrentUserQuery } from "@/services/user/queries/use-current-user-query";
import { notFound } from "next/navigation";

export const ProfileSettings = () => {
    const { data: user, isLoading } = useCurrentUserQuery();

    if (!isLoading && !user) {
        notFound();
    }

    return user && (
        <Card>
            <CardBody>
                <HStack justifyContent="space-between">
                    <HStack gap={4}>
                        <Box>
                            <ProfileAvatar user={user} />
                        </Box>
                        <VStack alignItems="stretch" gap={0}>
                            <Heading>{user.name}</Heading>
                            <Text fontSize="14px" color="chakra-subtle-text">{user.aboutMe || "<insert about section here 😉>"}</Text>
                        </VStack>
                    </HStack>
                    <EditProfileButton />
                </HStack>
            </CardBody>
        </Card>
    );
};