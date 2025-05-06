import prisma from '@/prisma/prisma';
import { PostReaction } from '@prisma/client';

interface CreateReactionCommand {
  postId: number;
  userId: string;
  emoji: string;
}

export const createReaction = ({
  postId,
  userId,
  emoji: reaction,
}: CreateReactionCommand): Promise<PostReaction> =>
  prisma.postReaction.upsert({
    where: {
      postId_userId_reaction: { postId, userId, reaction },
    },
    create: {
      postId,
      userId,
      reaction,
    },
    update: {},
  });
