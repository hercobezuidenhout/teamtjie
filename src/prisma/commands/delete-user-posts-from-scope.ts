import prisma from "../prisma";

export const deleteUserPostsFromScope = async (scopeId: number, userId: string) => {
  await prisma.post.deleteMany({
    where: {
      OR: [
        {
          scopeId: scopeId,
          issuedById: userId
        },
        {
          scopeId: scopeId,
          issuedToId: userId
        }
      ]
    }
  });
};