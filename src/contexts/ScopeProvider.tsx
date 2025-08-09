'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from 'react';
import { useSpaceNavigation } from '@/lib/hooks/useSpaceNavigation';
import { Scope } from '@/models';
import { ScopeType } from '@prisma/client';
import { GetScopeValueDto } from '@/prisma';

interface ScopeContextValue {
  isError: boolean;
  isLoading: boolean;
  scopes: GetScopeValueDto[];
  current: {
    space: GetScopeValueDto;
    team: GetScopeValueDto | undefined;
    teams: GetScopeValueDto[];
    scope: Scope;
  };
  setCurrentScope: (scope: Scope) => void;
  getCurrentScope: (scopeId: number) => GetScopeValueDto | undefined;
}

const fallbackSpace: GetScopeValueDto = {
  id: 0,
  name: 'Loading...',
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  description: 'Loading',
  type: ScopeType.SPACE,
  parentScopeId: null,
  scopeValues: [],
  isPublic: false,
};

export const ScopeContext = createContext<ScopeContextValue>({
  isError: true,
  isLoading: false,
  scopes: [],
  current: {
    space: fallbackSpace,
    team: undefined,
    teams: [],
    scope: { scopeType: 'SPACE', scopeId: fallbackSpace.id },
  },
  setCurrentScope: () => fallbackSpace,
  getCurrentScope: () => fallbackSpace,
});

const getScope = (
  scopes: GetScopeValueDto[],
  scopeId: number
): GetScopeValueDto | undefined => scopes.find((scope) => scope.id === scopeId);

export interface ScopeProviderProps extends PropsWithChildren {
  data?: GetScopeValueDto[];
  isError: boolean;
  isLoading: boolean;
}

export const ScopeProvider = ({
  children,
  data: scopes = [],
  isError,
  isLoading,
}: ScopeProviderProps) => {
  const [{ spaceId, teamId }, navigateTo] = useSpaceNavigation();

  const space: GetScopeValueDto = spaceId
    ? getScope(scopes, spaceId) ?? fallbackSpace
    : fallbackSpace;

  const team = teamId ? getScope(scopes, teamId) : undefined;

  const scope: Scope = team
    ? { scopeType: 'TEAM', scopeId: team.id }
    : { scopeType: 'SPACE', scopeId: space.id };

  const teams =
    scopes?.filter((scope) => scope.parentScopeId === spaceId) ?? [];

  const setCurrentScope = useCallback(
    (scope: Scope) => {
      switch (scope.scopeType) {
        case 'SPACE':
          const space = getScope(scopes, scope.scopeId);
          return navigateTo({ spaceId: space?.id });
        case 'TEAM':
          const team = getScope(scopes, scope.scopeId);
          return navigateTo({
            spaceId: team?.parentScopeId ?? undefined,
            teamId: team?.id,
          });
      }
    },
    [navigateTo, scopes]
  );

  const getCurrentScope = (scopeId: number) => getScope(scopes, scopeId);

  return (
    <ScopeContext.Provider
      value={{
        scopes,
        isError,
        isLoading,
        current: { space, team, teams, scope },
        setCurrentScope,
        getCurrentScope,
      }}
    >
      {children}
    </ScopeContext.Provider>
  );
};

export const useScopes = () => useContext(ScopeContext);
