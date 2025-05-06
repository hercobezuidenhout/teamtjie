import prisma from '@/prisma/prisma';
import { RoleType } from '@prisma/client';

export interface CreateRoleCommand {
  userId: string;
  scopeId: number;
  role: RoleType;
}

export const createRole = async (command: CreateRoleCommand) => {
  return await prisma.scopeRole.create({
    data: command,
  });
};
