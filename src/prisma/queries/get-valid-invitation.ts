import { addHours } from 'date-fns';
import prisma from '@/prisma/prisma';
import { RoleType } from '@prisma/client';

interface GetValidInvitationQuery {
  userId: string;
  scopeId: number;
  defaultRole: string;
}

export const getValidInvitation = async ({
  userId,
  scopeId,
  defaultRole,
}: GetValidInvitationQuery) => {
  return await prisma.invitation.findFirst({
    where: {
      createdByUserId: userId,
      expiresAt: { gte: addHours(new Date(), 1) },
      scopeId: scopeId,
      defaultRole: defaultRole as RoleType,
    },
  });
};
