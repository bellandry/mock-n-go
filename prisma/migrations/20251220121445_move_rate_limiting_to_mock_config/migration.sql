/*
  Warnings:

  - You are about to drop the column `dailyRequestCount` on the `mock_endpoint` table. All the data in the column will be lost.
  - You are about to drop the column `lastRequestDate` on the `mock_endpoint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mock_config" ADD COLUMN     "dailyRequestCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastRequestDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "mock_endpoint" DROP COLUMN "dailyRequestCount",
DROP COLUMN "lastRequestDate";
