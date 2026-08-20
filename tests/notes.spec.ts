import { test, expect } from '../fixtures/auth.fixture';

test.describe('AI Notes & Recordings', () => {
  test('AM-N01 displays notes page with heading', async ({ page }) => {
    await page.goto('/ai-notes');
    await expect(page.getByRole('heading', { name: 'Notes & Recordings' })).toBeVisible();
  });

  test('AM-N02 shows Ask AI section', async ({ page }) => {
    await page.goto('/ai-notes');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Ask AI about your meetings' })).toBeVisible();
  });

  test('AM-N03 shows AI Notes tab and Recordings tab', async ({ page }) => {
    await page.goto('/ai-notes');
    await expect(page.getByRole('tab', { name: 'AI Notes' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Recordings' })).toBeVisible();
  });

  test('AM-N04 shows Ask AI button', async ({ page }) => {
    await page.goto('/ai-notes');
    await expect(page.getByRole('button', { name: 'Ask AI' })).toBeVisible();
  });

  test('AM-N05 shows Ask AI input placeholder', async ({ page }) => {
    await page.goto('/ai-notes');
    await expect(page.getByPlaceholder('what did we decide about pricing?')).toBeVisible();
  });

  test('AM-N06 shows recent notes section', async ({ page }) => {
    await page.goto('/ai-notes');
    await expect(page.getByRole('heading', { name: 'RECENT NOTES' })).toBeVisible();
  });

  test('AM-N07 switches to Recordings tab', async ({ page }) => {
    await page.goto('/ai-notes');
    await page.getByRole('tab', { name: 'Recordings' }).click();
    await expect(page.getByRole('tab', { name: 'Recordings' })).toHaveAttribute('data-state', 'active');
  });
});
