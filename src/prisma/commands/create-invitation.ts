import { v4 as uuidv4 } from 'uuid';
import prisma from '@/prisma/prisma';
import { RoleType } from '@prisma/client';

export interface CreateInvitationCommand {
  createdByUserId: string;
  expiresAt: Date;
  scopeId: number;
  defaultRole: RoleType;
}

export const createInvitation = async (command: CreateInvitationCommand) => {
  return await prisma.invitation.create({
    data: {
      ...command,
      hash: uuidv4(),
    },
  });
};
