import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';
import { User } from '@prisma/client';

export const UserTemplate = (item: User) => {
  return (
    <HStack spacing={1}>
      <Avatar name={item.name} src={item.image ?? undefined} size="xs" mr={1} />
      <VStack spacing={0} alignItems="stretch">
        <Text fontSize="sm">{item.name}</Text>
        <Text fontSize="xs" color="gray.500">
          {item.email}
        </Text>
      </VStack>
    </HStack>
  );
};
