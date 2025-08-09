import { getSession } from '@/app/utils';
import { getScopes, getUserWithRoles } from '@/prisma';

export const getUserAndScopes = async () => {
  const session = await getSession();

  if (!session) {
    return undefined;
  }

  const userId = session.user.id;

  const [user, scopes] = await Promise.all([
    getUserWithRoles(userId),
    getScopes(userId),
  ]);

  return { user, scopes };
};
