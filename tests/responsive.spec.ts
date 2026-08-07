import { test, expect } from '../fixtures/auth.fixture';
import { meetingData } from '../helpers/test-data';

for (const viewport of meetingData.viewports) {
  test(`AM-034 dashboard remains usable at ${viewport.name}`, async ({ page, dashboard }) => {
    await page.setViewportSize(viewport);
    await dashboard.open();
    await dashboard.expectReady();
    const hasHorizontalOverflow = await page.locator('body').evaluate(element => element.scrollWidth > element.clientWidth);
    expect(hasHorizontalOverflow).toBeFalsy();
  });
}
