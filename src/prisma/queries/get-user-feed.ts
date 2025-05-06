import { PaginatedApiRequest } from "@/models";
import { getFeed } from "@/prisma/queries/get-feed";
import { getUserTeams } from "@/prisma/queries/get-user-teams";

interface GetUserFeedQuery extends Pick<PaginatedApiRequest, 'skip' | 'take'> {
    userId: string;
    scopeId: number;
    includeParentScope?: boolean;
    includeChildren?: boolean;
}

export const getUserFeed = async ({ userId, scopeId, skip, take, includeParentScope, includeChildren }: GetUserFeedQuery) => {
    const teams = await getUserTeams({ scopeId, userId });

    const scopes = includeParentScope ? [scopeId, ...teams.map(team => team.scopeId)] : teams.map(team => team.scopeId);

    const feed = await getFeed({ scopeIds: includeChildren ? scopes : [scopeId], skip, take, userId });

    return feed;
};