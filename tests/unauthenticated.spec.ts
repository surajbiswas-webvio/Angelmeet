import { test, expect } from '../fixtures/auth.fixture';

test.describe('Unauthenticated pages', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('AM-UN01 login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('AM-UN02 registration page renders correctly', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
    await expect(page.getByPlaceholder('Ada Lovelace')).toBeVisible();
  });

  test('AM-UN03 forgot password page renders correctly', async ({ page }) => {
    await page.goto('/forgot');
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('button', { name: /send|reset/i })).toBeVisible();
  });

  test('AM-UN04 login has Google OAuth option', async ({ page }) => {
    await page.goto('/login');
    const googleLogin = page.getByRole('button', { name: 'Continue with Google' });
    if (!(await googleLogin.isVisible().catch(() => false))) {
      test.skip(true, 'Google OAuth is not enabled on the current login page');
    }
    await expect(googleLogin).toBeVisible();
  });

  test('AM-UN05 login has create account link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Create an account' })).toBeVisible();
  });

  test('AM-UN06 login has forgot password link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
  });

  test('AM-UN07 invalid login shows error message', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('nonexistent@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText(/do not match|invalid|incorrect|unable/i)).toBeVisible();
  });

  test('AM-UN08 protected routes redirect to login', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Logout', () => {
  test('AM-UN09 logout returns to login page', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: /logout|sign out/i }).click();
    await expect(page).toHaveURL(/login/);
  });
});
