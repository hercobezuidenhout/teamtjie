import prisma from '@/prisma/prisma';
import { FeatureFlag, Prisma, ScopeType } from '@prisma/client';

export const applyOverrides = (flag: FeatureFlagResult): FeatureFlag => {
  let valueOverride: string | undefined = undefined;
  const teamOverride = flag.overrides.find(
    (override) => override.scope.type === ScopeType.TEAM
  );
  const spaceOverride = flag.overrides.find(
    (override) => override.scope.type === ScopeType.SPACE
  );

  if (spaceOverride) {
    valueOverride = spaceOverride.value;
  }

  if (teamOverride) {
    valueOverride = teamOverride.value;
  }

  return {
    id: flag.id,
    name: flag.name,
    type: flag.type,
    value: valueOverride ?? flag.value,
  };
};

const getData = async (userId?: string) =>
  prisma.featureFlag.findMany({
    include: {
      overrides: {
        include: { scope: true },
        where: userId
          ? { scope: { roles: { some: { userId: userId } } } }
          : { scopeId: -1 },
      },
    },
  });

type FeatureFlagResult = Prisma.PromiseReturnType<
  typeof getData
> extends readonly (infer T)[]
  ? T
  : never;

type GetFeatureFlagDto = ReturnType<typeof applyOverrides>;

export const getFeatureFlags = async (
  userId?: string
): Promise<GetFeatureFlagDto[]> => {
  const flags = await getData(userId);
  return flags.map(applyOverrides);
};
