import { Prisma, Scope } from '@prisma/client';
import prisma from '@/prisma/prisma';

export type UpdateScopeCommand = Prisma.ScopeUpdateInput & { id: number };

export const updateScope = ({
  id,
  ...data
}: UpdateScopeCommand): Promise<Scope> =>
  prisma.scope.update({
    where: { id },
    data,
  });
