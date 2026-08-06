import { test as base } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { MeetingsPage } from '../pages/meetings.page';
import { NotetakerPage } from '../pages/notetaker.page';
import { ProfilePage } from '../pages/profile.page';

export const test = base.extend<{ dashboard: DashboardPage; meetings: MeetingsPage; notetaker: NotetakerPage; profile: ProfilePage }>({
  dashboard: async ({ page }, use) => use(new DashboardPage(page)),
  meetings: async ({ page }, use) => use(new MeetingsPage(page)),
  notetaker: async ({ page }, use) => use(new NotetakerPage(page)),
  profile: async ({ page }, use) => use(new ProfilePage(page))
});
export { expect } from '@playwright/test';
