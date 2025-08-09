'use client';

import { createContext, PropsWithChildren, useContext } from 'react';
import { UserWithRolesDto } from '@/prisma';

interface CurrentUserContextValue {
  isLoading: boolean;
  user?: UserWithRolesDto;
}

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  isLoading: false,
});

interface CurrentUserProviderProps extends PropsWithChildren {
  data?: UserWithRolesDto;
  isLoading: boolean;
}

export const CurrentUserProvider = ({
  children,
  data: user,
  isLoading,
}: CurrentUserProviderProps) => {
  return (
    <CurrentUserContext.Provider value={{ isLoading, user }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
