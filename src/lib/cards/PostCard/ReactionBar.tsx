import { GetReactionDto } from '@/prisma';
import { Flex } from '@chakra-ui/react';
import { ReactionSelector } from './ReactionSelector';
import { ReactionTags } from './ReactionTags';

interface ReactionBarProps {
  reactions: GetReactionDto[];
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: (emoji: string) => void;
  userId: string;
}

export const ReactionBar = ({
  reactions,
  onAddReaction,
  onRemoveReaction,
  userId,
}: ReactionBarProps) => {
  return (
    <Flex flexWrap="wrap" gap={1} rowGap={2} align="center">
      <ReactionTags
        reactions={reactions}
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        userId={userId}
      />
      <ReactionSelector onAddReaction={onAddReaction} />
    </Flex>
  );
};
