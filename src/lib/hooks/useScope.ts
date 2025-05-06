import { useSpaceNavigation } from '@/lib/hooks/useSpaceNavigation';
import { Scope } from '@/models';

export const useScope = (): Scope => {
  const [{ spaceId, teamId }] = useSpaceNavigation();

  if (teamId) {
    return { scopeType: 'TEAM', scopeId: teamId };
  }

  return { scopeType: 'SPACE', scopeId: spaceId ?? 0 };
};
