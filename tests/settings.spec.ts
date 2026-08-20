import { test, expect } from '../fixtures/auth.fixture';

test.describe('Settings', () => {
  test('AM-S01 displays settings page with profile section', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  });

  test('AM-S02 shows profile fields for current user', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('textbox', { name: 'First name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  });

  test('AM-S03 shows sidebar settings navigation', async ({ page }) => {
    await page.goto('/settings');
    for (const section of ['Profile', 'Preferences', 'Connected accounts', 'Password', 'Help & support', 'About']) {
      await expect(page.getByRole('button', { name: section })).toBeVisible();
    }
  });

  test('AM-S04 navigates to Preferences section', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('button', { name: 'Preferences' }).click();
    await expect(page.getByRole('heading', { name: 'Preferences' })).toBeVisible();
  });

  test('AM-S05 navigates to Password section', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('button', { name: 'Password' }).click();
    await expect(page.getByRole('heading', { name: 'Password' })).toBeVisible();
  });

  test('AM-S06 shows change photo button', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('button', { name: 'Change photo' })).toBeVisible();
  });

  test('AM-S07 shows save changes button', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
  });
});
