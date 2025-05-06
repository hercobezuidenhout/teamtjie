import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

const getData = (id: number) =>
  prisma.scope.findFirstOrThrow({
    where: { id },
    include: { scopeValues: { orderBy: { id: Prisma.SortOrder.asc } } },
  });

export type GetScopeValueDto = Prisma.PromiseReturnType<typeof getData>;

export const getScopeWithValues = (id: number): Promise<GetScopeValueDto> =>
  getData(id);
