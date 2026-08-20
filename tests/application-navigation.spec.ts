import { test, expect } from '../fixtures/auth.fixture';

test.describe('Application navigation @smoke', () => {
  test('AM-016 opens current meeting inventory', async ({ meetings, page }) => {
    await meetings.open();
    await meetings.expectReady();
    await meetings.search('unlikely-to-match-a-meeting');
    await expect(page.getByPlaceholder('Search meetings…')).toHaveValue('unlikely-to-match-a-meeting');
  });

  test('AM-019 opens calendar and notes surfaces', async ({ page }) => {
    await page.goto('/calendar');
    await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
    await page.goto('/ai-notes');
    await expect(page.getByRole('heading', { name: 'Notes & Recordings' })).toBeVisible();
  });

  test('AM-020 opens webinars workspace', async ({ page }) => {
    await page.goto('/webinars');
    await expect(page.getByRole('heading', { name: 'Webinars' })).toBeVisible();
    await expect(page.getByText('attendees watch, panelists present')).toBeVisible();
  });
});
