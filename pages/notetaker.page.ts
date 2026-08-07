import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class NotetakerPage extends BasePage {
  constructor(page: Page) { super(page); }
  async open(): Promise<void> { await this.page.goto('/notetaker-dashboard'); }
  async expectReady(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Meeting Notes & Summaries' })).toBeVisible();
    await expect(this.page.getByRole('searchbox', { name: 'Search meetings...' })).toBeVisible();
  }
}
