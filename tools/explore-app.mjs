import { chromium } from 'playwright';

const BASE_URL = 'https://app.angelmeet.ai';

const pages = [
  { path: '/home', auth: true },
  { path: '/meetings', auth: true },
  { path: '/calendar', auth: true },
  { path: '/ai-notes', auth: true },
  { path: '/webinars', auth: true },
  { path: '/usage', auth: true },
  { path: '/billing', auth: true },
  { path: '/settings', auth: true },
  { path: '/forgot', auth: false },
  { path: '/register', auth: false },
  { path: '/login', auth: false },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  storageState: '.auth/user.json',
});
const page = await context.newPage();

for (const p of pages) {
  const url = `${BASE_URL}${p.path}`;
  console.log(`\n${'='.repeat(80)}`);
  console.log(`PAGE: ${url}`);
  console.log(`AUTH: ${p.auth ? 'required (using storage state)' : 'none'}`);
  console.log(`${'='.repeat(80)}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    // URL after navigation (may have redirected)
    console.log(`\nFinal URL: ${page.url()}`);

    // Title
    const title = await page.title();
    console.log(`Title: ${title}`);

    // Headings
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', els =>
      els.map(e => ({ tag: e.tagName, text: e.innerText.trim() })).filter(h => h.text)
    );
    console.log(`\nHeadings (${headings.length}):`);
    headings.forEach(h => console.log(`  [${h.tag}] ${h.text}`));

    // Buttons
    const buttons = await page.$$eval('button, [role="button"], input[type="submit"], input[type="button"]', els =>
      els.map(e => ({ tag: e.tagName, text: (e.innerText || e.value || '').trim(), type: e.type || '', ariaLabel: e.getAttribute('aria-label') || '' })).filter(b => b.text || b.ariaLabel)
    );
    console.log(`\nButtons (${buttons.length}):`);
    buttons.forEach(b => console.log(`  <${b.tag}> text="${b.text}" type="${b.type}" aria-label="${b.ariaLabel}"`));

    // Links
    const links = await page.$$eval('a[href]', els =>
      els.map(e => ({ text: e.innerText.trim(), href: e.getAttribute('href') })).filter(l => l.href)
    );
    console.log(`\nLinks (${links.length}):`);
    links.forEach(l => console.log(`  text="${l.text}" href="${l.href}"`));

    // Input fields
    const inputs = await page.$$eval('input, textarea, select', els =>
      els.map(e => ({
        tag: e.tagName,
        type: e.type || '',
        name: e.name || '',
        placeholder: e.placeholder || '',
        id: e.id || '',
        ariaLabel: e.getAttribute('aria-label') || '',
        value: e.type === 'password' ? '[hidden]' : (e.value || ''),
      }))
    );
    console.log(`\nInput Fields (${inputs.length}):`);
    inputs.forEach(i => console.log(`  <${i.tag}> type="${i.type}" name="${i.name}" placeholder="${i.placeholder}" id="${i.id}" aria-label="${i.ariaLabel}" value="${i.value}"`));

    // Dialogs
    const dialogs = await page.$$eval('[role="dialog"], dialog, [aria-modal="true"]', els =>
      els.map(e => ({ tag: e.tagName, text: e.innerText.trim().substring(0, 200), role: e.getAttribute('role') || '' }))
    );
    console.log(`\nDialogs (${dialogs.length}):`);
    dialogs.forEach(d => console.log(`  <${d.tag}> role="${d.role}" text="${d.text}"`));

    // Forms
    const forms = await page.$$eval('form', els =>
      els.map(e => ({ action: e.action || '', method: e.method || '', id: e.id || '', text: e.innerText.trim().substring(0, 100) }))
    );
    console.log(`\nForms (${forms.length}):`);
    forms.forEach(f => console.log(`  action="${f.action}" method="${f.method}" id="${f.id}" text="${f.text}"`));

    // Navigation items
    const navItems = await page.$$eval('nav a, [role="navigation"] a, nav button, [role="navigation"] button, [role="menuitem"]', els =>
      els.map(e => ({ tag: e.tagName, text: e.innerText.trim(), href: e.getAttribute('href') || '', role: e.getAttribute('role') || '' })).filter(n => n.text)
    );
    console.log(`\nNavigation Items (${navItems.length}):`);
    navItems.forEach(n => console.log(`  <${n.tag}> text="${n.text}" href="${n.href}" role="${n.role}"`));

    // Full accessibility snapshot
    console.log(`\n--- Accessibility Snapshot ---`);
    const snapshot = await page.accessibility.snapshot({ interestingOnly: false });
    console.log(JSON.stringify(snapshot, null, 2).substring(0, 5000));
    console.log('...(truncated)');

  } catch (err) {
    console.log(`\nERROR navigating to ${url}: ${err.message}`);
  }
}

await browser.close();
console.log('\n\nDone.');
