import prisma from "../prisma";

export const createAcceptedInvite = async (userId, invitationId) => {
  await prisma.acceptedInvite.create({
    data: {
      userId,
      invitationId,
    },
  });
}
