import {
  OptimizationTaskSignal,
  OptimizationTaskStatus,
} from "@prisma/client";
import type {
  OptimizedResume,
  OptimizationPayload,
  OptimizationSignal,
  OptimizationStatusEvent,
} from "../trigger/optimization-schema";

export interface OptimizationWorkflowDependencies {
  updateTask: (update: {
    status: Exclude<OptimizationTaskStatus, "PENDING">;
    currentSignal: OptimizationTaskSignal;
    runId?: string;
    resultBlobUrl?: string;
  }) => Promise<void>;
  emitStatus: (event: OptimizationStatusEvent) => Promise<void>;
  optimizeResume: (input: OptimizationPayload) => Promise<OptimizedResume>;
  storeResult: (
    taskId: string,
    result: OptimizedResume,
  ) => Promise<string>;
}

export async function runOptimizationWorkflow(
  input: OptimizationPayload,
  runId: string,
  dependencies: OptimizationWorkflowDependencies,
): Promise<{ resultBlobUrl: string }> {
  const report = async (
    signal: OptimizationSignal,
    update: Parameters<OptimizationWorkflowDependencies["updateTask"]>[0],
    eventData: Pick<OptimizationStatusEvent, "resultBlobUrl" | "error"> = {},
  ): Promise<void> => {
    await dependencies.updateTask(update);
    await dependencies.emitStatus({
      taskId: input.taskId,
      signal,
      status: update.status,
      occurredAt: new Date().toISOString(),
      ...eventData,
    });
  };

  await report(
    "STARTING",
    {
      status: "COMPUTING",
      currentSignal: "STARTING",
      runId,
    },
  );

  await report("OPTIMIZING_RESUME", {
    status: "COMPUTING",
    currentSignal: "OPTIMIZING_RESUME",
  });

  const optimizedResume = await dependencies.optimizeResume(input);

  await report("FINALIZING_METADATA", {
    status: "COMPUTING",
    currentSignal: "FINALIZING_METADATA",
  });

  const resultBlobUrl = await dependencies.storeResult(
    input.taskId,
    optimizedResume,
  );

  await report(
    "COMPLETE",
    {
      status: "SUCCESS",
      currentSignal: "COMPLETE",
      resultBlobUrl,
    },
    { resultBlobUrl },
  );

  return { resultBlobUrl };
}
