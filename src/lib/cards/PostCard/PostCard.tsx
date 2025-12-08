import { Card, CardBody, HStack, VStack, Avatar, Text, Wrap, WrapItem, Box } from '@chakra-ui/react';
import { GetReactionDto, UserWithRolesDto } from '@/prisma';
import { useCreateReactionMutation } from '@/services/feed/mutations/use-create-reaction-mutation';
import { useDeleteReactionMutation } from '@/services/feed/mutations/use-delete-reaction-mutation';
import { Reactions } from './Reactions';
import { PostType } from '@prisma/client';
import { CLAP_HANDS } from './utils';
import { SparkleButton } from '@/app/playground/animations/SparkleButton/SparkleButton';
import { AvatarStub } from '@/models';
import { formatDistanceToNow } from 'date-fns';

export interface PostCardProps {
  id: number;
  reactions: GetReactionDto[];
  currentUser: UserWithRolesDto;
  type: PostType;
  issuedBy: AvatarStub<string>;
  issuedTo?: AvatarStub<string> | null;
  description: string;
  values?: string[];
  createdAt: Date;
  space: { id: number; name: string; };
  team?: { id: number; name: string; };
  scopeId: number;
  postType: PostType;
  isSmall?: boolean;
  spaceName?: string;
  teamName?: string;
  date?: Date;
}

export const PostCard = ({
  id,
  reactions,
  type,
  currentUser,
  issuedBy,
  issuedTo,
  description,
  values = [],
  createdAt,
  space,
  team,
}: PostCardProps) => {
  const { mutateAsync: createReaction } = useCreateReactionMutation(id);
  const { mutateAsync: deleteReaction } = useDeleteReactionMutation(id);

  const handleAddReaction = (emoji: string) => {
    createReaction({ emoji: emoji, user: currentUser });
  };

  const handleRemoveReaction = (emoji: string) => {
    deleteReaction({ emoji: emoji, user: currentUser });
  };

  const userReactions = reactions.filter(reaction =>
    reaction.users.filter(user => user.id === currentUser.id).length > 0
  );

  const userHasCelebrated = userReactions.find(reaction => reaction.emoji === CLAP_HANDS);
  const recipient = issuedTo || issuedBy;

  return (
    <Card>
      <CardBody p={{ base: 3, md: 4 }}>
        <HStack align="flex-start" spacing={{ base: 2, md: 3 }}>
          {/* Avatar */}
          <Avatar
            size={{ base: "sm", md: "md" }}
            name={recipient.name}
            src={recipient.image ?? undefined}
            flexShrink={0}
          />

          {/* Content */}
          <VStack align="stretch" flex="1" spacing={{ base: 1.5, md: 2 }} minW={0}>
            {/* Header: Name, Time */}
            <HStack spacing={{ base: 1.5, md: 2 }} flexWrap="wrap" fontSize={{ base: "xs", md: "sm" }}>
              <Text
                fontWeight="bold"
                color="chakra-body-text"
                noOfLines={1}
                maxW={{ base: "120px", md: "none" }}
              >
                {recipient.name}
              </Text>
              {type === 'WIN' && (
                <Text color="chakra-subtle-text" noOfLines={1}>
                  received a win 🎉
                </Text>
              )}
              <Text color="chakra-subtle-text" display={{ base: "none", sm: "block" }}>•</Text>
              <Text color="chakra-subtle-text" fontSize={{ base: "xs", md: "sm" }}>
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </Text>
            </HStack>

            {/* Description */}
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="chakra-body-text"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
            >
              {description}
            </Text>

            {/* Values and Scope as hashtags */}
            {(values.length > 0 || space || team) && (
              <Wrap spacing={{ base: 1.5, md: 2 }}>
                {/* Scope hashtag */}
                {(space || team) && (
                  <WrapItem>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="chakra-primary-color"
                      fontWeight="medium"
                    >
                      #{team ? team.name.replace(/\s+/g, '') : space.name.replace(/\s+/g, '')}
                    </Text>
                  </WrapItem>
                )}
                {/* Value hashtags */}
                {values.map((value, index) => (
                  <WrapItem key={index}>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="chakra-primary-color"
                      fontWeight="medium"
                    >
                      #{value.replace(/\s+/g, '')}
                    </Text>
                  </WrapItem>
                ))}
              </Wrap>
            )}

            {/* Footer: Reactions and Celebrate button */}
            <HStack
              justifyContent="space-between"
              pt={{ base: 1, md: 2 }}
              flexWrap={{ base: "wrap", md: "nowrap" }}
              gap={{ base: 2, md: 0 }}
            >
              <Box>
                <Reactions
                  user={currentUser}
                  onAddReaction={handleAddReaction}
                  onRemoveReaction={handleRemoveReaction}
                  reactions={reactions}
                />
              </Box>
              {!userHasCelebrated && type === 'WIN' && (
                <SparkleButton
                  onClick={() => handleAddReaction(CLAP_HANDS)}
                  emoji='👏'
                >
                  Celebrate
                </SparkleButton>
              )}
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};
