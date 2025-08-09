import prisma from '@/prisma/prisma';

export interface CreateScopeCommand {
  parentScopeId?: number;
  name: string;
  description: string;
  userId: string;
  type: 'TEAM' | 'SPACE';
}

export const createScope = async ({
  parentScopeId,
  name,
  description,
  userId,
  type,
}: CreateScopeCommand) => {
  const DEFAULT_ROLE = 'ADMIN';

  return await prisma.scope.create({
    data: {
      parentScopeId: parentScopeId,
      type: type,
      name: name,
      description: description,
      updatedAt: new Date(),
      roles: {
        create: {
          role: DEFAULT_ROLE,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    },
  });
};
