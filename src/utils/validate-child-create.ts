import {
  AbilitiesApiRequest,
  DescriptiveHttpException,
} from '@/models';
import { getChildScopes, getScope } from '@/prisma';
import { subject } from '@casl/ability';
import { UnauthorizedException } from 'next-api-decorators';

export const validateChildCreate = async (
  req: AbilitiesApiRequest,
  parentScopeId: number,
  name: string
) => {
  if (!req.abilities.can('read', subject('Scope', { id: parentScopeId }))) {
    throw new UnauthorizedException();
  }

  const space = await getScope(parentScopeId);
  const { data: teams } = await getChildScopes({
    parentScopeId: parentScopeId,
    skip: 0,
    take: 100,
    userId: req.userId,
  });

  if (!space) {
    throw new DescriptiveHttpException(
      404,
      'Could not create team',
      `Could not create a new team for space with id' ${parentScopeId}' because a space with that id does not exist`
    );
  }

  if (teams.some((team) => team.name === name)) {
    throw new DescriptiveHttpException(
      409,
      'Team already exists',
      `A team with the name '${name}' is already registered`
    );
  }
};
