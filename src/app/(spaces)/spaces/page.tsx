import { getSession } from '@/app/utils';
import { redirect } from 'next/navigation';
import { getScopes } from '@/prisma';
import { ScopeType } from '@prisma/client';

const SpacesPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const scopes = await getScopes(session.user.id);
  const space = scopes?.find((x) => x.type === ScopeType.SPACE);

  if (space) {
    redirect(`/spaces/${space.id}`);
  } else {
    redirect('/spaces/create');
  }
};

export default SpacesPage;
