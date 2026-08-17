import { expect, Page } from '@playwright/test';
import { appLocators } from '../locators/app.locators';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  constructor(page: Page) { super(page); }
  async open(): Promise<void> { await this.page.goto('/home', { waitUntil: 'domcontentloaded' }); }
  async expectReady(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Home' })).toBeVisible();
    await this.expectVisible(this.page.getByRole('button', { name: 'New meeting' }));
    await this.expectVisible(this.page.getByRole('button', { name: 'Join a meeting' }));
  }
  async openNewMeetingMenu(): Promise<void> { await this.page.getByRole('button', { name: 'New meeting' }).click(); }
  async expectMeetingChoices(): Promise<void> {
    await expect(this.page.getByText('Starts now and runs for an hour.')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Schedule' })).toBeVisible();
  }
  async joinBlankMeeting(): Promise<void> {
    await this.page.getByRole('button', { name: 'Join a meeting' }).click();
    const dialog = this.page.getByRole('dialog', { name: 'Join a meeting' });
    await expect(dialog.getByRole('button', { name: 'Join' })).toBeDisabled();
  }
}
