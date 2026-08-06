import { expect, Page } from '@playwright/test';
import { appLocators } from '../locators/app.locators';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  constructor(page: Page) { super(page); }
  async open(): Promise<void> { await this.page.goto('/'); }
  async expectReady(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Video calls and meetings for everyone' })).toBeVisible();
    await this.expectVisible(this.page.locator(appLocators.newMeeting));
    await this.expectVisible(this.page.locator(appLocators.joinInput));
  }
  async openNewMeetingMenu(): Promise<void> { await this.page.locator(appLocators.newMeeting).click(); }
  async expectMeetingChoices(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Start instant meeting' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Schedule meeting' })).toBeVisible();
  }
  async joinBlankMeeting(): Promise<void> {
    await this.page.locator(appLocators.join).click();
    await expect(this.page.getByRole('alert')).toContainText('Please enter meeting URL');
  }
}
