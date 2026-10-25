#!/usr/bin/env node
/* Снимает скриншоты работающего расширения в docs/screenshots (нужен Playwright). */
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');

const EXT_DIR = path.resolve(__dirname, '..', 'extension');
const OUT = path.resolve(__dirname, '..', 'docs', 'screenshots');
const FIXTURE = fs.readFileSync(path.resolve(__dirname, '..', 'tests', 'fixtures', 'site.html'));

const extensionId = (dir) => [...crypto.createHash('sha256').update(dir).digest('hex').slice(0, 32)]
  .map((c) => String.fromCharCode(97 + parseInt(c, 16))).join('');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = http.createServer((req, res) => res.end(FIXTURE)).listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hp-shots-'));
  const ctx = await chromium.launchPersistentContext(dir, {
    channel: 'chromium', headless: true, viewport: { width: 900, height: 620 }, locale: 'ru-RU',
    env: { ...process.env, LANG: 'ru_RU.UTF-8', LANGUAGE: 'ru' },
    args: ['--lang=ru', `--disable-extensions-except=${EXT_DIR}`, `--load-extension=${EXT_DIR}`]
  });
  const id = extensionId(EXT_DIR);
  const popup = await ctx.newPage();
  await popup.setViewportSize({ width: 340, height: 600 });
  await popup.goto(`chrome-extension://${id}/popup/popup.html`);
  const set = (x) => popup.evaluate((v) => chrome.storage.sync.set(v), x);

  const page = await ctx.newPage();
  await page.goto(url);
  await page.waitForSelector('#late[data-hp-bg]');

  await set({ enabled: false });
  await page.waitForSelector('html:not([data-hp-theme])');
  await page.screenshot({ path: path.join(OUT, 'before.png') });
  await set({ enabled: true });

  for (const house of ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff']) {
    for (const mode of ['parchment', 'common']) {
      await set({ house, mode });
      await page.waitForSelector(`html[data-hp-theme="${house}"][data-hp-mode="${mode}"]`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(OUT, `page-${house}-${mode}.png`) });
      await popup.waitForTimeout(100);
      await popup.screenshot({ path: path.join(OUT, `popup-${house}-${mode}.png`), fullPage: true });
    }
  }

  // Пасхалки
  await set({ house: 'gryffindor', mode: 'parchment' });
  await page.bringToFront();
  await page.mouse.click(450, 330);
  await page.keyboard.type('accio snitch');
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUT, 'egg-snitch.png') });
  await page.keyboard.type(' I solemnly swear that I am up to no good');
  await page.waitForTimeout(2600);
  await page.screenshot({ path: path.join(OUT, 'egg-map.png') });

  await ctx.close();
  server.close();
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('saved to', OUT);
})();
