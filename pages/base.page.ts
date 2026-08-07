import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
