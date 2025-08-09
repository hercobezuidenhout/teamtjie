import { Body, Catch, Delete, Get, Param, ParseNumberPipe, Post, Req, UnauthorizedException, ValidationPipe, createHandler } from "next-api-decorators";
import { getUserFeed } from "@/prisma/queries/get-user-feed";
import { getPaginatedResponse } from "@/utils/get-paginated-response";
import { CreatePostDto } from "@/models/dtos/feed/create-post-dto";
import { CreatePostCommand, createPost } from "@/prisma/commands/create-post";
import { notifyScopeOfNewWin } from "@/backend/notifications/services/notify-scope-of-new-win";
import { notifyUserOfNewWin } from "@/backend/notifications/services/notify-user-of-new-win";
import { notifyUserOfNewFine } from "@/backend/notifications/services/notify-user-of-new-fine";
import { CreateReactionDto, PaginatedApiRequest } from "@/models";
import type { UserApiRequest, AbilitiesApiRequest } from "@/models";
import { createReaction, deleteReaction } from "@/prisma";
import { subject } from "@casl/ability";
import { defaultExceptionHandler } from "@/utils/default-exception-handler";
import { Authorize } from "@/backend/middleware/authorize/authorize";
import { Paginated } from "@/backend/middleware/paginated/paginated";
import { WithAbilities } from "@/backend/middleware/with-abilities/with-abilities";
import { detectNegativeLanguage } from "@/services/feed/utils/validate-post";
import type { ValidatablePost } from "@/models/types/validatable-post";
import { payFines } from "@/prisma/commands/pay-fines";



@Catch(defaultExceptionHandler)
class FeedHandler {

    @Get()
    @Authorize()
    @Paginated()
    @WithAbilities()
    public async getFeed(
        @Req() { userId, skip, take, query, abilities }: UserApiRequest & PaginatedApiRequest & AbilitiesApiRequest
    ) {
        const { scopeId, filterId } = query;
        const userCanReadScope = abilities.can('read', subject('Scope', { id: Number(scopeId) }));
        const userCanReadFilter = abilities.can('read', subject('Scope', { id: Number(filterId) }));

        let includeParentScope = false;
        const includeChildren = !filterId;

        if (filterId && !userCanReadFilter) {
            throw new UnauthorizedException();
        }

        if (filterId === scopeId && userCanReadScope) {
            includeParentScope = true;
        } else if (filterId && userCanReadFilter) {
            includeParentScope = true;
        } else if (!filterId && userCanReadScope) {
            includeParentScope = true;
        }

        const { data, count } = await getUserFeed({ userId, scopeId: filterId ? Number(filterId) : Number(scopeId), includeParentScope: includeParentScope, includeChildren: includeChildren, skip: skip, take: take });

        return getPaginatedResponse(data, skip, take, count);
    }

    @Post('/')
    @WithAbilities()
    @Authorize()
    public async createPost(
        @Req() req: UserApiRequest & AbilitiesApiRequest,
        @Body(ValidationPipe) body: CreatePostDto
    ) {
        const command: CreatePostCommand = {
            description: body.description,
            issuedById: req.userId,
            issuedToId: body.issuedToId,
            scopeId: body.scopeId,
            scopeValueIds: body.valueIds,
            type: body.type
        };

        const post = await createPost(command);

        switch (body.type) {
            case 'FINE':
                await Promise.all([notifyUserOfNewFine(post)]);
                break;
            case 'WIN':
                await Promise.all([notifyScopeOfNewWin(post), notifyUserOfNewWin(post)]);
                break;
            case 'PAYMENT':
                await payFines({ issuedById: req.userId, paymentId: post.id, scopeId: body.scopeId });
                break;
            default:
                break;
        }


        return post;
    }

    @Post('/validate')
    public async validatePost(
        @Body() body: ValidatablePost
    ) {
        return detectNegativeLanguage(body.description);
    }

    @Post('/:id/reactions')
    @Authorize()
    public async createPostReaction(
        @Param('id', ParseNumberPipe) id: number,
        @Req() req: UserApiRequest,
        @Body(ValidationPipe) { emoji }: CreateReactionDto
    ) {
        return await createReaction({
            postId: id,
            userId: req.userId,
            emoji: emoji
        });
    }

    @Delete('/:id/reactions/:emoji')
    @Authorize()
    public async deletePostReaction(
        @Param('id', ParseNumberPipe) id: number,
        @Param('emoji') emoji: string,
        @Req() req: AbilitiesApiRequest
    ) {
        return await deleteReaction({
            postId: id,
            userId: req.userId,
            emoji,
        });
    }
}

export default createHandler(FeedHandler);