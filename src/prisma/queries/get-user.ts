import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

type GetUserQuery = { email: string } | { id: string };

const getData = (query: GetUserQuery) =>
  prisma.user.findFirstOrThrow({
    where: query,
  });

export type GetUserDto = Prisma.PromiseReturnType<typeof getData>;

export const getUser = (query: GetUserQuery): Promise<GetUserDto> =>
  getData(query);
