import prisma from '@/prisma/prisma';
import { Invitation, Scope } from '@prisma/client';

export const getInvitationByHash = async (
  hash: string
): Promise<Invitation & { scope: Scope; } | null> => {

  return await prisma.invitation.findFirst({
    where: { hash },
    include: {
      scope: true
    }
  });
};
