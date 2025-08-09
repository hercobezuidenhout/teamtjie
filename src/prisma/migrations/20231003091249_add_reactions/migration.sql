-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('FINE', 'PAYMENT');

-- AlterTable
ALTER TABLE "Fine" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Fine_id_seq";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Payment_id_seq";

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- Insert existing payments and fines
UPDATE "Payment"
SET "id" = "id" - 200;

INSERT INTO "Transaction" ("id", "type")
SELECT "id", 'PAYMENT'
FROM "Payment";

INSERT INTO "Transaction" ("id", "type")
SELECT "id", 'FINE'
FROM "Fine";

ALTER SEQUENCE "Transaction_id_seq" RESTART WITH 1000;

-- CreateTable
CREATE TABLE "Reaction" (
    "transactionId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("transactionId","userId","reaction")
);

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_id_fkey" FOREIGN KEY ("id") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_id_fkey" FOREIGN KEY ("id") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
