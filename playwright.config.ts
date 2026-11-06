import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright setup — implementation.md §17.3, §17.4 and §17.9.
 *
 * The visual baselines ARE the design PNGs: snapshotPathTemplate points straight at
 * design/screens, and `--update-snapshots` must never be run against them (§17.4).
 */
const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  // The design PNGs are compared in e2e/visual-compare.ts with pixelmatch (§17.4), not
  // through Playwright snapshots, so nothing here can ever write into design/screens.

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'off',
  },

  projects: [
    {
      name: 'phone',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        // Deliberately no touch emulation, so inputs keep the designed font sizes (§17.4).
        hasTouch: false,
        isMobile: false,
      },
    },
    {
      // 1440 wide at 1x (§17.4). 4.1 is 1180 tall and 4.2 is 1060; each spec sets its
      // own viewport where it differs from this default.
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1180 },
        deviceScaleFactor: 1,
      },
    },
    {
      // Feel harness (§17.9): real touch, animations on, CPU throttled 4x by the spec itself.
      name: 'feel',
      testMatch: /feel\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        hasTouch: true,
        isMobile: true,
      },
    },
  ],

  webServer: {
    command: 'pnpm --filter web dev --port 5173 --strictPort',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
