import prisma from '@/prisma/prisma';

type GetUserExistsQuery = { email: string } | { id: string };

const getData = (query: GetUserExistsQuery) =>
  prisma.user.findFirst({
    where: query,
  });

export const getUserExists = async (
  query: GetUserExistsQuery
): Promise<boolean> => {
  const user = await getData(query);
  return !!user;
};
