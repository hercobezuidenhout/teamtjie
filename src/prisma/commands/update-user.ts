import prisma from '@/prisma/prisma';
import { Prisma, User } from '@prisma/client';

export type UpdateUserCommand = Prisma.UserUpdateInput & { id: string };

export const updateUser = async ({
  id,
  ...data
}: UpdateUserCommand): Promise<User> => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });

  return updatedUser;
};
