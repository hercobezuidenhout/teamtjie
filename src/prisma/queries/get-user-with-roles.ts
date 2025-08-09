import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

const getData = (userId: string) =>
  prisma.user.findFirstOrThrow({
    where: { id: userId },
    include: {
      roles: {
        include: {
          scope: {
            select: {
              type: true,
            },
          },
        },
      },
    },
  });

type UserWithRoles = Prisma.PromiseReturnType<typeof getData>;

const mapToDto = (user: UserWithRoles) => ({
  ...user,
  roles: user?.roles
    ? user?.roles.map((role) => ({
        userId: role.userId,
        scopeId: role.scopeId,
        role: role.role,
        scopeType: role.scope.type,
      }))
    : [],
});

export type UserWithRolesDto = ReturnType<typeof mapToDto>;

export const getUserWithRoles = async (
  userId: string
): Promise<UserWithRolesDto> => {
  const user = await getData(userId);
  return mapToDto(user);
};
