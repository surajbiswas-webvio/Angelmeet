import { test, expect } from '../fixtures/auth.fixture';

async function openSidebarOnMobile(page: import('@playwright/test').Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    const openMenu = page.getByRole('button', { name: 'Open menu' });
    if (await openMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
      await openMenu.click();
      await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    }
  }
}

test.describe('Navigation & Sidebar', () => {
  test('AM-NAV01 sidebar shows all navigation links', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    await openSidebarOnMobile(page);
    const links = ['Home', 'Meetings', 'Calendar', 'Notes & Recordings', 'Webinars', 'Usage', 'Billing', 'Settings'];
    for (const link of links) {
      await expect(page.getByRole('link', { name: link })).toBeVisible();
    }
  });

  test('AM-NAV02 workspace switcher shows user info', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    await openSidebarOnMobile(page);
    await expect(page.getByRole('button', { name: 'Switch workspace' })).toBeVisible();
  });

  test('AM-NAV03 sidebar collapse works', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      test.skip();
      return;
    }
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    const collapseBtn = page.getByRole('button', { name: 'Collapse sidebar' });
    await collapseBtn.click();
    await expect(page.getByRole('button', { name: 'Expand sidebar' })).toBeVisible();
  });

  test('AM-NAV04 account menu opens', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    await page.getByRole('button', { name: 'Account menu' }).click();
    await expect(page.getByRole('menuitem', { name: /logout|sign out/i })).toBeVisible();
  });

  test('AM-NAV05 search command palette opens', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    const viewport = page.viewportSize();
    let searchBtn = page.getByRole('button', { name: /Search meetings/ });
    if (!(await searchBtn.isVisible({ timeout: 2000 }).catch(() => false))) {
      searchBtn = page.getByRole('button', { name: 'Search' });
    }
    await searchBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('AM-NAV06 theme toggle opens theme menu', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(page.getByRole('menuitem', { name: 'Light' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Dark' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'System' })).toBeVisible();
  });

  test('AM-NAV07 navigate between all pages via sidebar', async ({ page }) => {
    const routes = [
      { link: 'Home', heading: 'Home' },
      { link: 'Meetings', heading: 'Meetings' },
      { link: 'Calendar', heading: 'Calendar' },
      { link: 'Notes & Recordings', heading: 'Notes & Recordings' },
      { link: 'Webinars', heading: 'Webinars' },
      { link: 'Usage', heading: 'Usage' },
      { link: 'Billing', heading: 'Billing' },
      { link: 'Settings', heading: 'Settings' },
    ];
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
    await openSidebarOnMobile(page);
    for (const { link, heading } of routes) {
      await page.getByRole('link', { name: link }).click();
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
      await openSidebarOnMobile(page);
    }
  });
});
