-- CreateTable
CREATE TABLE "DeactivateUser" (
    "id" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "DeactivateUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeactivateUser_email_key" ON "DeactivateUser"("email");
