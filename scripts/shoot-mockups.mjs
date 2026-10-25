// Рендерит docs/mockups/index.html в PNG (нужен Playwright).
import { loadPlaywright } from './playwright.mjs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'mockups');
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('file://' + join(dir, 'index.html'));
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(dir, 'mockups-full.png'), fullPage: true });
for (const id of ['big', 'small', 'ui', 'eggs']) {
  await page.locator('#' + id).screenshot({ path: join(dir, `${id === 'big' ? 'workspace' : id === 'small' ? 'all-houses' : id}.png`) });
}
await browser.close();
if (errors.length) {
  console.error(errors);
  process.exit(1);
}
