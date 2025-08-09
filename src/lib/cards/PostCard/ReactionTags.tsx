import { GetReactionDto } from '@/prisma';
import { Box, Button, HStack, Tag, Text, Tooltip } from '@chakra-ui/react';
import { Emoji } from 'emoji-picker-react';
import { getEmojiDescription } from './utils';

interface ReactionTagsProps {
  reactions: GetReactionDto[];
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: (emoji: string) => void;
  userId: string;
}

export const ReactionTags = ({
  reactions,
  onAddReaction,
  onRemoveReaction,
  userId,
}: ReactionTagsProps) => {
  const isActive = (reaction: GetReactionDto) =>
    reaction.users.some(({ id }) => id === userId);

  const handleReactionClick = (item: GetReactionDto) => {
    if (isActive(item)) {
      onRemoveReaction(item.emoji);
    } else {
      onAddReaction(item.emoji);
    }
  };

  return (
    <>
      {reactions.map((item) => (
        <Tooltip borderRadius="md" backgroundColor="chakra-subtle-bg" color="chakra-subtle-text"
          key={item.emoji}
          label={
            <>
              <Text as="b">:{getEmojiDescription(item.emoji)}: reacted by</Text>
              {item.users.map(({ id, name }) => (
                <Text key={id}>{name}</Text>
              ))}
            </>
          }
        >
          <Tag
            variant="solid"
            as={Button}
            maxH={7}
            borderRadius={30}
            backgroundColor={isActive(item) ? "chakra-subtle-bg" : "chakra-subtle-bg"}
            onClick={() => handleReactionClick(item)}
          >
            <HStack gap={1}>
              <Emoji unified={item.emoji} size={20} />
              {item.users.length > 1 && (
                <Box fontWeight="medium">{item.users.length}</Box>
              )}
            </HStack>
          </Tag>
        </Tooltip>
      ))}
    </>
  );
};
