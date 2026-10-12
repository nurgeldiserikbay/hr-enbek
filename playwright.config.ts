import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const isCi = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  reporter: isCi ? [['html', { open: 'never' }], ['list']] : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{platform}{ext}',
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', threshold: 0.01, maxDiffPixels: 0 },
  },
  use: {
    baseURL: `http://localhost:${String(PORT)}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop-chromium', testDir: './tests/e2e', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', testDir: './tests/e2e', use: { ...devices['Pixel 7'] } },
    {
      name: 'visual',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 1,
        launchOptions: {
          args: ['--disable-gpu', '--disable-lcd-text', '--font-render-hinting=none', '--force-color-profile=srgb'],
        },
      },
    },
  ],
  webServer: {
    command: isCi ? 'pnpm start' : 'pnpm dev',
    port: PORT,
    reuseExistingServer: !isCi,
  },
});
