-- CreateEnum
CREATE TYPE "OptimizationTaskStatus" AS ENUM ('PENDING', 'COMPUTING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "documentTextRecordLink" TEXT,
    "experienceIndex" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "structuralMetadata" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptimizationTask" (
    "id" TEXT NOT NULL,
    "status" "OptimizationTaskStatus" NOT NULL DEFAULT 'PENDING',
    "executionError" TEXT,
    "projectId" TEXT NOT NULL,
    "runId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptimizationTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_ownerId_key" ON "UserProfile"("ownerId");

-- CreateIndex
CREATE INDEX "UserProfile_ownerId_createdAt_idx" ON "UserProfile"("ownerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "OptimizationTask_projectId_createdAt_idx" ON "OptimizationTask"("projectId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "OptimizationTask_runId_idx" ON "OptimizationTask"("runId");

-- AddForeignKey
ALTER TABLE "OptimizationTask" ADD CONSTRAINT "OptimizationTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
