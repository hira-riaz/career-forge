import { defineConfig } from "@trigger.dev/sdk/v3";

const project = process.env.TRIGGER_PROJECT_REF;
if (!project) {
  throw new Error("TRIGGER_PROJECT_REF must be set to run Trigger.dev tasks.");
}

export default defineConfig({
  project,
  dirs: ["./trigger"],
  runtime: "node-22",
  maxDuration: 3600,
});
