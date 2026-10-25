/*
 * E2E: загружаем распакованное расширение в Chromium (Playwright) и проверяем
 * тему, адаптивную перекраску, попап и пасхалки на тестовой странице.
 * Запуск: npm run test:e2e (нужен установленный Playwright с Chromium).
 */
const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

let playwright = null;
try {
  playwright = require('playwright');
} catch (e) {
  // без Playwright e2e пропускаются
}

const EXT_DIR = path.resolve(__dirname, '..', '..', 'extension');
const FIXTURE = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'site.html'));
const { HOUSES } = require('../../extension/shared/houses.js');

// ID распакованного расширения в Chromium вычисляется из абсолютного пути.
function extensionId(dir) {
  const hex = crypto.createHash('sha256').update(dir).digest('hex').slice(0, 32);
  return [...hex].map((c) => String.fromCharCode('a'.charCodeAt(0) + parseInt(c, 16))).join('');
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

test('расширение в браузере', { skip: !playwright && 'Playwright не установлен' }, async (t) => {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(FIXTURE);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${server.address().port}/`;

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hp-e2e-'));
  const context = await playwright.chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium',
    headless: true,
    args: [`--disable-extensions-except=${EXT_DIR}`, `--load-extension=${EXT_DIR}`]
  });
  const id = extensionId(EXT_DIR);

  const style = (page, sel, prop) => page.$eval(sel, (el, p) => getComputedStyle(el)[p], prop);
  const popupPage = async () => {
    const p = await context.newPage();
    await p.goto(`chrome-extension://${id}/popup/popup.html`);
    await p.waitForSelector('.house[aria-checked="true"]');
    return p;
  };
  const setSettings = async (patch) => {
    const p = await popupPage();
    await p.evaluate((x) => chrome.storage.sync.set(x), patch);
    await p.close();
  };

  try {
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForSelector('html[data-hp-theme]');
    await page.waitForSelector('#late[data-hp-bg]');

    await t.test('по умолчанию: Гриффиндор, полное оформление', async () => {
      await setSettings({ mode: 'parchment' });
      await page.waitForSelector('html[data-hp-mode="parchment"]');
      const p = HOUSES.gryffindor.palettes.parchment;
      assert.strictEqual(await page.getAttribute('html', 'data-hp-theme'), 'gryffindor');
      assert.strictEqual(await style(page, 'body', 'backgroundColor'), hexToRgb(p.bg));
      assert.strictEqual(await style(page, '#para', 'color'), hexToRgb(p.text));
      assert.strictEqual(await style(page, '#box', 'backgroundColor'), hexToRgb(p.surface));
      assert.strictEqual(await style(page, '#link', 'color'), hexToRgb(p.link));
      assert.strictEqual(await style(page, '#title', 'color'), hexToRgb(p.primary));
      assert.strictEqual(await style(page, '#meta', 'color'), hexToRgb(p.muted));
      assert.strictEqual(await style(page, '#late', 'backgroundColor'), hexToRgb(p.surface), 'динамически добавленный блок');
    });

    await t.test('брендовые и тёмные блоки не перекрашиваются', async () => {
      assert.strictEqual(await style(page, '#top', 'backgroundColor'), 'rgb(51, 51, 51)');
      assert.strictEqual(await style(page, '#top', 'color'), 'rgb(255, 255, 255)');
      assert.strictEqual(await style(page, '#top-link', 'color'), 'rgb(255, 255, 255)');
      assert.strictEqual(await style(page, '#cta', 'backgroundColor'), 'rgb(26, 115, 232)');
      assert.strictEqual(await style(page, '#cta', 'color'), 'rgb(255, 255, 255)');
      assert.strictEqual(await style(page, '#brand', 'color'), 'rgb(173, 20, 87)', 'читаемый брендовый цвет сохранён');
      assert.strictEqual(await style(page, '#pale', 'color'), hexToRgb(HOUSES.gryffindor.palettes.parchment.text),
        'нечитаемый на пергаменте жёлтый заменён цветом текста');
    });

    await t.test('читаемые шрифты: Literata в тексте, Forum в заголовках, код и иконки нетронуты', async () => {
      assert.match(await style(page, '#para', 'fontFamily'), /HP Literata/);
      assert.match(await style(page, '#title', 'fontFamily'), /HP Forum/);
      assert.doesNotMatch(await style(page, '#pre code', 'fontFamily'), /Literata/);
      assert.doesNotMatch(await style(page, '#icon', 'fontFamily'), /Literata/);
      const loaded = await page.evaluate(async () => {
        await document.fonts.ready;
        return document.fonts.check('16px "HP Literata"', 'Гиппогриф') && document.fonts.check('16px "HP Forum"', 'Хогвартс');
      });
      assert.ok(loaded, 'шрифты расширения загружены');
    });

    for (const house of ['slytherin', 'ravenclaw', 'hufflepuff']) {
      await t.test(`факультет ${house}, гостиная`, async () => {
        await setSettings({ house, mode: 'common' });
        await page.waitForSelector(`html[data-hp-theme="${house}"][data-hp-mode="common"]`);
        const p = HOUSES[house].palettes.common;
        assert.strictEqual(await style(page, 'body', 'backgroundColor'), hexToRgb(p.bg));
        assert.strictEqual(await style(page, '#para', 'color'), hexToRgb(p.text));
        assert.strictEqual(await style(page, '#box', 'backgroundColor'), hexToRgb(p.surface));
        assert.strictEqual(await style(page, '#input', 'color'), hexToRgb(p.text), 'текст в поле ввода читаем');
      });
    }

    await t.test('режим «акценты» не трогает цвета сайта', async () => {
      await setSettings({ intensity: 'accents' });
      await page.waitForSelector('html[data-hp-intensity="accents"]');
      assert.strictEqual(await style(page, 'body', 'backgroundColor'), 'rgb(255, 255, 255)');
      assert.strictEqual(await page.$$eval('[data-hp-bg],[data-hp-fg]', (els) => els.length), 0);
      assert.match(await style(page, '#title', 'fontFamily'), /HP Forum/);
      await setSettings({ intensity: 'full', house: 'gryffindor', mode: 'parchment' });
      await page.waitForSelector('html[data-hp-intensity="full"][data-hp-theme="gryffindor"][data-hp-mode="parchment"]');
    });

    await t.test('пасхалки: nox и lumos', async () => {
      await page.click('#para');
      await page.keyboard.type('nox');
      await page.waitForSelector('html[data-hp-mode="common"]');
      await page.keyboard.type(' lumos');
      await page.waitForSelector('html[data-hp-mode="parchment"]');
    });

    await t.test('заклинания в поле ввода не срабатывают', async () => {
      await page.click('#input');
      await page.keyboard.type('nox');
      await page.waitForTimeout(800);
      assert.strictEqual(await page.getAttribute('html', 'data-hp-mode'), 'parchment');
    });

    await t.test('пасхалка: снитч приносит 150 очков', async () => {
      await page.click('#para');
      for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) {
        await page.keyboard.press(k);
      }
      const snitch = page.locator('#hp-theme-overlay [data-hp-snitch]');
      await snitch.waitFor();
      await snitch.evaluate((el) => el.click());
      const popup = await popupPage();
      await popup.waitForFunction(() => document.querySelector('#points').textContent.includes('150'));
      await popup.close();
    });

    await t.test('пасхалка: mischief managed выключает тему, клятва возвращает', async () => {
      await page.click('#para');
      await page.keyboard.type('mischief managed');
      await page.waitForSelector('html:not([data-hp-theme])');
      assert.strictEqual(await style(page, 'body', 'backgroundColor'), 'rgb(255, 255, 255)');
      await page.keyboard.type('I solemnly swear that I am up to no good');
      await page.waitForSelector('html[data-hp-theme]');
    });

    await t.test('попап: выбор факультета и отключение на сайте', async () => {
      const popup = await popupPage();
      assert.strictEqual(await popup.locator('.house').count(), 4);
      await popup.click('.house[data-house="ravenclaw"]');
      await page.waitForSelector('html[data-hp-theme="ravenclaw"]');
      // Сайт отключается через disabledHosts — так же, как кнопка в попапе
      await popup.evaluate(() => chrome.storage.sync.set({ disabledHosts: ['127.0.0.1'] }));
      await page.waitForSelector('html:not([data-hp-theme])');
      await popup.evaluate(() => chrome.storage.sync.set({ disabledHosts: [] }));
      await page.waitForSelector('html[data-hp-theme]');
      await popup.close();
    });

    await t.test('попап: Распределяющая шляпа выбирает факультет', async () => {
      const popup = await popupPage();
      await popup.emulateMedia({ reducedMotion: 'reduce' });
      await popup.click('#sort');
      await popup.waitForSelector('#hat-text.verdict');
      await popup.waitForSelector('#hat', { state: 'hidden' });
      const house = await popup.getAttribute('.house[aria-checked="true"]', 'data-house');
      assert.ok(Object.keys(HOUSES).includes(house));
      await popup.close();
    });
  } finally {
    await context.close();
    server.close();
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
});
