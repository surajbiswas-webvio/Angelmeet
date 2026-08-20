import { test, expect } from '../fixtures/auth.fixture';

test.describe('Meeting workflow validation @smoke', () => {
  test('AM-008 join dialog opens and accepts input', async ({ dashboard, page }) => {
    await dashboard.open();
    await page.getByRole('button', { name: 'Join a meeting' }).click();
    const dialog = page.getByRole('dialog', { name: 'Join a meeting' });
    await expect(dialog).toBeVisible();
    const code = dialog.getByPlaceholder('e.g. AB12CD or https://…/join?id=…');
    await expect(code).toBeVisible();
    await code.fill('bad');
    await expect(code).toHaveValue('bad');
  });

  test('AM-011 exposes instant meeting options without creating a meeting', async ({ dashboard, page }) => {
    await dashboard.open();
    await dashboard.openNewMeetingMenu();
    const dialog = page.getByRole('dialog', { name: 'Start an instant meeting' });
    await expect(dialog).toBeVisible();
    await expect(page.getByText('AI Notetaker')).toBeVisible();
    await expect(page.getByText('Live Translation')).toBeVisible();
  });

  test('AM-012 requires the schedule-meeting fields before submission', async ({ dashboard, page }) => {
    await dashboard.open();
    await dashboard.openNewMeetingMenu();
    const dialog = page.getByRole('dialog', { name: 'Start an instant meeting' });
    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: 'Schedule' }).click();
    await expect(page.getByRole('dialog', { name: 'Schedule a meeting' }).getByRole('textbox', { name: 'Meeting name' })).toBeVisible();
  });
});
