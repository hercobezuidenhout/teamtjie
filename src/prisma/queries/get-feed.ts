import { PaginatedApiRequest } from "@/models";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { mapPostReactionsToDto } from "../utils";

interface GetFeedQuery extends Pick<PaginatedApiRequest, 'skip' | 'take'> {
    scopeIds: number[];
}

const getData = async (scopeIds: number[], skip: number, take: number) => {
    return await prisma.post.findMany({
        skip: skip,
        take: take,
        where: {
            scopeId: { in: scopeIds }
        },
        select: {  // Changed from include to select for better performance
            id: true,
            description: true,
            type: true,
            scopeId: true,
            issuedById: true,
            issuedToId: true,
            createdAt: true,
            updatedAt: true,
            issuedBy: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            issuedTo: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            reactions: {
                select: {
                    postId: true,
                    reaction: true,
                    userId: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            values: {
                select: {
                    scopeValue: {
                        select: {
                            name: true,
                            description: true
                        }
                    }
                },
                orderBy: {
                    scopeValue: {
                        name: 'asc'
                    }
                }
            },
            scope: {
                select: {
                    id: true,
                    name: true,
                    parentScopeId: true,
                    parentScope: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
    });
};

const getCount = async (scopeIds: number[]) =>
    await prisma.post.count({
        where: {
            scopeId: { in: scopeIds }
        }
    });

type GetFeed = Prisma.PromiseReturnType<typeof getData>;

const mapDataToResponse = (data: GetFeed) => data.map(({ values, scope, reactions, ...rest }) => ({
    ...rest,
    values: values.map((value) => value.scopeValue.name) as string[],
    team: scope.parentScopeId ? { id: scope.id, name: scope.name } : undefined,
    reactions: mapPostReactionsToDto(reactions),
    space: !scope.parentScope
        ? { id: scope.id, name: scope.name }
        : { id: scope.parentScope.id, name: scope.parentScope.name },
}));

export type GetFeedDto = ReturnType<typeof mapDataToResponse>;

export const getFeed = async ({ scopeIds, skip, take }: GetFeedQuery): Promise<{ data: GetFeedDto, count: number; }> => {
    const [data, count] = await Promise.all([getData(scopeIds, skip, take), getCount(scopeIds)]);
    const feed = mapDataToResponse(data);

    return { data: feed, count };
};