import prisma from '@/prisma/prisma';
import { PostReaction } from '@prisma/client';

interface DeleteReactionCommand {
  postId: number;
  userId: string;
  emoji: string;
}

export const deleteReaction = async ({
  postId,
  userId,
  emoji: reaction,
}: DeleteReactionCommand): Promise<PostReaction> =>
  prisma.postReaction.delete({
    where: {
      postId_userId_reaction: { postId, userId, reaction },
    },
  });
