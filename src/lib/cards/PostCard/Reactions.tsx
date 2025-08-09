import { HStack } from '@chakra-ui/react';
import { GetReactionDto } from '@/prisma';
import { ReactionBar } from './ReactionBar';

interface ReactionsProps {
  user: { id: string; name: string; } | undefined;
  reactions: GetReactionDto[];
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: (emoji: string) => void;
}

export const Reactions = ({
  reactions,
  user,
  onAddReaction,
  onRemoveReaction,
}: ReactionsProps) => {
  if (!user) {
    return null;
  }

  return (
    <HStack>
      <ReactionBar
        reactions={reactions}
        onAddReaction={onAddReaction}
        onRemoveReaction={onRemoveReaction}
        userId={user?.id ?? ''}
      />
    </HStack>
  );
};
