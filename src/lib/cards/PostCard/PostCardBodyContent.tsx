import { UserAvatar } from '@/lib/tags/UserAvatar/UserAvatar';
import { AvatarStub } from '@/models';
import { HStack, Heading, VStack, Text, Box } from '@chakra-ui/react';
import { PostType } from '@prisma/client';

export interface PostCardBodyContentProps {
  issuedTo: AvatarStub<string>;
  title: string;
  description: string;
  type: PostType;
}

export const PostCardBodyContent = ({
  issuedTo,
  title,
  description,
  type
}: PostCardBodyContentProps) => {
  const generateLabel = () => {
    switch (type) {
      case 'FINE':
        return '🚨';
      case 'WIN':
        return '🎉';
      case 'PAYMENT':
        return '💰';
      default:
        break;
    }
  };
  return (
    <HStack mt={3} mb={3} gap={4}>
      <Box position="relative">
        <UserAvatar {...issuedTo} hideLabel={true} size="xl" />
        <Text position="absolute" bottom="-1" right="-1">{generateLabel()}</Text>
      </Box>
      <VStack align="stretch" gap={0}>
        <HStack>
          <Heading>
            {issuedTo.name}
          </Heading>
          <Text>{title}</Text>
        </HStack>
        <Text fontSize="lg">{description}</Text>
      </VStack>
    </HStack>
  );
};
