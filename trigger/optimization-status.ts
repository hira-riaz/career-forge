import { streams } from "@trigger.dev/sdk/v3";
import type { OptimizationStatusEvent } from "./optimization-schema";

export const optimizationStatusStream =
  streams.define<OptimizationStatusEvent>({
    id: "optimization-status",
  });
