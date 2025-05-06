import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

const getData = (id: number) =>
  prisma.scope.findFirstOrThrow({
    include: {
      _count: {
        select: {
          roles: {
            where: {
              scopeId: id,
            },
          },
        },
      },
    },
    where: { id },
  });

type GetScopeProfile = Prisma.PromiseReturnType<typeof getData>;

const mapToDto = ({ _count, ...rest }: GetScopeProfile) => ({
  ...rest,
  memberCount: _count.roles,
});

export type GetScopeProfileDto = ReturnType<typeof mapToDto>;

export const getScopeProfile = async (
  id: number
): Promise<GetScopeProfileDto> => {
  const data = await getData(id);
  return mapToDto(data);
};
