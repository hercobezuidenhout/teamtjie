'use client';

import { abilities } from '@/permissions/abilities';
import { usePermissionsQuery } from '@/services/permissions/queries/use-permissions-query';
import { AnyAbility, defineAbility } from '@casl/ability';
import { createContext, PropsWithChildren, useContext } from 'react';

const defaultAbility = defineAbility((_, cannot) => cannot('manage', 'all'));

export const AbilityContext = createContext<AnyAbility>(defaultAbility);

export const AbilityContextProvider = ({ children }: PropsWithChildren) => {
  const { data: roles } = usePermissionsQuery();
  const permissions = abilities(roles?.roles ?? [], roles?.scopeRoles ?? []);

  return (
    <AbilityContext.Provider value={permissions}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbilities = () => useContext(AbilityContext);
