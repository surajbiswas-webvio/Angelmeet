import { expect, Page } from '@playwright/test';
import { appLocators } from '../locators/app.locators';
import { BasePage } from './base.page';

export class MeetingsPage extends BasePage {
  constructor(page: Page) { super(page); }
  async open(): Promise<void> { await this.page.goto('/conference-view-list'); }
  async expectReady(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Meeting List View' })).toBeVisible();
    await expect(this.page.getByRole('searchbox', { name: 'Search meetings...' })).toBeVisible();
  }
  async navigateFromHeader(): Promise<void> { await this.page.locator(appLocators.allMeetings).click(); }
}
