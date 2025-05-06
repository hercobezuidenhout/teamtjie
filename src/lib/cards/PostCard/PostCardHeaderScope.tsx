import { Text } from '@chakra-ui/react';

export interface PostCardHeaderScopeProps {
  spaceName: string;
  teamName?: string;
}

export const PostCardHeaderScope = ({
  spaceName,
  teamName,
}: PostCardHeaderScopeProps) =>
  teamName
    ? <Text>{teamName} - {spaceName}</Text>
    : <Text>{spaceName}</Text>;
