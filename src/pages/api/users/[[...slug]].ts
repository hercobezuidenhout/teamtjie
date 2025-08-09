import type { AbilitiesApiRequest, PaginatedApiRequest, UserApiRequest } from '@/models';

import {
  Body,
  Catch,
  createHandler,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseNumberPipe,
  Put,
  Query,
  Req,
  ValidationPipe,
} from 'next-api-decorators';
import { AzureToken } from '@/models/types/azure-token';
import { createUser } from '@/prisma/commands/create-user';
import { getPaginatedResponse } from '@/utils/get-paginated-response';
import { UpdateUserDto } from '@/models/dtos/user/update-user-dto';
import { updateUser } from '@/prisma/commands/update-user';
import { deleteUser } from '@/prisma/commands/delete-user';
import { getUserWithRoles } from '@/prisma/queries/get-user-with-roles';
import { getUsers } from '@/prisma/queries/get-users';
import { getUserExists } from '@/prisma/queries/get-user-exists';
import { defaultExceptionHandler } from '@/utils/default-exception-handler';
import { Authorize, Paginated, WithAbilities } from '@/backend';
import { getUser } from '@/prisma';
import { UpdateUserEmailDto } from '@/models/dtos/user/update-user-email-dto';
import { deactivateUser } from '@/prisma/commands/deactivate-user';
import { getUserNotificationPreferences } from '@/prisma/queries/get-user-notification-preferences';
import { updateUserNotificationPreference } from '@/prisma/commands/update-user-notification-preference';
import type { UpdateUserNotificationPreferenceDto } from '@/models/dtos/user/update-user-notification-preference-dto';

const getUserFromAzureJwt = (token: string) => {
  const [, payloadBase64] = token.split('.');
  const payload = Buffer.from(payloadBase64, 'base64').toString();
  const tokenObject: AzureToken = JSON.parse(payload);
  return {
    id: tokenObject.sub,
    name: tokenObject.user_metadata.name,
    email: tokenObject.email,
  };
};

@Catch(defaultExceptionHandler)
class UsersHandler {
  @Get()
  @Authorize()
  @WithAbilities()
  @Paginated()
  public async get(
    @Req() req: UserApiRequest & PaginatedApiRequest & AbilitiesApiRequest,
    @Query('scopeId', ParseNumberPipe) scopeId = 0,
    @Query('scopeType') scopeType = 'SPACE',
    @Query('filter') filter = ''
  ) {
    const { data, count } = await getUsers({
      ...req,
      scopeId,
      scopeType,
      filter,
    });

    return getPaginatedResponse(data, req.skip, req.take, count);
  }

  @Get('/current')
  @Authorize()
  public async getCurrent(@Req() req: UserApiRequest) {
    const userExists = await getUserExists({ id: req.userId });

    if (!userExists) {
      try {
        const user = getUserFromAzureJwt(req.token);

        if (!user.name) {
          user.name = 'Teamtjier';
        }

        await createUser({ ...user });
      } catch (error) {
        console.error(error);
      }
    }

    return getUserWithRoles(req.userId);
  }

  @Put('/current')
  @Authorize()
  public async updateCurrent(
    @Req() req: UserApiRequest,
    @Body(ValidationPipe) { name, aboutMe }: UpdateUserDto
  ) {
    return updateUser({ id: req.userId, name, aboutMe });
  }

  @Put('/email')
  @Authorize()
  public async updateUserEmail(
    @Req() req: UserApiRequest,
    @Body(ValidationPipe) { email }: UpdateUserEmailDto
  ) {
    return updateUser({ id: req.userId, email });
  }

  @Get('/:id')
  @Authorize()
  public async getById(@Param('id') id: string) {
    const result = await getUser({ id: id });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }


  @Get('/:id/roles/:scopeId')
  @Authorize()
  public async getUserScopeRole(@Param('id') id: string, @Param('scopeId') scopeId: number) {
    const userWithRoles = await getUserWithRoles(id);
    const scopeRole = userWithRoles.roles.find(role => role.scopeId == scopeId);
    return scopeRole ?? {};
  }

  @Get('/:id/notifications/preferences')
  @Authorize()
  public async getUserNotificationPreferences(@Param('id') id: string) {
    const result = await getUserNotificationPreferences(id);
    return result;
  }

  @Put('/:id/notifications/preferences')
  @Authorize()
  public async updateUserNotificationPreferences(
    @Param('id') id: string,
    @Body() body: UpdateUserNotificationPreferenceDto
  ) {
    const result = await updateUserNotificationPreference({ userId: id, ...body });
    return result;
  }

  @Delete()
  @Authorize()
  public async deleteUser(@Req() req: UserApiRequest) {
    const { id, email } = await getUserWithRoles(req.userId);

    await deleteUser(id);
    await deactivateUser(id, email ?? '');

    return {};
  }
}

export default createHandler(UsersHandler);
