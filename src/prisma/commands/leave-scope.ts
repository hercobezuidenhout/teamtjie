import prisma from '@/prisma/prisma';
import { safelyRemoveScopeRole } from '../utils/safely-remove-scope-role';

interface LeaveScopeCommand {
  scopeId: number;
  userId: string;
}
export const leaveScope = async ({ scopeId, userId }: LeaveScopeCommand) => {
  const childScopes = await prisma.scope.findMany({
    where: {
      roles: {
        some: {
          userId: userId,
        },
      },
      parentScopeId: scopeId
    },
    select: {
      id: true,
      roles: true,
    },
  });

  for (let childScopeIndex = 0; childScopeIndex < childScopes.length; childScopeIndex++) {
    const childScope = childScopes[childScopeIndex];
    await safelyRemoveScopeRole(childScope, userId);
  }

  const scope = await prisma.scope.findUniqueOrThrow({
    where: {
      roles: {
        some: {
          userId: userId,
        },
      },
      id: scopeId
    },
    select: {
      id: true,
      roles: true,
    },
  });

  return await safelyRemoveScopeRole(scope, userId);
};
