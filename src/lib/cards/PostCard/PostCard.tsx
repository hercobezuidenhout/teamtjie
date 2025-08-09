import {
  PostCardHeader,
  PostCardHeaderProps,
} from './PostCardHeader';
import { Card, CardBody, HStack, VStack } from '@chakra-ui/react';
import {
  PostCardBody,
  PostCardBodyProps,
} from './PostCardBody';
import {
  PostCardFooter,
  PostCardFooterProps,
} from './PostCardFooter';
import { GetReactionDto, UserWithRolesDto } from '@/prisma';
import { useCreateReactionMutation } from '@/services/feed/mutations/use-create-reaction-mutation';
import { useDeleteReactionMutation } from '@/services/feed/mutations/use-delete-reaction-mutation';
import { Reactions } from './Reactions';
import { PostType } from '@prisma/client';
import { CLAP_HANDS, THUMBS_DOWN, THUMBS_UP } from './utils';
import { SparkleButton } from '@/app/playground/animations/SparkleButton/SparkleButton';

export interface PostCardProps extends
  PostCardHeaderProps,
  Omit<PostCardBodyProps, 'title'>,
  Pick<PostCardFooterProps, 'renderFooterRight'> {
  reactions: GetReactionDto[];
  currentUser: UserWithRolesDto;
  type: PostType;
  id: number;
}

export const PostCard = ({
  id,
  reactions,
  type,
  isSmall,
  ...props
}: PostCardProps) => {
  const { currentUser } = props;
  const { mutateAsync: createReaction } = useCreateReactionMutation(id);
  const { mutateAsync: deleteReaction } = useDeleteReactionMutation(id);

  const handleAddReaction = (emoji: string) => {
    createReaction({ emoji: emoji, user: currentUser });
  };

  const handleRemoveReaction = (emoji: string) => {
    deleteReaction({ emoji: emoji, user: currentUser });
  };

  const generateTitle = () => {
    switch (type) {
      case 'FINE':
        return 'was fined';
      case 'WIN':
        return 'was awarded a win';
      case 'PAYMENT':
        return 'paid off a fine';
      default:
        return 'did something';
    }
  };

  const renderFooterRight = () => {
    const userReactions = reactions.filter(reaction => reaction.users.filter(user => user.id === currentUser.id).length > 0);

    switch (type) {
      case 'FINE':
        const userHasVoted = userReactions.find(reaction => reaction.emoji === THUMBS_UP || reaction.emoji === THUMBS_DOWN);

        return !userHasVoted && (
          <HStack>
            <SparkleButton onClick={() => handleAddReaction(THUMBS_UP)}>👍</SparkleButton>
            <SparkleButton onClick={() => handleAddReaction(THUMBS_DOWN)}>👎</SparkleButton>
          </HStack>
        );
      case 'WIN':
        const userHasCelebrated = userReactions.find(reaction => reaction.emoji === CLAP_HANDS);
        return !userHasCelebrated && <SparkleButton onClick={() => handleAddReaction(CLAP_HANDS)} emoji='👏'>Celebrate</SparkleButton>;
      default:
        break;
    }
  };

  return (
    <Card>
      <CardBody paddingY="0.8rem" paddingX={['1rem', '1.2rem']}>
        <VStack align="stretch" gap={2}>
          {!isSmall && <PostCardHeader {...props} />}
          <PostCardBody title={generateTitle()} type={type} {...props} />
          <PostCardFooter
            {...props}
            renderFooterLeft={
              <Reactions
                user={currentUser}
                onAddReaction={handleAddReaction}
                onRemoveReaction={handleRemoveReaction}
                reactions={reactions}
              />
            }
            renderFooterRight={renderFooterRight()}
          />
        </VStack>
      </CardBody>
    </Card>
  );
};
