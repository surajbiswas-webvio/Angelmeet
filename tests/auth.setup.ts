import { test as setup } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { env } from '../config/env';
import { LoginPage } from '../pages/login.page';

setup('authenticate test user', async ({ page }) => {
  await mkdir('.auth', { recursive: true });
  const login = new LoginPage(page);
  await login.open();
  await login.login(env.email(), env.password());
  await page.context().storageState({ path: '.auth/user.json' });
});
