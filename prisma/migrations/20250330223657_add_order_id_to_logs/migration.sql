/*
  Warnings:

  - Added the required column `orderId` to the `ErrorLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActionLog" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "ErrorLog" ADD COLUMN     "orderId" TEXT NOT NULL;
