import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { env } from '../config/env';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication @smoke', () => {
  test('AM-001 signs in with a valid account', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(env.email(), env.password());
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  });

  test('AM-002 rejects invalid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.submitCredentials(env.email(), 'invalid-password-for-negative-test');
    await login.expectError();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('AM-003 validates empty credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeDisabled();
  });
});
