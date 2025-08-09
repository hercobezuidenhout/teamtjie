import prisma from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

interface GetUserTeamsQuery {
    userId: string;
    scopeId: number;
}

const getData = async (userId, scopeId) => prisma.scopeRole.findMany({
    where: {
        userId: userId,
        scope: {
            parentScopeId: scopeId
        }
    },
    select: {
        scopeId: true
    }
});

type GetUserTeamsResponse = Prisma.PromiseReturnType<typeof getData>;

export const getUserTeams = async ({ scopeId, userId }: GetUserTeamsQuery): Promise<GetUserTeamsResponse> =>
    await getData(userId, scopeId);