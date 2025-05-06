import { ScopeValue } from '@prisma/client';
import prisma from '@/prisma/prisma';

interface UpsertScopeValueCommand {
  id?: number;
  scopeId: number;
  name: string;
  description: string;
}

export const upsertScopeValue = ({
  id,
  scopeId,
  name,
  description,
}: UpsertScopeValueCommand): Promise<ScopeValue> =>
  prisma.scopeValue.upsert({
    where: id ? { id } : { scopeId_name: { scopeId, name } },
    update: { name, description },
    create: { scopeId, name, description },
  });
