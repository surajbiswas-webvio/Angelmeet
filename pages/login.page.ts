import { expect, Page } from '@playwright/test';
import { appLocators } from '../locators/app.locators';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) { super(page); }
  async open(): Promise<void> { await this.page.goto('/login', { waitUntil: 'domcontentloaded' }); }
  async login(email: string, password: string): Promise<void> {
    await this.submitCredentials(email, password);
    await expect(this.page).toHaveURL(/\/home$/);
  }
  async submitCredentials(email: string, password: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }
  async submit(): Promise<void> { await this.page.getByRole('button', { name: 'Sign in' }).click(); }
  async expectLoginForm(): Promise<void> { await this.expectVisible(this.page.getByRole('textbox', { name: 'Email' })); }
  async expectError(): Promise<void> { await expect(this.page.getByText(/do not match|invalid|incorrect|unable/i)).toBeVisible(); }
}
