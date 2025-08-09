import {
    BadRequestException,
    Body,
    Catch,
    ConflictException,
    createHandler,
    Get,
    NotFoundException,
    Param,
    Post,
    Req,
    UnauthorizedException,
    ValidationPipe,
    InternalServerErrorException,
} from 'next-api-decorators';

import { addHours } from 'date-fns';

import { createInvitation } from '@/prisma/commands/create-invitation';
import { getInvitationByHash } from '@/prisma/queries/get-invitation-by-hash';
import type { AbilitiesApiRequest } from '@/models/types/abilities-api-request';
import { createRole } from '@/prisma/commands/create-role';
import { CreateInviteDto } from '@/models/dtos/invites/create-invite-dto';
import { subject } from '@casl/ability';
import { getValidInvitation } from '@/prisma/queries/get-valid-invitation';
import { RoleType } from '@prisma/client';
import { getScope } from '@/prisma';
import { defaultExceptionHandler } from '@/utils/default-exception-handler';
import { Authorize } from '@/backend/middleware/authorize/authorize';
import { WithAbilities } from '@/backend/middleware/with-abilities/with-abilities';
import { createAcceptedInvite } from '@/prisma/commands/create-accepted-invite';


@Catch(defaultExceptionHandler)
class InvitationsHandler {

    @Post()
    @Authorize()
    @WithAbilities()
    public async createInvite(
        @Body(ValidationPipe) body: CreateInviteDto,
        @Req() req: AbilitiesApiRequest
    ) {
        if (!req.abilities.can('invite', subject('Scope', { id: body.scopeId }))) {
            throw new UnauthorizedException();
        }

        const scope = await getScope(body.scopeId);

        if (scope.type === 'SPACE' && body.defaultRole === 'GUEST') {
            throw new BadRequestException('Cannot invite guests to the space, only to teams.');
        }

        const invitation = await getValidInvitation({
            userId: req.userId,
            scopeId: body.scopeId,
            defaultRole: body.defaultRole
        });

        if (invitation) {
            return invitation;
        }

        const expiresAt = addHours(new Date(), 24);
        return await createInvitation({
            createdByUserId: req.userId,
            expiresAt: expiresAt,
            scopeId: body.scopeId,
            defaultRole: body.defaultRole as RoleType
        });
    }

    @Get('/:hash')
    public async get(@Param('hash') hash: string) {
        const invitation = await getInvitationByHash(hash);

        if (!invitation) {
            throw new NotFoundException();
        }

        return invitation;
    }


    @Post('/:hash/accept')
    @Authorize()
    @WithAbilities()
    public async accept(
        @Param('hash') hash: string,
        @Req() req: AbilitiesApiRequest
    ) {
        const invitation = await getInvitationByHash(hash);

        if (!invitation) {
            throw new NotFoundException();
        }

        const isMember = req.abilities.can('read', subject('Scope', { id: invitation.scopeId }));

        if (isMember) {
            throw new ConflictException();
        }

        const scope = await getScope(invitation.scopeId);

        await createRole({ userId: req.userId, scopeId: invitation.scopeId, role: invitation.defaultRole });

        if (scope.parentScopeId && scope.parentScopeId > 0) {
            await createRole({ userId: req.userId, scopeId: scope.parentScopeId, role: invitation.defaultRole });
        }

        try {
            await createAcceptedInvite(req.userId, invitation.id);
        } catch (error) {
            console.error('Error creating accepted invite:', error);
            throw new InternalServerErrorException('Could not accept the invitation');
        }

        return invitation;
    }
}

export default createHandler(InvitationsHandler);



