-- CreateTable
CREATE TABLE "TeamtjieToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamtjieToken_pkey" PRIMARY KEY ("id")
);
