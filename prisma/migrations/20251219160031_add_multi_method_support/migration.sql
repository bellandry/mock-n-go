-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD');

-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('JSON', 'XML', 'TEXT', 'HTML', 'BINARY');

-- CreateTable
CREATE TABLE "mock_config" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "basePath" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),

    CONSTRAINT "mock_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_endpoint" (
    "id" TEXT NOT NULL,
    "mockConfigId" TEXT NOT NULL,
    "method" "HttpMethod" NOT NULL,
    "responseType" "ResponseType" NOT NULL DEFAULT 'JSON',
    "statusCode" INTEGER NOT NULL DEFAULT 200,
    "fields" JSONB,
    "count" INTEGER DEFAULT 10,
    "pagination" BOOLEAN NOT NULL DEFAULT true,
    "requestSchema" JSONB,
    "responseSchema" JSONB,
    "randomErrors" BOOLEAN NOT NULL DEFAULT false,
    "errorRate" INTEGER NOT NULL DEFAULT 0,
    "delay" INTEGER,
    "customResponse" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mock_endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mock_config_organizationId_idx" ON "mock_config"("organizationId");

-- CreateIndex
CREATE INDEX "mock_config_createdById_idx" ON "mock_config"("createdById");

-- CreateIndex
CREATE INDEX "mock_config_isActive_idx" ON "mock_config"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "mock_config_organizationId_basePath_key" ON "mock_config"("organizationId", "basePath");

-- CreateIndex
CREATE INDEX "mock_endpoint_mockConfigId_idx" ON "mock_endpoint"("mockConfigId");

-- CreateIndex
CREATE INDEX "mock_endpoint_method_idx" ON "mock_endpoint"("method");

-- CreateIndex
CREATE UNIQUE INDEX "mock_endpoint_mockConfigId_method_key" ON "mock_endpoint"("mockConfigId", "method");

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_config" ADD CONSTRAINT "mock_config_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_config" ADD CONSTRAINT "mock_config_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_endpoint" ADD CONSTRAINT "mock_endpoint_mockConfigId_fkey" FOREIGN KEY ("mockConfigId") REFERENCES "mock_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;
