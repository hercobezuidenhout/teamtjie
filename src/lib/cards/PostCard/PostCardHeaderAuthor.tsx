import { AvatarStub } from '@/models';
import { Text } from '@chakra-ui/react';

export interface PostCardHeaderAuthorProps {
  issuedBy: AvatarStub<string>;
}

export const PostCardHeaderAuthor = ({
  issuedBy,
}: PostCardHeaderAuthorProps) => {
  return (
    <Text>
      {issuedBy.name}
    </Text>
  );
};
