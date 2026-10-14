import { defineConfig } from "@playwright/test";

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
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000/dashboard",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
