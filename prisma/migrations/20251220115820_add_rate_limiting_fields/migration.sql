-- AlterTable
ALTER TABLE "mock_endpoint" ADD COLUMN     "dailyRequestCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastRequestDate" TIMESTAMP(3);
