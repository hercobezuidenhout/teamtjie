import { NextApiRequest, NextApiResponse } from 'next';
import { createMiddlewareDecorator, NextFunction } from 'next-api-decorators';
import { UserApiRequest } from '../../../models/types/user-api-request';
import { getSupabaseClient } from '../../../utils/get-supabase-client';
import { getUserExists } from '@/prisma';
import { createUser } from '@/prisma/commands/create-user';

export const Authorize = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const supabase = getSupabaseClient(req, res);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session)
      return res.status(401).json({
        error: 'not_authenticated',
        description:
          'The user does not have an active session or is not authenticated',
      });


    const userExists = await getUserExists({ id: session.user.id });

    if (!userExists) {
      await createUser({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.email?.substring(0, session.user.email?.lastIndexOf("@")) || 'Doinfer'
      });
    }

    (req as UserApiRequest).userId = session.user.id;
    (req as UserApiRequest).token = session.access_token;

    next();
  }
);
