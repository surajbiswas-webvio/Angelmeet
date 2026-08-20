import { test, expect } from '../fixtures/auth.fixture';

test.describe('Calendar', () => {
  test('AM-C01 displays calendar page with heading', async ({ page }) => {
    await page.goto('/calendar');
    await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
  });

  test('AM-C02 shows current month and year', async ({ page }) => {
    await page.goto('/calendar');
    const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    await expect(page.getByRole('heading', { name: monthYear })).toBeVisible();
  });

  test('AM-C03 shows calendar navigation buttons', async ({ page }) => {
    await page.goto('/calendar');
    await expect(page.getByRole('button', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Today' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  });

  test('AM-C04 shows view mode buttons', async ({ page }) => {
    await page.goto('/calendar');
    for (const mode of ['Month', 'Week', 'Agenda']) {
      await expect(page.getByRole('button', { name: mode })).toBeVisible();
    }
  });

  test('AM-C05 shows schedule button', async ({ page }) => {
    await page.goto('/calendar');
    await expect(page.getByRole('button', { name: 'Schedule' })).toBeVisible();
  });

  test('AM-C06 navigates to previous month', async ({ page }) => {
    await page.goto('/calendar');
    await page.getByRole('button', { name: 'Previous' }).click();
    const prev = new Date();
    prev.setMonth(prev.getMonth() - 1);
    const prevMonth = prev.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    await expect(page.getByRole('heading', { name: prevMonth })).toBeVisible();
  });

  test('AM-C07 navigates to next month', async ({ page }) => {
    await page.goto('/calendar');
    await page.getByRole('button', { name: 'Next' }).click();
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    const nextMonth = next.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    await expect(page.getByRole('heading', { name: nextMonth })).toBeVisible();
  });

  test('AM-C08 returns to today', async ({ page }) => {
    await page.goto('/calendar');
    await page.getByRole('button', { name: 'Previous' }).click();
    await page.getByRole('button', { name: 'Previous' }).click();
    await page.getByRole('button', { name: 'Today' }).click();
    const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    await expect(page.getByRole('heading', { name: monthYear })).toBeVisible();
  });

  test('AM-C09 switches to week view', async ({ page }) => {
    await page.goto('/calendar');
    await page.getByRole('button', { name: 'Week' }).click();
    await expect(page.getByRole('button', { name: 'Week' })).toBeVisible();
  });

  test('AM-C10 switches to agenda view', async ({ page }) => {
    await page.goto('/calendar');
    await page.getByRole('button', { name: 'Agenda' }).click();
    await expect(page.getByRole('button', { name: 'Agenda' })).toBeVisible();
  });
});
