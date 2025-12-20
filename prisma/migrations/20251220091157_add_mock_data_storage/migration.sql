-- CreateTable
CREATE TABLE "mock_data" (
    "id" TEXT NOT NULL,
    "mockConfigId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mock_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mock_data_mockConfigId_idx" ON "mock_data"("mockConfigId");

-- CreateIndex
CREATE INDEX "mock_data_mockConfigId_resourceId_idx" ON "mock_data"("mockConfigId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "mock_data_mockConfigId_resourceId_key" ON "mock_data"("mockConfigId", "resourceId");

-- AddForeignKey
ALTER TABLE "mock_data" ADD CONSTRAINT "mock_data_mockConfigId_fkey" FOREIGN KEY ("mockConfigId") REFERENCES "mock_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;
