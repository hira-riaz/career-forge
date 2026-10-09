import { z } from "zod";

const experienceSnapshotSchema = z.union([
  z.record(z.string(), z.json()),
  z.array(z.json()),
]);

export const optimizationPayloadSchema = z.object({
  taskId: z.string().min(1),
  projectId: z.string().min(1),
  targetJobDescription: z.string().refine((value) => value.trim().length > 0, {
    message: "Target job description must not be empty.",
  }),
  experienceSnapshot: experienceSnapshotSchema,
});

export const optimizedResumeSchema = z.object({
  optimizedResumeText: z.string().min(1),
  changeSummary: z.string().min(1),
});

export const optimizationSignalSchema = z.enum([
  "STARTING",
  "OPTIMIZING_RESUME",
  "FINALIZING_METADATA",
  "COMPLETE",
  "FAILED",
]);

export const optimizationStatusEventSchema = z.object({
  taskId: z.string().min(1),
  signal: optimizationSignalSchema,
  status: z.enum(["COMPUTING", "SUCCESS", "FAILED"]),
  occurredAt: z.string().datetime(),
  resultBlobUrl: z.string().url().optional(),
  error: z.string().optional(),
});

export type OptimizationPayload = z.infer<typeof optimizationPayloadSchema>;
export type OptimizedResume = z.infer<typeof optimizedResumeSchema>;
export type OptimizationSignal = z.infer<typeof optimizationSignalSchema>;
export type OptimizationStatusEvent = z.infer<
  typeof optimizationStatusEventSchema
>;
