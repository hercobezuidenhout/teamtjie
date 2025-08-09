import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

const getData = (id: number) =>
  prisma.scope.findFirstOrThrow({
    where: { id },
    include: { scopeLinks: { orderBy: { id: 'asc' } } },
  });

export type GetScopeLinkDto = Prisma.PromiseReturnType<typeof getData>;

export const getScopeWithLinks = (id: number): Promise<GetScopeLinkDto> =>
  getData(id);
