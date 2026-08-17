import { Locator, Page } from '@playwright/test';

/** Reusable, accessible model for the home-page meeting dialog. */
export class MeetingDialogPage {
  constructor(private readonly page: Page) {}

  joinDialog(): Locator { return this.page.getByRole('dialog', { name: 'Join a meeting' }); }
  scheduleDialog(): Locator { return this.page.getByRole('dialog', { name: 'Schedule a meeting' }); }

  async openInstant(): Promise<void> { await this.page.getByRole('button', { name: 'New meeting' }).click(); }
  async openJoin(): Promise<void> { await this.page.getByRole('button', { name: 'Join a meeting' }).click(); }
  async openSchedule(): Promise<void> { await this.page.getByRole('button', { name: 'Schedule meeting' }).click(); }
  async enterJoinCode(value: string): Promise<void> {
    await this.joinDialog().getByPlaceholder('e.g. AB12CD or https://…/join?id=…').fill(value);
  }
  async setMeetingName(dialog: Locator, value: string): Promise<void> {
    await dialog.getByRole('textbox', { name: 'Meeting name' }).fill(value);
  }
  async addParticipant(dialog: Locator, email: string): Promise<void> {
    const input = dialog.getByRole('textbox', { name: 'Invite people by email — press Enter to add' });
    await input.fill(email);
    await input.press('Enter');
  }
  async submitSchedule(): Promise<void> {
    await this.scheduleDialog().getByRole('button', { name: 'Schedule', exact: true }).last().click();
  }
}
