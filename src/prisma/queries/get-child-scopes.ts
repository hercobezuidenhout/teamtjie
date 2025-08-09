import { PaginatedApiRequest } from '@/models';
import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

interface GetChildScopesQuery extends Pick<PaginatedApiRequest, 'skip' | 'take'> {
  parentScopeId: number;
  userId: string;
  filter?: string;
}

const orderBy: Prisma.ScopeOrderByWithRelationInput = { name: 'asc' };

const getWhere = ({
  filter,
  parentScopeId,
  userId,
}: GetChildScopesQuery): Prisma.ScopeWhereInput => {
  const nameFilter = filter
    ? {
      name: {
        contains: filter,
        mode: Prisma.QueryMode.insensitive,
      },
    }
    : {};

  return { parentScopeId, roles: { some: { userId } }, ...nameFilter };
};

const getData = (query: GetChildScopesQuery) =>
  prisma.scope.findMany({
    where: getWhere(query),
    skip: query.skip,
    take: query.take,
    select: {
      id: true,
      image: true,
      name: true,
      isPublic: true,
      _count: {
        select: { roles: true },
      },
    },
    orderBy,
  });

const getCount = (query: GetChildScopesQuery): Promise<number> =>
  prisma.scope.count({ where: getWhere(query), orderBy });

export type GetChildScopeDto = Prisma.PromiseReturnType<
  typeof getData
> extends readonly (infer T)[]
  ? T
  : never;

export const getChildScopes = async (
  query: GetChildScopesQuery
): Promise<{
  data: GetChildScopeDto[];
  count: number;
}> => {
  const [data, count] = await Promise.all([getData(query), getCount(query)]);

  return { data, count };
};
