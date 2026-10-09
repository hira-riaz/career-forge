CREATE TYPE "OptimizationTaskSignal" AS ENUM (
  'STARTING',
  'OPTIMIZING_RESUME',
  'FINALIZING_METADATA',
  'COMPLETE',
  'FAILED'
);

ALTER TABLE "OptimizationTask"
ADD COLUMN "currentSignal" "OptimizationTaskSignal",
ADD COLUMN "resultBlobUrl" TEXT;
