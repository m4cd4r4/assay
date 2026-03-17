import { defineConfig, devices } from '@playwright/test';

const BRAVE_PATH = 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 60000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://localhost:3099',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: BRAVE_PATH,
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/.auth/state.json',
        launchOptions: {
          executablePath: BRAVE_PATH,
        },
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 3099',
    port: 3099,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
