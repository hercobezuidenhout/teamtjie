import { ScopeLink } from '@prisma/client';
import prisma from '@/prisma/prisma';

interface UpsertScopeLinkCommand {
  id?: number;
  scopeId: number;
  url: string;
  title: string;
  isPublic: boolean;
}

export const upsertScopeLink = ({
  id,
  scopeId,
  url,
  title,
  isPublic,
}: UpsertScopeLinkCommand): Promise<ScopeLink> =>
  prisma.scopeLink.upsert({
    where: id ? { id } : { scopeId_url: { scopeId, url } },
    update: { url, title, isPublic },
    create: { scopeId, url, title, isPublic },
  });
