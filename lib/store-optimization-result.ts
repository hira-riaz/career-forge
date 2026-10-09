import { put } from "@vercel/blob";
import type { OptimizedResume } from "../trigger/optimization-schema";

export async function storeOptimizationResult(
  taskId: string,
  result: OptimizedResume,
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required.");
  }

  const blob = await put(
    `optimization-tasks/${taskId}/optimized-resume.json`,
    JSON.stringify(result),
    {
      access: "private",
      allowOverwrite: true,
      contentType: "application/json",
    },
  );

  return blob.url;
}
