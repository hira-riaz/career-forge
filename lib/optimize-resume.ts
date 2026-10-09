import { generateText, stepCountIs, tool } from "ai";
import { google } from "@ai-sdk/google";
import {
  optimizedResumeSchema,
  type OptimizedResume,
  type OptimizationPayload,
} from "../trigger/optimization-schema";

export async function optimizeResumeWithGemini(
  input: OptimizationPayload,
): Promise<OptimizedResume> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is required.");
  }

  const result = await generateText({
    model: google("gemini-2.5-flash"),
    system:
      "Tailor the experience snapshot to the target job description. Preserve factual accuracy, do not invent experience, and submit the final result using the submitOptimizedResume tool.",
    prompt: [
      "Target job description:",
      input.targetJobDescription,
      "",
      "Complete experience snapshot (JSON):",
      JSON.stringify(input.experienceSnapshot),
    ].join("\n"),
    tools: {
      submitOptimizedResume: tool({
        description:
          "Submit the complete optimized resume and a concise change summary.",
        inputSchema: optimizedResumeSchema,
        strict: true,
      }),
    },
    toolChoice: {
      type: "tool",
      toolName: "submitOptimizedResume",
    },
    stopWhen: stepCountIs(1),
    maxRetries: 2,
  });

  const toolCall = result.toolCalls.find(
    (call) => call.toolName === "submitOptimizedResume",
  );

  if (!toolCall) {
    throw new Error("Gemini did not return the required resume tool call.");
  }

  return optimizedResumeSchema.parse(toolCall.input);
}
