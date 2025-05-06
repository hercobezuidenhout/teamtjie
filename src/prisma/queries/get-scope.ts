import prisma from '@/prisma/prisma';
import { Prisma, Scope } from '@prisma/client';

const getData = (id: number): Promise<Scope> =>
  prisma.scope.findFirstOrThrow({
    where: { id },
  });

export type GetScopeDto = Prisma.PromiseReturnType<typeof getData>;

export const getScope = (id: number): Promise<GetScopeDto> => getData(id);
