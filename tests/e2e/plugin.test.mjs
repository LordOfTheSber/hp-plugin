/*
 * E2E на тестовом стенде (harness/): настоящий main.js-код и styles.css плагина
 * в Chromium поверх разметки, повторяющей DOM Obsidian, с заглушкой API obsidian.
 * Запуск: npm run test:e2e (нужен Playwright с Chromium).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlaywright } from '../../scripts/playwright.mjs';
import { HOUSE_IDS, MODES, palette, hexToRgb } from '../../src/houses.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const playwright = await loadPlaywright();
const rgb = (hex) => `rgb(${hexToRgb(hex).join(', ')})`;

// Контраст текста элемента с его фактическим фоном (первый непрозрачный предок)
function contrastInPage(selectors) {
  const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const out = {};
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (!el) { out[sel] = null; continue; }
    const fg = parse(getComputedStyle(el).color);
    let node = el;
    let bg = null;
    while (node && node.nodeType === 1) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c.length >= 3 && (c[3] === undefined || c[3] > 0.95)) { bg = c; break; }
      node = node.parentElement;
    }
    bg = bg || [255, 255, 255];
    const [a, b] = [lum(fg), lum(bg)];
    out[sel] = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }
  return out;
}

test('плагин на стенде Obsidian', { skip: !playwright && 'Playwright не установлен' }, async (t) => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 760 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + join(root, 'harness/index.html') + '?lang=ru');
  await page.evaluate(() => harness.ready);

  const style = (sel, prop) => page.$eval(sel, (el, p) => getComputedStyle(el)[p], prop);
  const bodyHas = (cls) => page.evaluate((c) => document.body.classList.contains(c), cls);
  const setMode = (mode) => page.evaluate((m) => harness.app.setTheme(m === 'common' ? 'obsidian' : 'moonstone'), mode);
  const typeOutsideEditor = async (text) => {
    await page.click('.nav-header');
    await page.keyboard.type(text);
  };

  try {
    await t.test('тема включается при загрузке', async () => {
      for (const cls of ['hp-theme', 'hp-house-gryffindor', 'hp-font-text', 'hp-font-headings', 'hp-ornaments']) {
        assert.ok(await bodyHas(cls), cls);
      }
      assert.ok(await bodyHas('hp-wand'), 'курсор-палочка по умолчанию включён');
    });

    for (const house of HOUSE_IDS) {
      for (const mode of MODES) {
        await t.test(`${house} / ${mode}: цвета и контраст`, async () => {
          await page.evaluate((h) => harness.plugin.setHouse(h), house);
          await setMode(mode);
          const p = palette(house, mode);
          assert.equal(await style('#preview', 'backgroundColor'), 'rgba(0, 0, 0, 0)');
          assert.equal(await style('.workspace-leaf-content[data-type="markdown"]', 'backgroundColor'), rgb(p.bg));
          assert.equal(await style('.mod-left-split', 'backgroundColor'), rgb(p.sidebar));
          assert.equal(await style('#para', 'color'), rgb(p.text));
          assert.equal(await style('#h2', 'color'), rgb(p.primary));
          assert.equal(await style('#inline-title', 'color'), rgb(p.primary));
          assert.equal(await style('#link', 'color'), rgb(p.link));
          const ratios = await page.evaluate(contrastInPage, [
            '#para', '#link', '#h2', '#inline-title', '#tag', '#code', '#active-file', '#editor',
            '#howler .callout-title', '[data-callout="prophecy"] .callout-title', '[data-callout="marauders"] .callout-content',
            '.status-bar .hp-status'
          ]);
          for (const [sel, r] of Object.entries(ratios)) assert.ok(r >= 4.5, `${sel}: ${r?.toFixed(2)}`);
        });
      }
    }

    await t.test('шрифты: Literata в заметках, Forum в заголовках, интерфейс и код без изменений', async () => {
      await page.evaluate(() => harness.plugin.setHouse('gryffindor'));
      await setMode('parchment');
      assert.match(await style('#para', 'fontFamily'), /HP Literata/);
      assert.match(await style('#editor', 'fontFamily'), /HP Literata/);
      assert.match(await style('#h2', 'fontFamily'), /HP Forum/);
      assert.match(await style('#inline-title', 'fontFamily'), /HP Forum/);
      assert.equal(await style('#h2', 'fontWeight'), '400');
      assert.doesNotMatch(await style('#active-file', 'fontFamily'), /Literata|Forum/);
      assert.doesNotMatch(await style('#code', 'fontFamily'), /Literata/);
      const ok = await page.evaluate(async () => {
        await document.fonts.ready;
        return document.fonts.check('16px "HP Literata"', 'Зельеварение') && document.fonts.check('16px "HP Forum"', 'Хогвартс');
      });
      assert.ok(ok, 'встроенные шрифты с кириллицей загружены');
    });

    await t.test('шрифт пользователя из настроек оформления важнее шрифта темы', async () => {
      await page.evaluate(() => document.body.style.setProperty('--font-text-override', '"My Font", serif'));
      assert.match(await style('#para', 'fontFamily'), /^"My Font"/);
      await page.evaluate(() => document.body.style.removeProperty('--font-text-override'));
    });

    await t.test('заклинания вне редактора: nox и lumos', async () => {
      await typeOutsideEditor('nox');
      await page.waitForFunction(() => document.body.classList.contains('theme-dark'));
      await typeOutsideEditor(' lumos');
      await page.waitForFunction(() => document.body.classList.contains('theme-light'));
    });

    await t.test('в редакторе заклинания не срабатывают', async () => {
      await page.click('#editor');
      await page.keyboard.type(' nox ');
      await page.waitForTimeout(900);
      assert.ok(await bodyHas('theme-light'));
    });

    await t.test('команда «Взмахнуть палочкой…»', async () => {
      await page.evaluate(() => harness.runCommand('wave-wand'));
      await page.fill('.hp-wand-input', 'Нокс!');
      await page.press('.hp-wand-input', 'Enter');
      await page.waitForFunction(() => document.body.classList.contains('theme-dark'));
      await page.evaluate(() => harness.runCommand('wave-wand'));
      await page.fill('.hp-wand-input', 'Алохомора');
      await page.press('.hp-wand-input', 'Enter');
      await page.waitForSelector('.notice:has-text("Ничего не произошло")');
      await setMode('parchment');
    });

    // Правая кнопка мыши зажата, фигура рисуется, кнопка отпускается
    const drawGesture = async (points) => {
      await page.mouse.move(...points[0]);
      await page.mouse.down({ button: 'right' });
      for (const p of points.slice(1)) await page.mouse.move(...p, { steps: 8 });
      await page.mouse.up({ button: 'right' });
    };

    await t.test('жесты палочкой: Нокс и Люмос штрихами, меню при этом не открывается', async () => {
      await page.evaluate(() => {
        window.hpMenus = 0;
        document.addEventListener('contextmenu', () => window.hpMenus++);
      });
      await drawGesture([[150, 260], [150, 520]]);
      await page.waitForFunction(() => document.body.classList.contains('theme-dark'));
      assert.ok(await page.isVisible('.hp-trail'), 'виден след палочки');
      await drawGesture([[150, 520], [152, 260]]);
      await page.waitForFunction(() => document.body.classList.contains('theme-light'));
      assert.equal(await page.evaluate(() => window.hpMenus), 0);
    });

    await t.test('обычный правый клик по-прежнему открывает контекстное меню', async () => {
      await page.mouse.click(150, 300, { button: 'right' });
      assert.equal(await page.evaluate(() => window.hpMenus), 1);
    });

    await t.test('непонятная фигура гаснет без заклинания', async () => {
      await drawGesture([[120, 300], [200, 330], [130, 380], [210, 420], [140, 300]]);
      await page.waitForSelector('.hp-trail.is-fizzled', { state: 'attached' });
      assert.ok(await bodyHas('theme-light'));
    });

    await t.test('«взмах и щелчок» поднимает абзац, на который указала палочка', async () => {
      const box = await page.locator('#para').boundingBox();
      const x = box.x + 40;
      const y = box.y + 10;
      await drawGesture([[x, y], [x + 70, y + 90], [x + 160, y], [x + 140, y + 45]]);
      await page.waitForFunction(() => document.getElementById('para').getAnimations().length > 0);
      await page.waitForSelector('.notice:has-text("Левиоса")');
    });

    await t.test('жесты отключаются в настройках', async () => {
      await page.evaluate(() => harness.plugin.settings.gestures = false);
      await drawGesture([[150, 260], [150, 520]]);
      await page.waitForTimeout(700);
      assert.ok(await bodyHas('theme-light'));
      assert.equal(await page.evaluate(() => window.hpMenus), 2, 'правая кнопка снова работает как обычно');
      await page.evaluate(() => harness.plugin.settings.gestures = true);
    });

    await t.test('лавка Олливандера: знаменитая палочка, своя палочка, курсор', async () => {
      // Курсор выключен — выбор палочки в лавке его включает
      await page.evaluate(() => { harness.plugin.settings.wandCursor = false; harness.plugin.applyTheme(); });
      assert.equal(await style('.nav-file-title', 'cursor'), 'default');
      await page.evaluate(() => harness.runCommand('wand-shop'));
      assert.equal(await page.locator('.hp-shop-preset').count(), 12);
      assert.equal(await page.getAttribute('.hp-shop-preset[data-preset="harry"]', 'aria-pressed'), 'true');
      assert.ok(!(await page.locator('.hp-shop-cursor .checkbox-container').evaluate((el) => el.classList.contains('is-enabled'))));
      await page.click('.hp-shop-preset[data-preset="hermione"]');
      assert.match(await page.textContent('.hp-shop-name'), /Гермионы/);
      assert.match(await page.textContent('.hp-shop-desc'), /Виноградная лоза, сердечная жила дракона, 10¾ дюйма/);
      assert.ok(await page.evaluate(() => harness.plugin.settings.wandCursor), 'выбор палочки включил курсор');
      assert.ok(await page.locator('.hp-shop-cursor .checkbox-container').evaluate((el) => el.classList.contains('is-enabled')));
      assert.equal(await page.inputValue('.hp-shop-form select >> nth=0'), 'vine');
      await page.selectOption('.hp-shop-form select >> nth=0', 'ebony');
      assert.equal(await page.textContent('.hp-shop-name'), 'Ваша собственная палочка');
      assert.equal(await page.locator('.hp-shop-preset.is-selected').count(), 0);
      await page.evaluate(() => document.querySelector('.modal-bg').click());
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('hp-harness-data'))['hp-theme'].wand?.wood === 'ebony');

      const wandCursor = /^image-set\(url\("data:image\/svg\+xml/;
      // Пустое место, файлы, вкладки, кнопки (у них курсор из --cursor, как в Obsidian) и режим чтения
      for (const sel of ['.nav-header', '.nav-file-title', '.workspace-tab-header', '.side-dock-ribbon-action', '.hp-status', '#para', '#h2']) {
        assert.match(await style(sel, 'cursor'), wandCursor, sel);
      }
      for (const sel of ['#editor', '.cm-line']) assert.equal(await style(sel, 'cursor'), 'auto', `${sel}: в редакторе — текстовый курсор`);
      assert.ok((await style('.nav-file-title', 'cursor')).includes(encodeURIComponent('#110c0a')), 'в курсоре выбранная палочка (эбен)');
      assert.equal(await style('#link', 'cursor'), 'pointer', 'на ссылках — рука');
      await page.evaluate(() => document.body.appendChild(Object.assign(document.createElement('input'), { type: 'text', id: 'hp-test-input' })));
      assert.equal(await style('#hp-test-input', 'cursor'), 'auto', 'в полях ввода — текстовый курсор');
      await page.evaluate(() => document.getElementById('hp-test-input').remove());

      // Выключить можно прямо в лавке
      await page.evaluate(() => harness.runCommand('wand-shop'));
      await page.click('.hp-shop-cursor .checkbox-container');
      await page.evaluate(() => document.querySelector('.modal-bg').click());
      assert.equal(await style('.nav-file-title', 'cursor'), 'default');
      assert.equal(await page.evaluate(() => harness.plugin.settings.wandCursor), false);
    });

    await t.test('Konami → снитч → +150 очков', async () => {
      await page.click('.nav-header');
      for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) {
        await page.keyboard.press(k);
      }
      const snitch = page.locator('[data-hp-snitch]');
      await snitch.waitFor();
      await snitch.evaluate((el) => el.click());
      await page.waitForFunction(() => document.querySelector('.hp-status').textContent.includes('150'));
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hp-harness-data'))['hp-theme']);
      assert.equal(saved.points.gryffindor, 150);
      assert.equal(saved.snitches, 1);
    });

    await t.test('mischief managed выключает тему, клятва возвращает', async () => {
      await typeOutsideEditor('mischief managed');
      await page.waitForFunction(() => !document.body.classList.contains('hp-theme'));
      assert.equal(await page.isVisible('.hp-status'), false);
      await typeOutsideEditor('I solemnly swear that I am up to no good');
      await page.waitForFunction(() => document.body.classList.contains('hp-theme'));
      await page.waitForSelector('.hp-map-card');
    });

    await t.test('Распределяющая шляпа', async () => {
      await page.evaluate(() => harness.runCommand('sorting-hat'));
      await page.waitForSelector('.hp-hat-text:not(:empty)');
      const verdict = await page.waitForSelector('.hp-hat-text.hp-verdict', { timeout: 8000 });
      const shout = await verdict.textContent();
      await page.waitForSelector('.hp-hat-modal', { state: 'detached', timeout: 8000 });
      const house = await page.evaluate(() => harness.plugin.settings.house);
      assert.ok(await bodyHas(`hp-house-${house}`));
      assert.equal(shout, { gryffindor: 'ГРИФФИНДОР!', slytherin: 'СЛИЗЕРИН!', ravenclaw: 'КОГТЕВРАН!', hufflepuff: 'ПУФФЕНДУЙ!' }[house]);
    });

    await t.test('вкладка настроек', async () => {
      await page.evaluate(() => harness.openSettings());
      assert.equal(await page.locator('.hp-house-card').count(), 4);
      await page.click('.hp-house-card[data-house="ravenclaw"]');
      assert.ok(await bodyHas('hp-house-ravenclaw'));
      assert.equal(await page.getAttribute('.hp-house-card[data-house="ravenclaw"]', 'aria-checked'), 'true');
      const ornaments = page.locator('.setting-item', { hasText: 'Орнаменты' }).locator('.checkbox-container');
      await ornaments.click();
      await page.waitForFunction(() => !document.body.classList.contains('hp-ornaments'));
      await ornaments.click();
      await page.waitForFunction(() => document.body.classList.contains('hp-ornaments'));
      assert.ok(await page.isVisible('.hp-wand-current svg'), 'в настройках видна палочка');
      await page.click('.hp-spellbook summary');
      assert.equal(await page.locator('.hp-spellbook-item').count(), 6);
      await page.click('.hp-crest', { clickCount: 3 });
      await page.waitForSelector('.hp-motto', { state: 'visible' });
      await page.evaluate(() => harness.closeSettings());
    });

    await t.test('меню факультетов из ленты', async () => {
      await page.click('.side-dock-ribbon-action');
      await page.waitForSelector('.menu');
      assert.equal(await page.locator('.menu .menu-item').count(), 7);
      await page.click('.menu-item:has-text("Пуффендуй")');
      assert.ok(await bodyHas('hp-house-hufflepuff'));
    });

    await t.test('секретные коллауты и Запретная секция', async () => {
      assert.equal(await style('#howler', 'animationName'), 'hp-howl');
      assert.match(await style('#restricted-children', 'filter'), /blur/);
      assert.equal(await style('#restricted', 'fontStyle'), 'italic');
    });

    await t.test('выгрузка плагина снимает все классы', async () => {
      await page.evaluate(() => harness.plugin.onunload());
      const left = await page.evaluate(() => [...document.body.classList].filter((c) => c.startsWith('hp-')));
      assert.deepEqual(left, []);
    });

    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
