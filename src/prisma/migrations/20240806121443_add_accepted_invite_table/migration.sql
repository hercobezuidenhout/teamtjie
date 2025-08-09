-- CreateTable
CREATE TABLE "AcceptedInvite" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitationId" INTEGER NOT NULL,

    CONSTRAINT "AcceptedInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcceptedInvite" ADD CONSTRAINT "AcceptedInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptedInvite" ADD CONSTRAINT "AcceptedInvite_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
