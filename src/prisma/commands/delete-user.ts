import prisma from '@/prisma/prisma';
import { safelyRemoveScopeRole, ScopeWithRoles } from '../utils/safely-remove-scope-role';

const getUserScopes = async (userId: string): Promise<ScopeWithRoles[]> => {
  const scopes = await prisma.scope.findMany({
    where: {
      roles: {
        some: {
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      roles: true,
    },
  });

  return scopes;
};

const deleteUserData = async (userId: string) =>
  await prisma.user.delete({
    where: {
      id: userId,
    },
    include: {
      roles: true,
      createdInvitations: true,
      issuedByPosts: true,
      issuedToPosts: true,
      postReactions: true
    }
  });

export const deleteUser = async (userId: string) => {
  let userScopes: ScopeWithRoles[] = [];

  try {
    userScopes = await getUserScopes(userId);
  } catch (error) {
    throw new Error(`Failed to get user scopes. ${(error as Error).message}`);
  }

  for (let scopeIndex = 0; scopeIndex < userScopes.length; scopeIndex++) {
    const scope = userScopes[scopeIndex];

    await safelyRemoveScopeRole(scope, userId);
  }

  try {
    await deleteUserData(userId);
  } catch (error) {
    throw new Error(`Failed to delete user data. ${(error as Error).message}`);
  }
};
