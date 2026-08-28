import { test, expect, Page } from '@playwright/test';

const admin = test;
const emptyStorage = { cookies: [], origins: [] };

async function waitForDashboard(page: Page) {
  await page.goto('/login');
  await expect(page.getByText('Tenants')).toBeVisible({ timeout: 20000 });
}

admin.describe('Admin Login', () => {
  admin.use({ storageState: emptyStorage });

  admin('ADMIN-001 admin login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByText('Control plane')).toBeVisible();
  });

  admin('ADMIN-002 rejects invalid admin credentials', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('invalid@admin.com');
    await page.locator('#password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/login(?:$|[?#])/);
  });
});

admin.describe('Admin Dashboard', () => {
  admin('ADMIN-003 overview shows platform stats', async ({ page }) => {
    await waitForDashboard(page);
    await expect(page.getByText('Users')).toBeVisible();
    await expect(page.getByText('Meetings today')).toBeVisible();
  });

  admin('ADMIN-004 overview shows live now section', async ({ page }) => {
    await waitForDashboard(page);
    await expect(page.getByRole('main').getByText('Live now', { exact: true })).toBeVisible();
  });

  admin('ADMIN-005 overview shows usage by type chart', async ({ page }) => {
    await waitForDashboard(page);
    await expect(page.getByText('Usage by type')).toBeVisible();
  });

  admin('ADMIN-006 overview has refresh button', async ({ page }) => {
    await waitForDashboard(page);
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
  });

  admin('ADMIN-007 overview has exit to app button', async ({ page }) => {
    await waitForDashboard(page);
    await expect(page.getByRole('button', { name: 'Exit to app' })).toBeVisible();
  });
});

admin.describe('Admin Navigation', () => {
  const modules = [
    'Overview', 'Tenants', 'Live now', 'Meetings', 'Usage',
    'Analytics', 'Economics', 'Plans & Billing', 'Feature Flags',
    'AI', 'Notifications', 'Integrations', 'Settings', 'Audit Log',
    'Security', 'System Health', 'Admins & Roles'
  ];

  for (const mod of modules) {
    admin(`ADMIN-NAV navigates to ${mod}`, async ({ page }) => {
      await waitForDashboard(page);
      await page.getByRole('button', { name: mod }).click();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('main')).not.toBeEmpty();
    });
  }
});

admin.describe('Admin Tenants', () => {
  admin('ADMIN-T01 tenants page shows table', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Tenants' }).click();
    await expect(page.getByRole('cell', { name: 'Account' })).toBeVisible();
  });

  admin('ADMIN-T02 tenants has onboard button', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Tenants' }).click();
    await expect(page.getByRole('button', { name: 'Onboard tenant' })).toBeVisible();
  });

  admin('ADMIN-T03 tenants has search input', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Tenants' }).click();
    await expect(page.getByPlaceholder(/search tenants/i)).toBeVisible();
  });

  admin('ADMIN-T04 tenants has status filter', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Tenants' }).click();
    await expect(page.getByText('All statuses')).toBeVisible();
  });
});

admin.describe('Admin Meetings', () => {
  admin('ADMIN-M01 meetings page shows table', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Meetings' }).click();
    await expect(page.getByRole('heading', { name: 'Meetings' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Meeting' })).toBeVisible();
  });

  admin('ADMIN-M02 meetings has type filter', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Meetings' }).click();
    await expect(page.getByText('All types')).toBeVisible();
  });

  admin('ADMIN-M03 meetings has status filter', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Meetings' }).click();
    await expect(page.getByText('All statuses')).toBeVisible();
  });
});

admin.describe('Admin Usage', () => {
  admin('ADMIN-U01 usage page shows metrics table', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Usage' }).click();
    await expect(page.getByText('Resource')).toBeVisible();
    await expect(page.getByText('Quantity')).toBeVisible();
  });
});

admin.describe('Admin Analytics', () => {
  admin('ADMIN-A01 analytics page shows revenue metrics', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Analytics' }).click();
    await expect(page.getByText('Revenue')).toBeVisible();
  });

  admin('ADMIN-A02 analytics shows plan mix', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Analytics' }).click();
    await expect(page.getByText('Plan mix')).toBeVisible();
  });
});

admin.describe('Admin Economics', () => {
  admin('ADMIN-E01 economics shows revenue and cost', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Economics' }).click();
    await expect(page.getByText('Revenue')).toBeVisible();
    await expect(page.getByText('Cost (MTD)')).toBeVisible();
  });

  admin('ADMIN-E02 economics shows cost per tenant', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Economics' }).click();
    await expect(page.getByText('Cost per tenant')).toBeVisible();
  });
});

admin.describe('Admin Plans & Billing', () => {
  admin('ADMIN-P01 plans page shows plan cards', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Plans & Billing' }).click();
    await expect(page.getByText('Free', { exact: true })).toBeVisible();
    await expect(page.getByText('Pro', { exact: true })).toBeVisible();
    await expect(page.getByText('Business', { exact: true })).toBeVisible();
  });

  admin('ADMIN-P02 invoices section visible', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Plans & Billing' }).click();
    await expect(page.getByText('Invoices', { exact: true })).toBeVisible();
  });
});

admin.describe('Admin Feature Flags', () => {
  admin('ADMIN-F01 feature flags page shows flags', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Feature Flags' }).click();
    await expect(page.getByText('ADVANCED_ANALYTICS')).toBeVisible();
  });

  admin('ADMIN-F02 shows flag status columns', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Feature Flags' }).click();
    await expect(page.getByText('Status')).toBeVisible();
    await expect(page.getByText('Rollout')).toBeVisible();
  });
});

admin.describe('Admin AI', () => {
  admin('ADMIN-AI01 AI page shows providers', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'AI' }).click();
    await expect(page.getByText('Providers & models')).toBeVisible();
  });

  admin('ADMIN-AI02 shows routing section', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'AI' }).click();
    await expect(page.getByText('Routing')).toBeVisible();
  });
});

admin.describe('Admin Settings', () => {
  admin('ADMIN-ST01 settings shows emergency controls', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByText('Emergency controls')).toBeVisible();
  });

  admin('ADMIN-ST02 shows disable new registrations toggle', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByText('Disable new registrations')).toBeVisible();
  });

  admin('ADMIN-ST03 shows maintenance mode toggle', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByText('Maintenance mode')).toBeVisible();
  });
});

admin.describe('Admin Audit Log', () => {
  admin('ADMIN-AL01 audit log shows entries table', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Audit Log' }).click();
    await expect(page.getByText('When')).toBeVisible();
    await expect(page.getByText('Actor')).toBeVisible();
    await expect(page.getByText('Action')).toBeVisible();
  });
});

admin.describe('Admin Security', () => {
  admin('ADMIN-SC01 security page shows MFA section', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Security' }).click();
    await expect(page.getByText('MFA')).toBeVisible();
  });

  admin('ADMIN-SC02 shows security events', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Security' }).click();
    await expect(page.getByText('Security events')).toBeVisible();
  });
});

admin.describe('Admin System Health', () => {
  admin('ADMIN-SH01 health page shows services', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'System Health' }).click();
    await expect(page.getByText('All systems operational')).toBeVisible();
  });

  admin('ADMIN-SH02 shows database health', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'System Health' }).click();
    await expect(page.getByText('Database', { exact: true })).toBeVisible();
  });
});

admin.describe('Admin Notifications', () => {
  admin('ADMIN-NT01 notifications page shows templates', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Notifications' }).click();
    await expect(page.getByText('Templates')).toBeVisible();
  });
});

admin.describe('Admin Integrations', () => {
  admin('ADMIN-INT01 integrations page shows providers', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Integrations' }).click();
    await expect(page.getByText('Google Calendar')).toBeVisible();
  });
});

admin.describe('Admin Admins & Roles', () => {
  admin('ADMIN-AR01 roles section visible', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Admins & Roles' }).click();
    await expect(page.getByText('Roles & permissions')).toBeVisible();
  });

  admin('ADMIN-AR02 shows predefined roles', async ({ page }) => {
    await waitForDashboard(page);
    await page.getByRole('button', { name: 'Admins & Roles' }).click();
    await expect(page.getByText('Superadmin')).toBeVisible();
  });
});
