import {
  OptimizationTaskSignal,
  OptimizationTaskStatus,
} from "@prisma/client";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { prisma } from "../lib/prisma";
import { optimizeResumeWithGemini } from "../lib/optimize-resume";
import { runOptimizationWorkflow } from "../lib/optimization-workflow";
import { storeOptimizationResult } from "../lib/store-optimization-result";
import { optimizationStatusStream } from "./optimization-status";
import {
  optimizationPayloadSchema,
  optimizationStatusEventSchema,
} from "./optimization-schema";

export const optimizeResumeTask = schemaTask({
  id: "optimize-resume",
  schema: optimizationPayloadSchema,
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1_000,
    maxTimeoutInMs: 30_000,
    randomize: true,
  },
  run: async (input, { ctx }) => {
    const taskRecord = await prisma.optimizationTask.findFirst({
      where: { id: input.taskId, projectId: input.projectId },
      select: { id: true },
    });

    if (!taskRecord) {
      throw new Error("The optimization task does not match its profile.");
    }

    try {
      return await runOptimizationWorkflow(input, ctx.run.id, {
        updateTask: async (update) => {
          const data = {
            status: update.status,
            currentSignal: update.currentSignal,
            ...(update.runId === undefined ? {} : { runId: update.runId }),
            ...(update.resultBlobUrl === undefined
              ? {}
              : { resultBlobUrl: update.resultBlobUrl }),
          } satisfies {
            status: Exclude<OptimizationTaskStatus, "PENDING">;
            currentSignal: OptimizationTaskSignal;
            runId?: string;
            resultBlobUrl?: string;
          };

          await prisma.optimizationTask.update({
            where: { id: input.taskId, projectId: input.projectId },
            data,
          });
        },
        emitStatus: async (event) => {
          await optimizationStatusStream.append(
            optimizationStatusEventSchema.parse(event),
          );
        },
        optimizeResume: optimizeResumeWithGemini,
        storeResult: storeOptimizationResult,
      });
    } catch (error) {
      const attemptLimit = ctx.run.maxAttempts ?? 3;
      if (ctx.attempt.number >= attemptLimit) {
        const message =
          error instanceof Error ? error.message : "Optimization task failed.";

        await prisma.optimizationTask.update({
          where: { id: input.taskId, projectId: input.projectId },
          data: {
            status: OptimizationTaskStatus.FAILED,
            currentSignal: OptimizationTaskSignal.FAILED,
            executionError: message,
          },
        });
        await optimizationStatusStream.append({
          taskId: input.taskId,
          signal: "FAILED",
          status: "FAILED",
          occurredAt: new Date().toISOString(),
          error: message,
        });
      }

      throw error;
    }
  },
});
