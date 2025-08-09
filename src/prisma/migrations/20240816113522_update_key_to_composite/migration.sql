/*
  Warnings:

  - The primary key for the `UserNotificationPreference` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserNotificationPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserNotificationPreference" DROP CONSTRAINT "UserNotificationPreference_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserNotificationPreference_pkey" PRIMARY KEY ("userId", "type", "event");
