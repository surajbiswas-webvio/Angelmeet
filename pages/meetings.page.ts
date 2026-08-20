import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class MeetingsPage extends BasePage {
  constructor(page: Page) { super(page); }
  async open(): Promise<void> { await this.page.goto('/meetings', { waitUntil: 'domcontentloaded' }); }
  async expectReady(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Meetings' })).toBeVisible();
    await expect(this.page.getByPlaceholder('Search meetings…')).toBeVisible();
  }
  async search(query: string): Promise<void> { await this.page.getByPlaceholder('Search meetings…').fill(query); }
}
