import assert from "node:assert/strict";
import test from "node:test";
import {
  OptimizationTaskSignal,
  OptimizationTaskStatus,
} from "@prisma/client";
import {
  optimizationPayloadSchema,
  type OptimizationPayload,
  type OptimizationStatusEvent,
} from "../trigger/optimization-schema";
import { runOptimizationWorkflow } from "../lib/optimization-workflow";

const payload: OptimizationPayload = {
  taskId: "task_test",
  projectId: "profile_test",
  targetJobDescription: "Senior Engineer\nRequirements:\n- TypeScript\n- Systems",
  experienceSnapshot: {
    roles: [{ title: "Engineer", achievements: ["Built a compiler"] }],
  },
};

test("validates and preserves multiline job descriptions and JSON snapshots", () => {
  const parsed = optimizationPayloadSchema.parse(payload);

  assert.equal(parsed.targetJobDescription, payload.targetJobDescription);
  assert.deepEqual(parsed.experienceSnapshot, payload.experienceSnapshot);
});

test("rejects empty target descriptions and non-JSON snapshot payloads", () => {
  assert.equal(
    optimizationPayloadSchema.safeParse({
      ...payload,
      targetJobDescription: " \n ",
    }).success,
    false,
  );
  assert.equal(
    optimizationPayloadSchema.safeParse({
      ...payload,
      experienceSnapshot: BigInt(1),
    }).success,
    false,
  );
});

test("persists each atomic state transition and streams the worker lifecycle", async () => {
  const updates: Array<{
    status: Exclude<OptimizationTaskStatus, "PENDING">;
    currentSignal: OptimizationTaskSignal;
    runId?: string;
    resultBlobUrl?: string;
  }> = [];
  const events: OptimizationStatusEvent[] = [];
  let storedResult: string | undefined;

  const result = await runOptimizationWorkflow(payload, "run_test", {
    updateTask: async (update) => {
      updates.push(update);
    },
    emitStatus: async (event) => {
      events.push(event);
    },
    optimizeResume: async () => ({
      optimizedResumeText: "Optimized resume",
      changeSummary: "Aligned skills to the role",
    }),
    storeResult: async (taskId, optimizedResume) => {
      storedResult = `${taskId}:${optimizedResume.optimizedResumeText}`;
      return "https://blob.example/private/result.json";
    },
  });

  assert.equal(storedResult, "task_test:Optimized resume");
  assert.deepEqual(
    updates.map((update) => update.currentSignal),
    [
      OptimizationTaskSignal.STARTING,
      OptimizationTaskSignal.OPTIMIZING_RESUME,
      OptimizationTaskSignal.FINALIZING_METADATA,
      OptimizationTaskSignal.COMPLETE,
    ],
  );
  assert.equal(updates[0].runId, "run_test");
  assert.equal(updates.at(-1)?.status, OptimizationTaskStatus.SUCCESS);
  assert.equal(updates.at(-1)?.resultBlobUrl, result.resultBlobUrl);
  assert.deepEqual(
    events.map((event) => event.signal),
    ["STARTING", "OPTIMIZING_RESUME", "FINALIZING_METADATA", "COMPLETE"],
  );
});
