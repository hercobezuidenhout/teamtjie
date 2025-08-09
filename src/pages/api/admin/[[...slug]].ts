import {
  Catch,
  createHandler,
  Delete,
  Req,
  UnauthorizedException,
} from 'next-api-decorators';
import { defaultExceptionHandler } from '@/utils/default-exception-handler';
import type { NextApiRequest } from 'next';
import prisma from '@/prisma/prisma';
import { createClient } from '@supabase/supabase-js';
import { DeactivateUser } from '@prisma/client';


@Catch(defaultExceptionHandler)
class AdminHandler {
  @Delete('/users')
  public async deleteDeactivatedUsers(@Req() req: NextApiRequest) {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const TeamtjieToken = req.headers['x-Teamtjie-token'];

    if (!TeamtjieToken) {
      throw new UnauthorizedException();
    }

    const tokenFromDatabase = await prisma.TeamtjieToken.findFirst({
      where: {
        token: String(TeamtjieToken)
      }
    });

    if (!tokenFromDatabase) {
      throw new UnauthorizedException();
    }

    const deactivatedUsers = await prisma.deactivateUser.findMany({
      where: {
        processed: false
      }
    });

    const deletedUsers: DeactivateUser[] = [];

    for (let deactivatedUserIndex = 0; deactivatedUserIndex < deactivatedUsers.length; deactivatedUserIndex++) {
      const userToDelete = deactivatedUsers[deactivatedUserIndex];

      const { error } = await supabase.auth.admin.deleteUser(userToDelete.id);

      if (error) {
        console.error(error);
      }

      userToDelete.processed = true;

      await prisma.deactivateUser.update({
        where: {
          id: userToDelete.id
        },
        data: {
          processed: true
        }
      });

      deletedUsers.push(userToDelete);
    }


    return { deletedUsers: deletedUsers };
  }
}

export default createHandler(AdminHandler);
