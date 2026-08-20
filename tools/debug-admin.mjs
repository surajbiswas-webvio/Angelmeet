import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
page.on('response', res => {
  if (res.url().includes('api') || res.url().includes('login') || res.url().includes('auth')) {
    console.log('RESPONSE:', res.status(), res.url());
  }
});

await page.goto('https://admin.angelmeet.ai/login', { waitUntil: 'networkidle', timeout: 30000 });
console.log('Initial URL:', page.url());

await page.locator('#email').fill(process.env.ADMIN_EMAIL || '');
await page.locator('#password').fill(process.env.ADMIN_PASSWORD || '');

// Click sign in and wait
const [response] = await Promise.all([
  page.waitForResponse(resp => resp.url().includes('login') || resp.url().includes('auth'), { timeout: 10000 }).catch(() => null),
  page.getByRole('button', { name: 'Sign in' }).click(),
]);

if (response) {
  console.log('Login response:', response.status(), response.url());
  try {
    const body = await response.text();
    console.log('Response body:', body.substring(0, 500));
  } catch (e) {}
}

// Wait for page changes
await page.waitForTimeout(3000);
console.log('Post-login URL:', page.url());

const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
console.log('Body text:', bodyText);

await browser.close();
