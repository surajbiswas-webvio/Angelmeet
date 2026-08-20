import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://app.angelmeet.ai/register', { waitUntil: 'networkidle', timeout: 30000 });

const timestamp = Date.now();
const email = `angelqatest${timestamp}@gmail.com`;
const password = 'TestPassw0rd!@#123';

await page.locator('input[placeholder="Ada Lovelace"]').fill('QA Test User');
await page.locator('input[placeholder="ada"]').fill(`qatest${timestamp}`);
await page.locator('input[type="email"]').fill(email);
await page.locator('input[type="password"]').fill(password);

await page.getByRole('button', { name: 'Create account' }).click();
await page.waitForTimeout(5000);
console.log('URL:', page.url());
console.log('Email:', email);
console.log('Password:', password);

const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
console.log('Body:', bodyText);
await browser.close();
