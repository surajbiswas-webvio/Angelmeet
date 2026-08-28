import { test as setup } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { env } from '../../config/env';

setup('authenticate admin user', async ({ page }) => {
  await mkdir('.auth', { recursive: true });
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.locator('#email').fill(env.adminEmail());
  await page.locator('#password').fill(env.adminPassword());
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/home(?:\/|$)/, { timeout: 15000 });
  await page.context().storageState({ path: '.auth/admin.json' });
});
