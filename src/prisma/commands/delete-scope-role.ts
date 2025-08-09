import prisma from '@/prisma/prisma';
import { RoleType } from '@prisma/client';

interface DeleteScopeRoleCommand {
  scopeId: number;
  userId: string;
  role: RoleType;
}

export const deleteScopeRole = async ({
  scopeId,
  userId,
  role,
}: DeleteScopeRoleCommand) => {
  await prisma.scopeRole.delete({
    where: {
      role_scopeId_userId: {
        role: role,
        scopeId: scopeId,
        userId: userId,
      },
    },
  });

  await prisma.scopeRole.deleteMany({
    where: {
      scope: {
        parentScopeId: scopeId,
      },
      userId: userId,
    },
  });

  await prisma.post.deleteMany({
    where: {
      AND: {
        scopeId: scopeId,
        issuedById: userId
      }
    }
  });

  await prisma.post.deleteMany({
    where: {
      AND: {
        scopeId: scopeId,
        issuedToId: userId
      }
    }
  });

  await prisma.post.deleteMany({
    where: {
      AND: {
        scope: {
          parentScopeId: scopeId
        },
        issuedById: userId
      }
    }
  });

  await prisma.post.deleteMany({
    where: {
      AND: {
        scope: {
          parentScopeId: scopeId
        },
        issuedToId: userId
      }
    }
  });
};
