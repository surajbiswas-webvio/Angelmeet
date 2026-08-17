import { test, expect } from '../fixtures/auth.fixture';

test.describe('Meeting workflow validation @smoke', () => {
  test('AM-008 validates a malformed meeting join code', async ({ dashboard, page }) => {
    await dashboard.open();
    await page.getByRole('button', { name: 'Join a meeting' }).click();
    const dialog = page.getByRole('dialog', { name: 'Join a meeting' });
    const code = dialog.getByPlaceholder('e.g. AB12CD or https://…/join?id=…');
    await code.fill('bad');
    await expect(dialog.getByRole('button', { name: 'Join' })).toBeDisabled();
  });

  test('AM-011 exposes instant meeting options without creating a meeting', async ({ dashboard, page }) => {
    await dashboard.open();
    await dashboard.openNewMeetingMenu();
    await expect(page.getByRole('textbox', { name: 'Meeting name' })).toBeVisible();
    await expect(page.getByText('AI Notetaker')).toBeVisible();
    await expect(page.getByText('Live Translation')).toBeVisible();
  });

  test('AM-012 requires the schedule-meeting fields before submission', async ({ dashboard, page }) => {
    await dashboard.open();
    await page.getByRole('button', { name: 'Schedule meeting' }).click();
    const dialog = page.getByRole('dialog', { name: 'Schedule a meeting' });
    await dialog.getByRole('button', { name: 'Schedule', exact: true }).last().click();
    await expect(dialog.getByRole('textbox', { name: 'Meeting name' })).toHaveAttribute('aria-invalid', 'true');
  });
});
