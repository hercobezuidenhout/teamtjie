import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

const getData = async (userId: string) =>
  prisma.scope.findMany({
    where: { roles: { some: { userId: userId } } },
    include: { scopeValues: { orderBy: { id: Prisma.SortOrder.asc } } },
    orderBy: { name: 'asc' },
  });

export type GetScopeIncludingValuesDto = Prisma.PromiseReturnType<
  typeof getData
> extends readonly (infer T)[]
  ? T
  : never;

export const getScopes = (
  userId: string
): Promise<GetScopeIncludingValuesDto[]> => getData(userId);
