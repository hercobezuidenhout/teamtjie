'use client';

import { FeatureFlag } from '@prisma/client';
import * as R from 'ramda';
import { createContext, PropsWithChildren, useContext } from 'react';

export type FeatureFlagValue = string | Date | number | boolean;

export type FeatureFlags = Record<string, FeatureFlagValue>;

interface FeatureFlagContextValue {
  isLoading: boolean;
  featureFlags: FeatureFlags;
}

export const FeatureFlagContext = createContext<FeatureFlagContextValue>({
  isLoading: false,
  featureFlags: {},
});

const deserialiseFlagValue = (flag: FeatureFlag): FeatureFlagValue => {
  switch (flag.type) {
    case 'STRING':
      return flag.value;
    case 'DATE':
      return new Date(flag.value);
    case 'INT':
      return Number.parseInt(flag.value);
    case 'BOOLEAN':
      return flag.value.toLowerCase() === 'true';
    default:
      return false;
  }
};

interface FeatureFlagProviderProps extends PropsWithChildren {
  data?: FeatureFlag[];
  isLoading: boolean;
}

export const FeatureFlagProvider = ({
  children,
  data = [],
  isLoading,
}: FeatureFlagProviderProps) => {
  const featureFlags = R.fromPairs(
    data.map((flag) => [flag.name, deserialiseFlagValue(flag)])
  );

  return (
    <FeatureFlagContext.Provider value={{ featureFlags, isLoading }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => useContext(FeatureFlagContext);

export const FeatureFlagNames = {
  enablePasswordLogin: 'ENABLE_PASSWORD_LOGIN' as const,
};

type FeatureFlagNames =
  (typeof FeatureFlagNames)[keyof typeof FeatureFlagNames];

export const useFeatureFlag = <T extends FeatureFlagValue>(
  featureFlag: FeatureFlagNames
) => {
  const { featureFlags } = useFeatureFlags();

  return featureFlags[featureFlag] as T;
};
