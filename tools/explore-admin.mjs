import { chromium } from 'playwright';

const BASE_URL = 'https://admin.angelmeet.ai';
const EMAIL = 'avi100147@gmail.com';
const PASSWORD = '$uper@dmin4MYadmin';

async function capturePageSnapshot(page, label) {
  console.log('\n' + '='.repeat(80));
  console.log(`SNAPSHOT: ${label}`);
  console.log(`URL: ${page.url()}`);
  console.log('='.repeat(80));

  const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', els =>
    els.map(el => ({ tag: el.tagName.toLowerCase(), text: el.innerText.trim() }))
  );
  if (headings.length) {
    console.log('\n[HEADINGS]');
    headings.forEach(h => console.log(`  <${h.tag}> ${h.text}`));
  }

  const buttons = await page.$$eval('button, [role="button"], input[type="submit"]', els =>
    els.map(el => ({ tag: el.tagName.toLowerCase(), text: (el.innerText || el.value || '').trim(), type: el.type || '', id: el.id || '' }))
  );
  if (buttons.length) {
    console.log('\n[BUTTONS]');
    buttons.forEach(b => console.log(`  <${b.tag}> "${b.text}" type=${b.type} id=${b.id}`));
  }

  const links = await page.$$eval('a[href]', els =>
    els.map(el => ({ text: el.innerText.trim(), href: el.getAttribute('href') }))
  );
  if (links.length) {
    console.log('\n[LINKS]');
    links.forEach(l => console.log(`  "${l.text}" -> ${l.href}`));
  }

  const inputs = await page.$$eval('input, textarea, select', els =>
    els.map(el => ({
      tag: el.tagName.toLowerCase(),
      type: el.type || '',
      name: el.name || '',
      id: el.id || '',
      placeholder: el.placeholder || '',
      required: el.required
    }))
  );
  if (inputs.length) {
    console.log('\n[INPUT FIELDS]');
    inputs.forEach(i => console.log(`  <${i.tag}> type=${i.type} name=${i.name} id=${i.id} placeholder="${i.placeholder}"`));
  }

  const tables = await page.$$eval('table', tables =>
    tables.map((table, i) => {
      const headers = [...table.querySelectorAll('th')].map(th => th.innerText.trim());
      const rowCount = table.querySelectorAll('tbody tr').length;
      return { index: i, headers, rowCount };
    })
  );
  if (tables.length) {
    console.log('\n[TABLES]');
    tables.forEach(t => {
      console.log(`  Table ${t.index}: ${t.rowCount} data rows, Headers: [${t.headers.join(' | ')}]`);
    });
  }

  const labels = await page.$$eval('label', els =>
    els.map(el => ({ text: el.innerText.trim(), for: el.htmlFor || '' }))
  );
  if (labels.length) {
    console.log('\n[LABELS]');
    labels.forEach(l => console.log(`  "${l.text}" for=${l.for}`));
  }

  const selects = await page.$$eval('select', els =>
    els.map(el => {
      const options = [...el.options].map(o => ({ value: o.value, text: o.text }));
      return { name: el.name || '', id: el.id || '', options };
    })
  );
  if (selects.length) {
    console.log('\n[SELECT DROPDOWNS]');
    selects.forEach(s => {
      console.log(`  <select> name=${s.name} id=${s.id}`);
      s.options.forEach(o => console.log(`    option: value="${o.value}" text="${o.text}"`));
    });
  }

  const bodyText = await page.$eval('body', el => el.innerText).catch(() => '');
  console.log('\n[PAGE TEXT (first 5000 chars)]');
  console.log(bodyText.substring(0, 5000));
}

const SIDEBAR_ITEMS = [
  'Overview',
  'Tenants',
  'Live now',
  'Meetings',
  'Usage',
  'Analytics',
  'Economics',
  'Plans & Billing',
  'Feature Flags',
  'AI',
  'Notifications',
  'Integrations',
  'Settings',
  'Audit Log',
  'Security',
  'System Health',
  'Admins & Roles'
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Log all console messages for debugging
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`  [CONSOLE ERROR] ${msg.text()}`);
  });

  try {
    // 1. Login
    console.log('=== PHASE 1: LOGIN ===');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    await page.fill('#email', EMAIL);
    await page.fill('#password', PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for sidebar buttons to appear
    await page.waitForFunction(() => {
      const buttons = document.querySelectorAll('button');
      return [...buttons].some(b => b.textContent.trim() === 'Overview');
    }, { timeout: 15000 });
    await page.waitForTimeout(2000);

    console.log('Login successful! Dashboard loaded.');

    // 2. Capture the dashboard
    console.log('\n\n=== PHASE 2: DASHBOARD (Overview) ===');
    await capturePageSnapshot(page, 'Dashboard Overview');

    // 3. Explore each sidebar module by clicking via evaluate
    console.log('\n\n=== PHASE 3: SIDEBAR NAVIGATION ===');

    for (const itemName of SIDEBAR_ITEMS) {
      console.log(`\n\n--- Navigating to: "${itemName}" ---`);

      try {
        // Use page.evaluate to find and click the button directly
        const clicked = await page.evaluate((name) => {
          const buttons = document.querySelectorAll('button');
          for (const btn of buttons) {
            if (btn.textContent.trim() === name) {
              btn.click();
              return true;
            }
          }
          return false;
        }, itemName);

        if (clicked) {
          await page.waitForTimeout(2500);
          await capturePageSnapshot(page, itemName);
        } else {
          console.log(`  Button "${itemName}" not found in DOM.`);
        }
      } catch (e) {
        console.log(`  Error navigating to "${itemName}": ${e.message}`);
      }
    }

    console.log('\n\n' + '='.repeat(80));
    console.log('ALL SIDEBAR MODULES EXPLORED');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Fatal error:', error.message);
    await page.screenshot({ path: 'tools/error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

main();
