import prisma from '@/prisma/prisma';

export const getScopeWithUsers = async (scopeId: number) => {
  return await prisma.scope.findUnique({
    where: {
      id: scopeId,
    },
    include: {
      roles: {
        select: {
          user: true,
        },
      },
    },
  });
};
