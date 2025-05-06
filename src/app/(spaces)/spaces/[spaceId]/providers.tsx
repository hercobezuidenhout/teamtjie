'use client';

import { AbilityContextProvider } from '@/contexts/AbilityContextProvider';
import { MenuProvider } from '@/contexts/MenuProvider';
import { PropsWithChildren } from 'react';
import { useFeatureFlagsQuery } from '@/services/feature-flags/queries/use-feature-flags-query';
import { useScopesQuery } from '@/services/scope/queries/use-scopes-query';
import { useCurrentUserQuery } from '@/services/user/queries/use-current-user-query';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagProvider';
import { ScopeProvider } from '@/contexts/ScopeProvider';
import { CurrentUserProvider } from '@/contexts/CurrentUserProvider';

export const SpacesProviders = ({ children }: PropsWithChildren) => {
  const featureFlags = useFeatureFlagsQuery();
  const scopes = useScopesQuery();
  const currentUser = useCurrentUserQuery();

  return (
    <FeatureFlagProvider {...featureFlags}>
      <ScopeProvider {...scopes}>
        <CurrentUserProvider {...currentUser}>
          <AbilityContextProvider>
            <MenuProvider>{children}</MenuProvider>
          </AbilityContextProvider>
        </CurrentUserProvider>
      </ScopeProvider>
    </FeatureFlagProvider>
  );
};
