import fs from "node:fs";
import { defineConfig } from "@playwright/test";

// The test runner is not a Next process — `next start` loads .env.local on
// its own, but the specs (and resetStore's service-role client) need the
// same values in the runner/workers. Parse it without overriding real env.
if (fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    const val = (m[2] ?? "").replace(/^["']|["']$/g, "");
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  retries: 1,
  use: {
    // the demo's laptop width; the projector (1920) and phone (390) checks run
    // in the dry-run sweep (plan Task 17)
    baseURL: "http://localhost:3000",
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium", video: { mode: "on", size: { width: 1440, height: 900 } } },
    },
  ],
  outputDir: "test-results",
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000/dashboard",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
