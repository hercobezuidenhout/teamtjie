-- CreateTable
CREATE TABLE "PaidFine" (
    "paymentId" INTEGER NOT NULL,
    "fineId" INTEGER NOT NULL,

    CONSTRAINT "PaidFine_pkey" PRIMARY KEY ("paymentId","fineId")
);
