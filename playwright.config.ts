import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }]
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://app.angelmeet.ai',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    testIdAttribute: 'data-testid'
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts$/ },
    { name: 'admin-setup', testMatch: /admin[/\\]admin-setup\.ts$/, use: { baseURL: process.env.ADMIN_URL ?? 'https://admin.angelmeet.ai' } },
    {
      name: 'chromium',
      testMatch: /^(?!.*admin).*.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
      dependencies: ['setup']
    },
    {
      name: 'mobile-chrome',
      testMatch: /^(?!.*admin).*.spec\.ts$/,
      use: { ...devices['Pixel 5'], storageState: '.auth/user.json' },
      dependencies: ['setup']
    },
    {
      name: 'admin',
      testMatch: /admin[/\\]index\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], storageState: '.auth/admin.json', baseURL: process.env.ADMIN_URL ?? 'https://admin.angelmeet.ai' },
      dependencies: ['admin-setup']
    }
  ],
  outputDir: 'test-results'
});
