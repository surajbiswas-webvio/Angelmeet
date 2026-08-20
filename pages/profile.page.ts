import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  constructor(page: Page) { super(page); }
  async openMenu(): Promise<void> { await this.page.getByRole('button', { name: 'Account menu' }).click(); }
  async openProfile(): Promise<void> {
    await this.page.goto('/settings', { waitUntil: 'domcontentloaded' });
  }
  async expectDetails(email: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Email' })).toHaveValue(email);
  }
}
