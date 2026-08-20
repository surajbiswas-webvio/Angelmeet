import { test, expect } from '../fixtures/auth.fixture';

test.describe('Dashboard @smoke', () => {
  test('AM-006 shows authenticated dashboard controls', async ({ dashboard }) => {
    await dashboard.open();
    await dashboard.expectReady();
  });
  test('AM-007 prevents blank meeting joins', async ({ dashboard }) => {
    await dashboard.open();
    await dashboard.joinBlankMeeting();
  });
  test('AM-010 exposes instant and scheduled meeting choices', async ({ dashboard }) => {
    await dashboard.open();
    await dashboard.openNewMeetingMenu();
    await dashboard.expectMeetingChoices();
  });
});
