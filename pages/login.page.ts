import { expect, Page } from '@playwright/test';
import { appLocators } from '../locators/app.locators';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) { super(page); }
  async open(): Promise<void> { await this.page.goto('/login'); }
  async login(email: string, password: string): Promise<void> {
    await this.page.locator(appLocators.email).fill(email);
    await this.page.locator(appLocators.password).fill(password);
    await this.page.locator(appLocators.login).click();
    await expect(this.page).toHaveURL(/\/$/);
  }
  async expectLoginForm(): Promise<void> { await this.expectVisible(this.page.locator(appLocators.email)); }
}
