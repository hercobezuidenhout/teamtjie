import { PaginatedApiRequest } from '@/models';
import prisma from '@/prisma/prisma';
import { Prisma, ScopeType } from '@prisma/client';

interface GetUsersQuery extends Pick<PaginatedApiRequest, 'skip' | 'take'> {
  scopeId: number;
  scopeType: string;
  userId: string;
  filter?: string;
}

const getWhere = ({
  userId,
  scopeId,
  scopeType,
  filter
}: GetUsersQuery): Prisma.UserWhereInput => {
  const scopeFilter = {
    roles: {
      some: {
        scope: {
          id: scopeId,
          roles: { some: { userId } },
          type: scopeType == 'SPACE' ? ScopeType.SPACE : ScopeType.TEAM
        },
      },
    },
  };

  const mode: Prisma.QueryMode = 'insensitive';
  const nameFilter = filter
    ? {
      OR: [
        {
          name: {
            contains: filter,
            mode,
          },
        },
        {
          email: {
            contains: filter,
            mode,
          },
        },
      ],
    }
    : {};

  const where = {
    ...scopeFilter,
    ...nameFilter,
  };

  return where;
};

const getData = (query: GetUsersQuery) =>
  prisma.user.findMany({
    skip: query.skip,
    take: query.take,
    where: getWhere(query),
    orderBy: { name: 'asc' },
    include: {
      roles: {
        where: {
          scopeId: query.scopeId,
        },
      },
    },
  });

const getCount = async (query: GetUsersQuery) =>
  prisma.user.count({ where: getWhere(query) });

export type GetUserListDto = Prisma.PromiseReturnType<
  typeof getData
> extends readonly (infer T)[]
  ? T
  : never;

export const getUsers = async (
  query: GetUsersQuery
): Promise<{
  data: GetUserListDto[];
  count: number;
}> => {
  const [data, count] = await Promise.all([getData(query), getCount(query)]);

  return { data, count };
};
