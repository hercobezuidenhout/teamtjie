import { Avatar, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { User } from "@prisma/client";

export const UserSelectedTemplate = (user: User) => (
    <HStack>
        <Avatar src={user.image ?? undefined} name={user.name} size="sm" />
        <VStack alignItems="stretch" gap={0}>
            <Heading size="sm">{user.name}</Heading>
            <Text color="chakra-subtle-text" fontSize="xs">{user.email}</Text>
        </VStack>
    </HStack>
);