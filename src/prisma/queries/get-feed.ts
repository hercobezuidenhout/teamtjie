import { PaginatedApiRequest } from "@/models";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";
import { mapPostReactionsToDto } from "../utils";

interface GetFeedQuery extends Pick<PaginatedApiRequest, 'skip' | 'take'> {
    scopeIds: number[];
    userId: string;
}

const getData = async (scopeIds: number[], skip: number, take: number, userId: string) => {
    const paidFines = await prisma.paidFine.findMany({
        where: {
            userId: userId
        }
    });

    return await prisma.post.findMany({
        skip: skip,
        take: take,
        where: {
            scopeId: { in: scopeIds },
            id: { notIn: paidFines.map(paidFine => paidFine.fineId) }
        },
        include: {
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
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
            },
            values: {
                include: {
                    scopeValue: {
                        select: {
                            name: true,
                            description: true
                        }
                    },
                },
                orderBy: {
                    scopeValue: {
                        name: 'asc'
                    }
                },
            },
            scope: {
                include: {
                    parentScope: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
            },
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

export const getFeed = async ({ scopeIds, skip, take, userId }: GetFeedQuery): Promise<{ data: GetFeedDto, count: number; }> => {
    const [data, count] = await Promise.all([getData(scopeIds, skip, take, userId), getCount(scopeIds)]);
    const feed = mapDataToResponse(data);

    return { data: feed, count };
};