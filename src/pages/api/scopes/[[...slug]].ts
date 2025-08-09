import {
    BadRequestException,
    Body,
    Catch,
    createHandler,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseNumberPipe,
    Post,
    Put,
    Query,
    Req,
    Res,
    UnauthorizedException,
    ValidationPipe,
} from 'next-api-decorators';
import { WithAbilities } from '@/backend/middleware/with-abilities/with-abilities';
import { subject } from '@casl/ability';
import type { AbilitiesApiRequest } from '@/models/types/abilities-api-request';
import { upsertScopeValue } from '@/prisma/commands/upsert-scope-value';
import { deleteScopeValue } from '@/prisma/commands/delete-scope-value';
import {
    CreateScopeDto,
    CreateScopeLinkDto,
    CreateScopeValueDto,
    UpdateScopeLinkDto,
    UpdateScopeValueDto,
} from '@/models';
import { UpdateScopeDto } from '@/models/dtos/scope/update-scope';
import { updateScope } from '@/prisma/commands/update-scope';
import { upsertScopeLink } from '@/prisma/commands/upsert-scope-link';
import { getPaginatedResponse } from '@/utils/get-paginated-response';
import {
    createScope,
    CreateScopeCommand,
    deleteScopeLink,
    getChildScopes,
    getScopes,
    getScopeWithLinks,
    getScopeWithValues,
    leaveScope,
} from '@/prisma';
import { getScopeProfile } from '@/prisma/queries/get-scope-profile';
import { updateScopeRole } from '@/prisma/commands/update-scope-role';
import { RoleType, ScopeType } from '@prisma/client';
import type { NextApiResponse } from 'next';
import { UpdateScopeRoleDto } from '@/models/dtos/scope/update-scope-role';
import { RemoveScopeRoleDto } from '@/models/dtos/scope/remove-scope-role';
import { deleteScopeRole } from '@/prisma/commands/delete-scope-role';
import { validateChildCreate } from '@/utils/validate-child-create';
import { defaultExceptionHandler } from '@/utils/default-exception-handler';
import { Authorize } from '@/backend/middleware/authorize/authorize';
import type { PaginatedApiRequest, UserApiRequest } from '@/models';
import { Paginated } from '@/backend/middleware/paginated/paginated';
import { checkAndCreateScopePermissions } from '@/prisma/commands/check-and-create-scope-permissions';
import { getScopePermissions } from '@/prisma/queries/get-scope-permissions';
import type { CreateScopePostPermissionRole } from '@/models/types/create-scope-post-permission-role';
import { createScopePostPermissionRole } from '@/prisma/commands/create-scope-post-permission-role';
import type { RemoveScopePostPermissionRole } from '@/models/types/remove-scope-post-permission-role';
import { remvoeScopePostPermissionRole } from '@/prisma/commands/remove-scope-post-permission-role';
import { deleteScope } from '@/prisma/commands/delete-scope';

@Catch(defaultExceptionHandler)
class ScopesHandler {
    @Get()
    @Authorize()
    @WithAbilities()
    public async get(@Req() req: AbilitiesApiRequest) {
        if (!req.abilities.can('read', 'Scope')) {
            throw new UnauthorizedException();
        }

        return await getScopes(req.userId);
    }

    @Post()
    @Authorize()
    @WithAbilities()
    public async createScope(
        @Req() req: UserApiRequest & AbilitiesApiRequest,
        @Body(ValidationPipe) body: CreateScopeDto
    ) {
        if (body.type == ScopeType.TEAM) {
            if (body.parentScopeId) {
                await validateChildCreate(req, body.parentScopeId, body.name);
            } else {
                throw new BadRequestException(
                    'parentScopeId must be provided when creating a new team.'
                );
            }
        }

        const createScopeCommand: CreateScopeCommand = {
            ...body,
            userId: req.userId,
            parentScopeId: body.parentScopeId == 0 ? undefined : body.parentScopeId,
        };
        const response = await createScope(createScopeCommand);

        return response;
    }

    @Get('/:id')
    @Authorize()
    @WithAbilities()
    public async getById(
        @Param('id', ParseNumberPipe) id: number,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('read', subject('Scope', { id }))) {
            throw new UnauthorizedException();
        }

        await checkAndCreateScopePermissions(id);

        return await getScopeProfile(id);
    }

    @Get('/:id/permissions')
    @Authorize()
    @WithAbilities()
    public async getScopePermissionsById(
        @Param('id', ParseNumberPipe) id: number,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('access', subject('Scope', { id }))) {
            throw new UnauthorizedException();
        }

        await checkAndCreateScopePermissions(id);

        return await getScopePermissions(id);
    }

    @Post('/:id/permissions/roles')
    @Authorize()
    @WithAbilities()
    public async addScopePostPermissionsRole(
        @Param('id', ParseNumberPipe) id: number,
        @Req() req: AbilitiesApiRequest,
        @Body() body: CreateScopePostPermissionRole
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id }))) {
            throw new UnauthorizedException();
        }

        await checkAndCreateScopePermissions(id);

        return await createScopePostPermissionRole(body.scopePostPermissionId, body.role);
    }

    @Put('/:id/permissions/roles')
    @Authorize()
    @WithAbilities()
    public async removeScopePostPermissionsRole(
        @Param('id', ParseNumberPipe) id: number,
        @Req() req: AbilitiesApiRequest,
        @Body() body: RemoveScopePostPermissionRole
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id }))) {
            throw new UnauthorizedException();
        }

        await checkAndCreateScopePermissions(id);

        return await remvoeScopePostPermissionRole(body.scopePostPermissionId, body.role);
    }

    @Put('/:id')
    @Authorize()
    @WithAbilities()
    public async update(
        @Param('id', ParseNumberPipe) id: number,
        @Body(ValidationPipe) body: UpdateScopeDto,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id }))) {
            throw new UnauthorizedException();
        }

        return updateScope({ id, ...body });
    }

    @Get('/:id/values')
    @Authorize()
    @WithAbilities()
    public async getValues(
        @Param('id', ParseNumberPipe) id: number,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('read', subject('Scope', { id }))) {
            throw new UnauthorizedException();
        }

        const scopeWithValues = await getScopeWithValues(id);

        if (!scopeWithValues) {
            throw new NotFoundException();
        }

        return scopeWithValues.scopeValues;
    }

    @Put('/:id/values')
    @Authorize()
    @WithAbilities()
    public async createValue(
        @Param('id', ParseNumberPipe) id: number,
        @Body(ValidationPipe) body: CreateScopeValueDto,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id }))) {
            throw new UnauthorizedException();
        }

        return await upsertScopeValue({ scopeId: id, ...body });
    }

    @Put('/:scopeId/values/:id')
    @Authorize()
    @WithAbilities()
    public async updateValue(
        @Param('id', ParseNumberPipe) id: number,
        @Param('scopeId', ParseNumberPipe) scopeId: number,
        @Body(ValidationPipe) body: UpdateScopeValueDto,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id: scopeId }))) {
            throw new UnauthorizedException();
        }

        return await upsertScopeValue({ id, scopeId, ...body });
    }

    @Delete('/:id')
    @Authorize()
    @WithAbilities()
    public async deleteScope(
        @Param('id', ParseNumberPipe) id: number,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id: id }))) {
            throw new UnauthorizedException();
        }

        return await deleteScope(id);
    }

    @Delete('/:scopeId/values/:id')
    @Authorize()
    @WithAbilities()
    public async deleteValue(
        @Param('id', ParseNumberPipe) id: number,
        @Param('scopeId', ParseNumberPipe) scopeId: number,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id: scopeId }))) {
            throw new UnauthorizedException();
        }

        return await deleteScopeValue(id);
    }

    @Get('/:id/links')
    @Authorize()
    @WithAbilities()
    public async getLinks(
        @Param('id', ParseNumberPipe) id: number,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('read', subject('Scope', { id }))) {
            throw new UnauthorizedException();
        }

        const scopeWithLinks = await getScopeWithLinks(id);

        if (!scopeWithLinks) {
            throw new NotFoundException();
        }

        return scopeWithLinks.scopeLinks;
    }

    @Post('/:id/links')
    @Authorize()
    @WithAbilities()
    public async createLink(
        @Param('id', ParseNumberPipe) id: number,
        @Body(ValidationPipe) body: CreateScopeLinkDto,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id }))) {
            throw new UnauthorizedException();
        }

        return await upsertScopeLink({ scopeId: id, ...body });
    }

    @Put('/:scopeId/links/:id')
    @Authorize()
    @WithAbilities()
    public async updateLink(
        @Param('id', ParseNumberPipe) id: number,
        @Param('scopeId', ParseNumberPipe) scopeId: number,
        @Body(ValidationPipe) body: UpdateScopeLinkDto,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id: scopeId }))) {
            throw new UnauthorizedException();
        }

        return await upsertScopeLink({ id, scopeId, ...body });
    }

    @Delete('/:scopeId/links/:id')
    @Authorize()
    @WithAbilities()
    public async deleteLink(
        @Param('id', ParseNumberPipe) id: number,
        @Param('scopeId', ParseNumberPipe) scopeId: number,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('edit', subject('Scope', { id: scopeId }))) {
            throw new UnauthorizedException();
        }

        return await deleteScopeLink(id);
    }

    @Get('/:id/children')
    @Authorize()
    @Paginated()
    @WithAbilities()
    public async getChildren(
        @Param('id', ParseNumberPipe) id: number,
        @Req()
        {
            skip,
            take,
            userId,
        }: AbilitiesApiRequest & PaginatedApiRequest,
        @Query('filter') filter: string | undefined = undefined
    ) {
        const { data, count } = await getChildScopes({
            filter,
            userId,
            parentScopeId: id,
            take,
            skip,
        });

        return getPaginatedResponse(data, skip, take, count);
    }

    @Put('/:id/roles')
    @Authorize()
    @WithAbilities()
    public async updateRoles(
        @Param('id', ParseNumberPipe) id: number,
        @Req() { user: userMakingRequest }: AbilitiesApiRequest,
        @Body(ValidationPipe) { userId, newRole, currentRole }: UpdateScopeRoleDto,
        @Res() res: NextApiResponse
    ) {
        if (
            userMakingRequest.roles.find(
                (role) => role.scopeId === id && role.role === 'ADMIN'
            )
        ) {
            await updateScopeRole({
                scopeId: id,
                userId,
                currentRole: currentRole as RoleType,
                newRole: newRole as RoleType,
            });
            res.send(200);
        } else {
            res.status(403).send('You are not an admin of the scope.');
        }
    }

    @Put('/:id/roles/remove')
    @Authorize()
    @WithAbilities()
    public async removeRoles(
        @Param('id', ParseNumberPipe) id: number,
        @Req() { user: userMakingRequest }: AbilitiesApiRequest,
        @Body(ValidationPipe) { userId, role }: RemoveScopeRoleDto,
        @Res() res: NextApiResponse
    ) {
        if (userMakingRequest.id === userId) {
            return res.status(403).send('You cannot remove yourself.');
        }
        if (
            !userMakingRequest.roles.find(
                (role) => role.scopeId === id && role.role === 'ADMIN'
            )
        ) {
            return res.status(403).send('You are not an admin of the scope.');

        }

        await deleteScopeRole({ scopeId: id, userId, role: role as RoleType });
        return res.send(200);
    }

    @Delete('/:id/leave')
    @Authorize()
    @WithAbilities()
    public async leaveScope(
        @Param('id', ParseNumberPipe) id: number,
        @Req() { user }: AbilitiesApiRequest,
        @Res() res: NextApiResponse
    ) {
        await leaveScope({ scopeId: id, userId: user.id });
        return res.send(200);
    }
}

export default createHandler(ScopesHandler);
