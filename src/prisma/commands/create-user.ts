import prisma from '@/prisma/prisma';
import { User } from '@prisma/client';

export type CreateUserCommand = Pick<User, 'id' | 'name' | 'email'>;

export interface CreateUserResponse {
  id: string;
  name: string;
}

export const createUser = async (
  user: CreateUserCommand
): Promise<CreateUserResponse> => {
  const createdUser = await prisma.user.create({
    data: { id: user.id, name: user.name, email: user.email },
  });

  if (!user.email) {
    console.error(`User with id ${createdUser.id} did not provide an email.`);
  }

  return createdUser;
};
