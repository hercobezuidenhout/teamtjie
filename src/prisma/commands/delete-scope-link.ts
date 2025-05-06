import { ScopeLink } from '@prisma/client';
import prisma from '@/prisma/prisma';

export const deleteScopeLink = (id: number): Promise<ScopeLink> =>
  prisma.scopeLink.delete({
    where: { id },
  });
