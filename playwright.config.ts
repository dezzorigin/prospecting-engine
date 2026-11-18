import { defineConfig, devices } from "@playwright/test";

// PE_CHROME_PATH: dipakai lokal di VM (browser Playwright yang sudah
// ter-cache); di CI tidak di-set — `npx playwright install chromium`
// yang mengunduhnya.
const launchOptions = process.env.PE_CHROME_PATH
  ? { executablePath: process.env.PE_CHROME_PATH, args: ["--no-sandbox"] }
  : { args: ["--no-sandbox"] };

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:8336",
    trace: "retain-on-failure",
    launchOptions,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
