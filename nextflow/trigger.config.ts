// // trigger.config.ts
// // Trigger.dev project configuration
// // TRIGGER_SECRET_KEY = {ENTER YOUR TRIGGER.DEV SECRET KEY} — set in .env.local

// import { defineConfig } from "@trigger.dev/sdk/v3";

// export default defineConfig({
//   project: "proj_ksdfdtxdqamskwqdljxg",
//   // Find your project ref at: https://cloud.trigger.dev → your project → Settings
//   runtime: "node",
//   logLevel: "log",
//   retries: {
//     enabledInDev: false,
//     default: {
//       maxAttempts: 2,
//       minTimeoutInMs: 1000,
//       maxTimeoutInMs: 10000,
//       factor: 2,
//     },
//   },
//   dirs: ["./trigger"],
// });

import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_ksdfdtxdqamskwqdljxg",
  dirs: ["./trigger"],
  maxDuration: 300,
});