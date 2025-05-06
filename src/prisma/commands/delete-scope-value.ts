import { ScopeValue } from '@prisma/client';
import prisma from '@/prisma/prisma';

export const deleteScopeValue = (id: number): Promise<ScopeValue> =>
  prisma.scopeValue.delete({
    where: { id },
  });
