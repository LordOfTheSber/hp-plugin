// Скриншоты плагина на тестовом стенде → docs/screenshots (нужен Playwright).
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlaywright } from './playwright.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs', 'screenshots');
mkdirSync(out, { recursive: true });

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 720 } });
const url = 'file://' + join(root, 'harness/index.html') + '?lang=ru';
const shot = (name) => page.screenshot({ path: join(out, `${name}.png`) });
const setMode = (mode) => page.evaluate((m) => harness.app.setTheme(m === 'common' ? 'obsidian' : 'moonstone'), mode);

await page.goto(url);
await page.evaluate(() => localStorage.clear());
await page.goto(url);
await page.evaluate(() => harness.ready);
await page.evaluate(() => document.fonts.ready);

// «До»: стандартная тема стенда без плагина
// (в Obsidian элементы статус-бара плагина удаляются при выгрузке, на стенде прячем вручную)
await page.evaluate(() => harness.plugin.onunload());
await page.evaluate(() => document.querySelector('.hp-status').style.setProperty('visibility', 'hidden'));
await shot('before');
await page.evaluate(() => document.querySelector('.hp-status').style.removeProperty('visibility'));
await page.evaluate(() => harness.plugin.applyTheme());

for (const house of ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff']) {
  for (const mode of ['parchment', 'common']) {
    await page.evaluate((h) => harness.plugin.setHouse(h), house);
    await setMode(mode);
    await page.waitForTimeout(100);
    await shot(`${house}-${mode}`);
  }
}

await page.evaluate(() => harness.plugin.setHouse('ravenclaw'));
await setMode('parchment');
await page.evaluate(() => harness.openSettings());
await page.waitForTimeout(100);
await shot('settings');
await page.evaluate(() => { harness.plugin.settings.points = { gryffindor: 310, slytherin: 420, ravenclaw: 280, hufflepuff: 190 }; harness.openSettings(); });
await page.locator('.hp-cup').scrollIntoViewIfNeeded();
await page.waitForTimeout(100);
await shot('house-cup');
await page.evaluate(() => harness.closeSettings());

await page.evaluate(() => harness.plugin.setHouse('slytherin'));
await page.click('.side-dock-ribbon-action');
await page.waitForTimeout(100);
await shot('menu');
await page.keyboard.press('Escape');
await page.click('.nav-header');

await setMode('common');
await page.evaluate(() => harness.plugin.setHouse('hufflepuff'));
await page.evaluate(() => harness.runCommand('sorting-hat'));
await page.click('.hp-hat-quiz');
await page.click('.hp-hat-answer[data-house="hufflepuff"]');
await page.waitForTimeout(300);
await shot('sorting-hat');
for (let i = 1; i < 6; i++) await page.click('.hp-hat-answer[data-house="hufflepuff"]');
await page.waitForSelector('.hp-hat-modal', { state: 'detached', timeout: 10000 });

await page.evaluate(() => harness.plugin.setHouse('gryffindor'));
await page.evaluate(() => harness.runCommand('wave-wand'));
await page.fill('.hp-wand-input', 'Lumos');
await shot('wand');
await page.press('.hp-wand-input', 'Enter');
await page.waitForTimeout(1300);

// Лавка Олливандера и след палочки
await page.evaluate(() => harness.runCommand('wand-shop'));
await page.click('.hp-shop-preset[data-preset="dumbledore"]');
await page.waitForTimeout(100);
await shot('wand-shop');
await page.click('.hp-shop-preset[data-preset="harry"]');
await page.evaluate(() => document.querySelector('.modal-bg').click());
await setMode('common');
await page.mouse.move(560, 300);
await page.mouse.down({ button: 'right' });
for (let i = 1; i <= 28; i++) {
  const a = -Math.PI / 2 + (i / 32) * Math.PI * 2;
  await page.mouse.move(560 + Math.cos(a) * 110, 410 + Math.sin(a) * 110, { steps: 2 });
}
await shot('gesture');
// Круг — «Акцио снитч»: снитч из этого жеста снимается ниже
await page.mouse.up({ button: 'right' });
await setMode('parchment');

await page.click('.nav-header');
await page.keyboard.type('accio snitch'); // снитч уже летит после жеста — заклинание его не удвоит
await page.mouse.move(0, 0);
await page.waitForFunction(() => {
  const r = document.querySelector('[data-hp-snitch]')?.getBoundingClientRect();
  return r && r.left > 200 && r.right < innerWidth - 200 && r.top > 120 && r.bottom < innerHeight - 120;
}, null, { timeout: 20000, polling: 50 });
await shot('egg-snitch');
await page.keyboard.type(' I solemnly swear that I am up to no good');
await page.waitForTimeout(2600);
await shot('egg-map');

// Клятва открыла Карту Мародёров: путь к заметке в Запретной секции
await page.waitForTimeout(2800);
await page.evaluate(() => document.querySelectorAll('.notice, .hp-footprint, [data-hp-snitch]').forEach((n) => n.remove()));
await page.evaluate(() => document.activeElement?.blur());
await page.evaluate(() => harness.plugin.map.setRoute('Хогвартс/Зельеварение.md', 'Запретная секция/Тайны крестражей.md'));
await page.hover('.hp-map-node[data-path="Хогвартс/Расписание.md"]');
await page.waitForTimeout(300);
await shot('marauders-map');

await browser.close();
console.log('saved to', out);
