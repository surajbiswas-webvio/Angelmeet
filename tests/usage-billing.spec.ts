import { test, expect } from '../fixtures/auth.fixture';

test.describe('Usage & Billing', () => {
  test('AM-U01 displays usage page', async ({ page }) => {
    await page.goto('/usage');
    await expect(page.getByRole('heading', { name: 'Usage', exact: true })).toBeVisible();
  });

  test('AM-U02 shows usage summary section', async ({ page }) => {
    await page.goto('/usage');
    await expect(page.getByRole('heading', { name: 'Usage', exact: true })).toBeVisible();
    await expect(page.getByText('Your usage this month')).toBeVisible();
  });

  test('AM-B01 displays billing page', async ({ page }) => {
    await page.goto('/billing');
    await expect(page.getByRole('heading', { name: 'Billing' })).toBeVisible();
  });

  test('AM-B02 shows invoices section', async ({ page }) => {
    await page.goto('/billing');
    await expect(page.getByText('Invoices')).toBeVisible();
  });
});
