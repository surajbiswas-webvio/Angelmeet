import { test } from '../fixtures/auth.fixture';
import { env } from '../config/env';

test.describe('Authenticated navigation @smoke', () => {
  test('AM-015 opens All Meetings workspace', async ({ meetings }) => { await meetings.open(); await meetings.expectReady(); });
  test('AM-018 opens AI Notetaker workspace', async ({ notetaker }) => { await notetaker.open(); await notetaker.expectReady(); });
  test('AM-030 displays profile details', async ({ dashboard, profile }) => { await dashboard.open(); await profile.openProfile(); await profile.expectDetails(env.email()); });
});
