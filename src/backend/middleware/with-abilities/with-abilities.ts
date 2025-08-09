import { createMiddlewareDecorator, NextFunction } from 'next-api-decorators';
import { NextApiRequest, NextApiResponse } from 'next';
import { AbilitiesApiRequest } from '../../../models/types/abilities-api-request';
import { getUserWithRoles } from '@/prisma/queries/get-user-with-roles';
import { userRoles } from '@/permissions/roles';
import { abilities } from '@/permissions/abilities';
import { getScopePermissions } from '@/prisma/queries/get-scope-permissions';

export const WithAbilities = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const user = await getUserWithRoles((req as AbilitiesApiRequest).userId);
    const roles = await userRoles(user.id);
    const scopeRoles = await getScopePermissions(roles.map(role => role.scopeId));

    if (!user)
      return res.status(401).json({
        error: 'user_not_found',
        description: 'The user could not be found in the database',
      });

    (req as AbilitiesApiRequest).user = user;
    (req as AbilitiesApiRequest).abilities = abilities(roles, scopeRoles);

    next();
  }
);
