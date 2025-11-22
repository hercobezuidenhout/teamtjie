'use client';

import { AbilityContextProvider } from '@/contexts/AbilityContextProvider';
import { MenuProvider } from '@/contexts/MenuProvider';
import { PropsWithChildren } from 'react';
import { useScopesQuery } from '@/services/scope/queries/use-scopes-query';
import { useCurrentUserQuery } from '@/services/user/queries/use-current-user-query';
import { ScopeProvider } from '@/contexts/ScopeProvider';
import { CurrentUserProvider } from '@/contexts/CurrentUserProvider';

export const SpacesProviders = ({ children }: PropsWithChildren) => {
  const scopes = useScopesQuery();
  const currentUser = useCurrentUserQuery();

  return (
    <ScopeProvider {...scopes}>
      <CurrentUserProvider {...currentUser}>
        <AbilityContextProvider>
          <MenuProvider>{children}</MenuProvider>
        </AbilityContextProvider>
      </CurrentUserProvider>
    </ScopeProvider>
  );
};
