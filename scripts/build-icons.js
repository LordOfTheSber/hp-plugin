#!/usr/bin/env node
/* Рендерит иконки расширения из shared/crest.js в PNG (нужен Playwright). */
const path = require('path');
const { chromium } = require('playwright');
const { hogwartsSvg } = require('../extension/shared/crest.js');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const size of [16, 32, 48, 128]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent">${hogwartsSvg(size)}</body></html>`);
    const out = path.join(__dirname, '..', 'extension', 'icons', `icon-${size}.png`);
    await page.locator('svg').screenshot({ path: out, omitBackground: true });
    console.log('wrote', out);
  }
  await browser.close();
})();
