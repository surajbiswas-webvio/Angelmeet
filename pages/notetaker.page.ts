import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class NotetakerPage extends BasePage {
  constructor(page: Page) { super(page); }
  async open(): Promise<void> { await this.page.goto('/ai-notes', { waitUntil: 'domcontentloaded' }); }
  async expectReady(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Notes & Recordings' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Ask AI' })).toBeVisible();
  }
}
