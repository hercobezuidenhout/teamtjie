import { Text } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';

export interface PostCardHeaderDateProps {
  date: Date;
}

export const PostCardHeaderDate = ({
  date
}: PostCardHeaderDateProps) => (
  <Text fontSize="sm">
    {formatDistanceToNow(new Date(date), { addSuffix: true })}
  </Text>
);
