import { expect, Page } from '@playwright/test';
import { appLocators } from '../locators/app.locators';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  constructor(page: Page) { super(page); }
  async openMenu(): Promise<void> { await this.page.locator(appLocators.profile).click(); }
  async openProfile(): Promise<void> {
    await this.openMenu();
    await this.page.getByRole('link', { name: 'My Profile' }).click();
  }
  async expectDetails(email: string): Promise<void> {
    await expect(this.page.getByRole('dialog', { name: 'User Profile Details' })).toBeVisible();
    await expect(this.page.getByRole('dialog')).toContainText(email);
  }
}
