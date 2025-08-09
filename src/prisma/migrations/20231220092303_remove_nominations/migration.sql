/*
  Warnings:

  - You are about to drop the `Nomination` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Nomination" DROP CONSTRAINT "Nomination_userId_fkey";

-- DropForeignKey
ALTER TABLE "Nomination" DROP CONSTRAINT "Nomination_winId_fkey";

-- DropTable
DROP TABLE "Nomination";
