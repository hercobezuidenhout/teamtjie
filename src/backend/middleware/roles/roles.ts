import { createMiddlewareDecorator, NextFunction } from 'next-api-decorators';
import { NextApiRequest, NextApiResponse } from 'next';
import { AbilitiesApiRequest } from '../../../models/types/abilities-api-request';
import { getUserWithRoles } from '@/prisma/queries/get-user-with-roles';

export const Roles = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const user = await getUserWithRoles((req as AbilitiesApiRequest).userId);

    if (!user)
      return res.status(401).json({
        error: 'user_not_found',
        description: 'The user could not be found in the database',
      });

    (req as AbilitiesApiRequest).user = user;
    next();
  }
);
