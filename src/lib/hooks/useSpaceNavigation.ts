import { Scope } from '@/models';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface SpaceNavigationIdentifier {
  spaceId?: number;
  teamId?: number;
}

export type SpaceNavigationValue = [
  SpaceNavigationIdentifier & { scope: Scope | undefined; },
  (target: SpaceNavigationIdentifier) => void,
];

const toScope = (identifier: SpaceNavigationIdentifier): Scope | undefined => {
  if (identifier.teamId) {
    return { scopeType: 'TEAM', scopeId: identifier.teamId };
  }

  return identifier.spaceId
    ? { scopeType: 'SPACE', scopeId: identifier.spaceId }
    : undefined;
};

export const useSpaceNavigation = (): SpaceNavigationValue => {
  const router = useRouter();
  const { spaceId, teamId } = useParams() ?? {};

  const parseId = (id: string | string[] | undefined) =>
    id && !Array.isArray(id) ? Number.parseInt(id) : undefined;
  const navigateTo = useCallback(
    (target: SpaceNavigationIdentifier) => {
      switch (true) {
        case !!target.teamId && !!target.spaceId:
          return router.push(
            `/spaces/${target.spaceId}/teams/${target.teamId}`
          );
        case !!target.spaceId:
          return router.push(`/spaces/${target.spaceId}`);
        default:
          return router.push(`/spaces`);
      }
    },
    [router]
  );

  const identifier = { spaceId: parseId(spaceId), teamId: parseId(teamId) };

  return [{ ...identifier, scope: toScope(identifier) }, navigateTo];
};
