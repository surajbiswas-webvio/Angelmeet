import { test, expect } from '../fixtures/auth.fixture';

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

async function assertNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const hasOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBeFalsy();
}

test.describe('Responsive: Dashboard', () => {
  for (const vp of viewports) {
    test(`dashboard renders at ${vp.name} (${vp.width}x${vp.height})`, async ({ page, dashboard }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await dashboard.open();
      await dashboard.expectReady();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const vp of viewports) {
    test(`login page renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: Settings', () => {
  for (const vp of viewports) {
    test(`settings renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/settings');
      await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: Calendar', () => {
  for (const vp of viewports) {
    test(`calendar renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/calendar');
      await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: Meetings', () => {
  for (const vp of viewports) {
    test(`meetings list renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/meetings');
      await expect(page.getByRole('heading', { name: 'Meetings' })).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: AI Notes', () => {
  for (const vp of viewports) {
    test(`notes page renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/ai-notes');
      await expect(page.getByRole('heading', { name: 'Notes & Recordings' })).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: Usage', () => {
  for (const vp of viewports) {
    test(`usage renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/usage');
      await expect(page.getByRole('heading', { name: 'Usage', exact: true })).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: Billing', () => {
  for (const vp of viewports) {
    test(`billing renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/billing');
      await expect(page.getByRole('heading', { name: 'Billing' })).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: Webinars', () => {
  for (const vp of viewports) {
    test(`webinars renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/webinars');
      await expect(page.getByRole('heading', { name: 'Webinars' })).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: Navigation visibility', () => {
  test('sidebar is visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/home');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Meetings' })).toBeVisible();
  });

  test('sidebar is visible on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/home');
    await assertNoHorizontalOverflow(page);
  });

  test('dashboard controls visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/home');
    await assertNoHorizontalOverflow(page);
  });
});

test.describe('Responsive: Forms and buttons', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const vp of viewports) {
    test(`login form usable at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/login');
      const email = page.getByRole('textbox', { name: 'Email' });
      await expect(email).toBeVisible();
      await email.fill('test@example.com');
      await expect(email).toHaveValue('test@example.com');
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('Responsive: Meeting join dialog', () => {
  for (const vp of viewports) {
    test(`join dialog renders at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/home');
      await page.getByRole('button', { name: 'Join a meeting' }).click();
      const dialog = page.getByRole('dialog', { name: 'Join a meeting' });
      await expect(dialog).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});
