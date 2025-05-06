import prisma from '@/prisma/prisma';
import { RoleType } from '@prisma/client';

interface UpdateScopeRoleCommand {
  scopeId: number;
  userId: string;
  currentRole: RoleType;
  newRole: RoleType;
}

export const updateScopeRole = async ({
  scopeId,
  userId,
  currentRole,
  newRole,
}: UpdateScopeRoleCommand) => {
  await prisma.scopeRole.update({
    where: {
      role_scopeId_userId: {
        role: currentRole,
        scopeId: scopeId,
        userId: userId,
      },
    },
    data: {
      role: newRole,
    },
  });
};
