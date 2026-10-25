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
            '#spell .callout-title', '#potion .callout-title', '#owl .callout-title', '#cloak .callout-title',
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
      assert.equal(await page.evaluate(() => harness.app.vault.config.theme), undefined, 'настройка темы Obsidian не тронута');
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

    await t.test('Alt + правая кнопка: жест и в тексте заметки', async () => {
      // Уведомления в углу закрывают редактор
      await page.evaluate(() => document.querySelectorAll('.notice').forEach((n) => n.remove()));
      const box = await page.locator('#editor').boundingBox();
      const x = box.x + 120;
      const menus = () => page.evaluate(() => window.hpMenus);
      // Как на macOS и Linux: контекстное меню приходит сразу при нажатии кнопки
      const drawLinux = async (alt) => {
        if (alt) await page.keyboard.down('Alt');
        await page.mouse.move(x, box.y + 20);
        await page.mouse.down({ button: 'right' });
        await page.evaluate(([cx, cy, altKey]) => document.elementFromPoint(cx, cy).dispatchEvent(new MouseEvent('contextmenu',
          { bubbles: true, cancelable: true, clientX: cx, clientY: cy, button: 2, buttons: 2, altKey })), [x, box.y + 20, alt]);
        await page.mouse.move(x, box.y + 150, { steps: 8 });
        await page.mouse.up({ button: 'right' });
        if (alt) await page.keyboard.up('Alt');
      };
      const before = await menus();
      await drawLinux(false);
      await page.waitForTimeout(700);
      assert.ok(await bodyHas('theme-light'), 'без Alt жеста в тексте нет');
      assert.ok(await menus() > before, 'меню с орфографией открылось сразу');
      const withAlt = await menus();
      await drawLinux(true);
      await page.waitForFunction(() => document.body.classList.contains('theme-dark'));
      assert.equal(await menus(), withAlt, 'с Alt меню не мешает');
      await setMode('parchment');
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
      // Без прямоугольной рамки кнопки: ни фона, ни рамки, ни тени
      const look = await snitch.evaluate((el) => {
        const cs = getComputedStyle(el);
        return [cs.backgroundColor, cs.borderTopWidth, cs.boxShadow, cs.outlineStyle, cs.height];
      });
      assert.deepEqual(look, ['rgba(0, 0, 0, 0)', '0px', 'none', 'none', '34px']);
      await snitch.evaluate((el) => el.click());
      await page.waitForFunction(() => document.querySelector('.hp-status').textContent.includes('150'));
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hp-harness-data'))['hp-theme']);
      assert.equal(saved.points.gryffindor, 150);
      assert.equal(saved.snitches, 1);
    });

    // Уведомления справа сверху закрывают боковую панель
    const clearNotices = () => page.evaluate(() => document.querySelectorAll('.notice').forEach((n) => n.remove()));

    await t.test('Карта Мародёров: где я, переходы, следы', async () => {
      await clearNotices();
      const here = () => page.getAttribute('.hp-map-node.is-here', 'data-path');
      const ring1 = () => page.$$eval('.hp-map-node.ring-1', (els) => els.map((el) => el.dataset.path).sort());
      await page.evaluate(() => harness.runCommand('marauders-map'));
      await page.waitForSelector('.hp-marauders .hp-marauders-svg');
      assert.equal(await here(), 'Хогвартс/Зельеварение.md');
      assert.deepEqual(await ring1(), ['#домашка', '#зелья', 'Ингредиенты/Безоар.md', 'Люди/Северус Снегг.md', 'Хогвартс/Расписание.md']);
      assert.ok(await page.isVisible('.hp-map-node.is-tag[data-path="#зелья"] path.hp-map-dot'), 'тег — ромбик');
      assert.ok(await page.locator('.hp-map-edge.is-tag').count(), 'тропинки через теги');
      assert.ok(await page.isVisible('.hp-legend-tag'));
      assert.ok(await page.locator('.hp-map-edge.is-both').count(), 'Расписание ссылается в ответ');
      assert.ok(await page.locator('.hp-map-edge.is-backlink').count(), 'на Безоар ссылается Гермиона — обратная ссылка');
      assert.equal(await page.textContent('.hp-map-node.is-here .hp-map-here'), 'вы здесь');
      // Дальний круг подписан при наведении
      const far = page.locator('.hp-map-node.ring-2[data-path="Хогвартс/Квиддич.md"] .hp-map-label');
      assert.equal(await far.evaluate((el) => getComputedStyle(el).opacity), '0');

      await page.click('.hp-map-node[data-path="Хогвартс/Расписание.md"]');
      await page.waitForFunction(() => harness.app.workspace.getActiveFile().path === 'Хогвартс/Расписание.md');
      assert.equal(await here(), 'Хогвартс/Расписание.md');
      assert.equal(await page.textContent('#inline-title'), 'Расписание');
      assert.deepEqual(await page.$$eval('.hp-map-footprint', (els) => els.map((el) => el.textContent)), ['Зельеварение']);

      // С клавиатуры: Tab до заметки на карте и Enter
      await page.focus('.hp-map-node[data-path="Хогвартс/Квиддич.md"]');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => harness.app.workspace.getActiveFile().path === 'Хогвартс/Квиддич.md');
      await page.click('.hp-map-footprint:has-text("Расписание")');
      await page.waitForFunction(() => harness.app.workspace.getActiveFile().path === 'Хогвартс/Расписание.md');
    });

    await t.test('Карта Мародёров: путь к заметке, следующий шаг, навигатор', async () => {
      await clearNotices();
      const steps = () => page.$$eval('.hp-marauders-steps .hp-map-step-name', (els) => els.map((el) => el.textContent));
      await page.evaluate(() => harness.runCommand('marauders-route'));
      await page.click('.suggestion-item:has-text("Тайны крестражей")');
      await page.waitForSelector('.hp-marauders-steps');
      assert.deepEqual(await steps(), ['Расписание', 'Зельеварение', 'Безоар', 'Гермиона Грейнджер', 'Библиотека', 'Тайны крестражей']);
      assert.match(await page.textContent('.hp-marauders-note'), /Шагов: 5/);
      assert.match(await page.textContent('.hp-marauders-steps li:nth-child(4) .hp-map-step-hint'), /обратная ссылка/);
      assert.ok(await page.locator('.hp-map-steps ellipse').count() >= 4, 'следы по маршруту на карте');
      assert.equal(await page.getAttribute('.hp-map-node.is-next', 'data-path'), 'Хогвартс/Зельеварение.md');

      await page.click('.hp-map-next');
      await page.waitForFunction(() => harness.app.workspace.getActiveFile().path === 'Хогвартс/Зельеварение.md');
      assert.equal((await steps())[0], 'Зельеварение');
      assert.equal(await page.getAttribute('.hp-map-node.is-next', 'data-path'), 'Ингредиенты/Безоар.md');

      // Свернули с пути — путь перестраивается
      await page.click('.hp-map-node[data-path="Люди/Северус Снегг.md"]');
      await page.waitForSelector('.hp-marauders-note:has-text("свернули")');
      assert.equal((await steps())[0], 'Северус Снегг');

      // Командой «Следующий шаг» — до цели
      for (let i = 0; i < 8 && await page.evaluate(() => !!harness.plugin.map.route); i++) {
        await page.evaluate(() => harness.runCommand('marauders-next'));
      }
      await page.waitForSelector('.notice:has-text("Вы на месте: «Тайны крестражей»")');
      assert.equal(await page.evaluate(() => harness.app.workspace.getActiveFile().path), 'Запретная секция/Тайны крестражей.md');
      assert.equal(await page.locator('.hp-marauders-steps').count(), 0);
      assert.ok(await page.isVisible('.hp-marauders-route .hp-map-plan'));
      assert.match(await style('.hp-map-node.is-here', 'filter'), /none/, 'на центре Запретная секция не размыта');
    });

    await t.test('Карта Мародёров: путь через общий тег, поиск по тегу, выключение тегов', async () => {
      await clearNotices();
      const steps = () => page.$$eval('.hp-marauders-steps .hp-map-step-name', (els) => els.map((el) => el.textContent));
      await page.evaluate(() => harness.app.workspace.setActiveFile(harness.app.vault.getAbstractFileByPath('Хогвартс/Зельеварение.md')));
      await page.evaluate(() => harness.runCommand('marauders-route'));
      await page.click('.suggestion-item:has-text("Дневник/Сны")');
      await page.waitForSelector('.hp-marauders-steps');
      assert.deepEqual(await steps(), ['Зельеварение', 'Сны'], 'тег — не шаг, а способ пройти');
      assert.equal(await page.textContent('.hp-marauders-steps li:nth-child(2) .hp-map-step-hint'), 'общий тег #домашка');
      assert.ok(await page.locator('.hp-map-node.is-tag.is-route[data-path="#домашка"]').count());
      assert.equal(await page.getAttribute('.hp-map-node.is-next', 'data-path'), 'Дневник/Сны.md');

      await page.click('.hp-map-node[data-path="#домашка"]');
      assert.equal(await page.evaluate(() => harness.app.lastSearch), 'tag:#домашка');
      assert.equal(await page.evaluate(() => harness.app.workspace.getActiveFile().path), 'Хогвартс/Зельеварение.md');

      // Без тегов к «Снам» хода нет
      await page.evaluate(() => harness.openSettings());
      await page.locator('.setting-item', { hasText: 'Теги на Карте Мародёров' }).locator('.checkbox-container').click();
      await page.evaluate(() => harness.closeSettings());
      await page.waitForSelector('.hp-marauders-note:has-text("тайного хода нет")');
      assert.equal(await page.locator('.hp-map-node.is-tag').count(), 0);
      await page.evaluate(() => harness.openSettings());
      await page.locator('.setting-item', { hasText: 'Теги на Карте Мародёров' }).locator('.checkbox-container').click();
      await page.evaluate(() => harness.closeSettings());
      await page.waitForSelector('.hp-marauders-steps');
      await clearNotices();
      await page.click('.hp-map-next');
      await page.waitForSelector('.notice:has-text("Вы на месте: «Сны»")');
      await page.evaluate(() => harness.app.workspace.setActiveFile(harness.app.vault.getAbstractFileByPath('Хогвартс/Зельеварение.md')));
    });

    await t.test('Карта Мародёров: туда, куда ходов нет', async () => {
      await page.evaluate(() => harness.plugin.map.setRoute('Запретная секция/Тайны крестражей.md', 'Дневник/Заметки на полях.md'));
      await page.waitForSelector('.notice:has-text("тайного хода нет")');
      assert.equal(await page.locator('.hp-marauders-steps').count(), 0);
      const open = (p) => page.evaluate((path) => harness.app.workspace.setActiveFile(harness.app.vault.getAbstractFileByPath(path)), p);
      await open('Дневник/Заметки на полях.md');
      await page.waitForSelector('.hp-marauders-empty:has-text("ни ссылок, ни обратных ссылок")');
      await open('Хогвартс/Зельеварение.md');
      await page.waitForSelector('.hp-map-node.is-here[data-path="Хогвартс/Зельеварение.md"]');
    });

    const openNote = (p) => page.evaluate((path) => harness.app.workspace.setActiveFile(harness.app.vault.getAbstractFileByPath(path)), p);
    const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('hp-harness-data'))['hp-theme']);

    await t.test('Карта Мародёров: неизведанные комнаты', async () => {
      await openNote('Хогвартс/Квиддич.md');
      const ghost = '.hp-map-node.is-ghost[data-path="?Метла Нимбус"]';
      await page.waitForSelector(ghost);
      assert.ok(await page.isVisible('.hp-legend-ghost'));
      assert.match(await page.getAttribute(ghost, 'aria-label'), /неизведанная комната/);
      await page.click(ghost);
      await page.waitForFunction(() => harness.app.workspace.getActiveFile().path === 'Метла Нимбус.md');
      assert.ok(await page.evaluate(() => !!harness.app.vault.getAbstractFileByPath('Метла Нимбус.md')), 'заметка создана');
      await openNote('Хогвартс/Квиддич.md');
      await page.waitForFunction(() => !document.querySelector('.hp-map-node.is-ghost'));
    });

    await t.test('Карта Мародёров: ссылки изменились — маршрут перестраивается', async () => {
      await clearNotices();
      const steps = () => page.$$eval('.hp-marauders-steps .hp-map-step-name', (els) => els.map((el) => el.textContent));
      await openNote('Хогвартс/Зельеварение.md');
      await page.evaluate(() => harness.plugin.map.setRoute('Хогвартс/Зельеварение.md', 'Люди/Лили Поттер.md'));
      await page.waitForSelector('.hp-marauders-steps');
      assert.deepEqual(await steps(), ['Зельеварение', 'Северус Снегг', 'Лили Поттер']);
      // Снегг больше не ссылается на Лили: старый путь не пройти
      await page.evaluate(() => harness.app.metadataCache.edit('Люди/Северус Снегг.md', { links: [] }));
      await page.waitForSelector('.hp-marauders-note:has-text("ссылки изменились")');
      const fresh = await steps();
      assert.equal(fresh.at(-1), 'Лили Поттер');
      assert.ok(!fresh.includes('Северус Снегг'), fresh.join(' → '));
      const hints = await page.$$eval('.hp-marauders-steps .hp-map-step-hint', (els) => els.map((el) => el.textContent));
      assert.ok(hints.slice(1).every((h) => /ссылка|тег/.test(h)), hints.join(', '));
      await page.evaluate(() => harness.app.metadataCache.edit('Люди/Северус Снегг.md', { links: ['Люди/Лили Поттер.md'] }));

      // Следы и маршрут переживают перезапуск
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('hp-harness-data'))['hp-theme'].route?.target === 'Люди/Лили Поттер.md');
      const data = await saved();
      assert.ok(data.footprints.includes('Хогвартс/Квиддич.md'), 'следы сохранены');
      assert.equal(data.route.steps[0], 'Хогвартс/Зельеварение.md');
      await page.evaluate(() => harness.plugin.map.clearRoute());
    });

    await t.test('Карта Мародёров: один круг, папки не на карте', async () => {
      await openNote('Хогвартс/Зельеварение.md');
      await page.waitForSelector('.hp-map-node.ring-2');
      await page.evaluate(() => harness.openSettings());
      await page.selectOption('.hp-map-depth-setting select', '1');
      await page.waitForFunction(() => !document.querySelector('.hp-map-node.ring-2'));
      await page.selectOption('.hp-map-depth-setting select', '2');
      await page.waitForSelector('.hp-map-node.ring-2');

      const exclude = page.locator('.hp-folders-mapExclude textarea');
      await exclude.fill('Ингредиенты/');
      await exclude.dispatchEvent('change');
      await page.waitForFunction(() => !document.querySelector('.hp-map-node[data-path="Ингредиенты/Безоар.md"]'));
      assert.deepEqual((await saved()).mapExclude, ['Ингредиенты']);
      await exclude.fill('');
      await exclude.dispatchEvent('change');
      await page.waitForSelector('.hp-map-node[data-path="Ингредиенты/Безоар.md"]');

      // Своя «Запретная секция»: и в проводнике, и на карте
      const restricted = page.locator('.hp-folders-restrictedFolders input');
      await restricted.fill('Дневник');
      await restricted.dispatchEvent('change');
      await page.evaluate(() => harness.closeSettings());
      assert.equal(await style('.nav-folder-title[data-path="Дневник"]', 'fontStyle'), 'italic');
      await openNote('Люди/Гарри Поттер.md');
      await page.waitForSelector('.hp-map-node.is-restricted[data-path="Дневник/31 июля.md"]');
      await page.evaluate(() => harness.openSettings());
      await restricted.fill('');
      await restricted.dispatchEvent('change');
      await page.evaluate(() => harness.closeSettings());
      assert.equal(await style('.nav-folder-title[data-path="Дневник"]', 'fontStyle'), 'normal');
      await openNote('Хогвартс/Зельеварение.md');
    });

    await t.test('Карта Мародёров: удалили заметку с пути — хода нет', async () => {
      await page.evaluate(() => harness.plugin.map.setRoute('Хогвартс/Зельеварение.md', 'Запретная секция/Тайны крестражей.md'));
      await page.waitForSelector('.hp-marauders-steps li:has-text("Библиотека")');
      await page.evaluate(() => harness.app.vault.remove('Хогвартс/Библиотека.md'));
      await page.waitForSelector('.hp-marauders-note:has-text("тайного хода нет")');
      assert.ok(!(await page.evaluate(() => harness.plugin.settings.footprints)).includes('Хогвартс/Библиотека.md'), 'удалённая заметка — не след');
      await page.evaluate(() => harness.plugin.map.clearRoute());
    });

    await t.test('очки за работу: закрытые задачи и ежедневная заметка', async () => {
      await clearNotices();
      const points = () => page.evaluate(() => harness.plugin.settings.points[harness.plugin.settings.house]);
      const before = await points();
      await page.evaluate(() => harness.app.metadataCache.edit('Хогвартс/Зельеварение.md', { done: 3 }));
      assert.equal(await points(), before + 20, 'две новые задачи — +20');
      assert.ok(await page.locator('.hp-float-points').count(), '«+20» над статус-баром');
      // Сняли галочку и поставили снова — не новые очки; чужая заметка (синхронизация) — тоже
      await page.evaluate(() => harness.app.metadataCache.edit('Хогвартс/Зельеварение.md', { done: 2 }));
      await page.evaluate(() => harness.app.metadataCache.edit('Хогвартс/Зельеварение.md', { done: 3 }));
      await page.evaluate(() => harness.app.metadataCache.edit('Хогвартс/Квиддич.md', { done: 5 }));
      assert.equal(await points(), before + 20);

      const today = await page.evaluate(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      });
      await page.evaluate((name) => harness.app.workspace.openLinkText(name, ''), today);
      await page.evaluate((path) => harness.app.metadataCache.edit(path, { done: 0 }), `${today}.md`);
      await page.waitForSelector('.notice:has-text("за запись в дневнике")');
      assert.equal(await points(), before + 40);
      await page.evaluate((path) => harness.app.metadataCache.edit(path, { done: 0 }), `${today}.md`);
      assert.equal(await points(), before + 40, 'за день — один раз');
      await page.waitForFunction((p) => JSON.parse(localStorage.getItem('hp-harness-data'))['hp-theme'].points.gryffindor >= p, before + 40);
      await openNote('Хогвартс/Зельеварение.md');
    });

    await t.test('Омут памяти и Маховик времени', async () => {
      await clearNotices();
      await page.evaluate(() => harness.runCommand('pensieve'));
      await page.waitForFunction(() => harness.app.workspace.getActiveFile().path === 'Дневник/Сны.md');
      await page.waitForSelector('.notice:has-text("Омута памяти: «Сны»")');
      await page.evaluate(() => harness.runCommand('time-turner'));
      await page.waitForFunction(() => harness.app.workspace.getActiveFile().path === 'Дневник/Заметки на полях.md');
      await page.waitForSelector('.notice:has-text("Маховика времени")');
      await openNote('Хогвартс/Зельеварение.md');
    });

    await t.test('Мантия-невидимка и новые коллауты', async () => {
      await page.evaluate(() => Object.assign(harness.app.workspace.activeEditor.editor, { selection: 'пароль' }));
      await page.evaluate(() => harness.runCommand('cloak'));
      assert.equal(await page.evaluate(() => harness.app.workspace.activeEditor.editor.inserted), '<span class="hp-cloak">пароль</span>');
      await page.evaluate(() => harness.runCommand('cloak'));
      assert.match(await page.evaluate(() => harness.app.workspace.activeEditor.editor.inserted), /^> \[!cloak\] Мантия-невидимка/);

      await page.mouse.move(5, 5);
      assert.match(await style('#cloak-content', 'filter'), /blur/);
      assert.match(await style('#cloak-span', 'filter'), /blur/);
      assert.equal(await style('#cloak .callout-title', 'filter'), 'none', 'заголовок мантии виден');
      await page.hover('#cloak-span');
      await page.waitForFunction(() => getComputedStyle(document.getElementById('cloak-span')).filter === 'none');
      for (const id of ['spell', 'potion', 'owl']) assert.notEqual(await style(`#${id}`, 'backgroundColor'), 'rgba(8, 109, 221, 0.1)', id);
    });

    await t.test('отдельное окно: тема, заклинания и эффекты — в нём', async () => {
      await page.evaluate(() => {
        const frame = document.createElement('iframe');
        frame.id = 'popout';
        frame.style.cssText = 'position:fixed;right:0;bottom:30px;width:360px;height:240px;z-index:9999;border:0';
        document.body.appendChild(frame);
        const doc = frame.contentDocument;
        doc.body.className = document.body.className.replace(/\bhp-\S+/g, '');
        doc.body.innerHTML = '<div class="nav-header" id="pop-nav" style="height:200px">Отдельное окно</div>';
        harness.app.workspace.trigger('window-open', { win: frame.contentWindow, doc }, frame.contentWindow);
      });
      const frame = page.frameLocator('#popout');
      assert.ok(await frame.locator('body.hp-theme.hp-house-gryffindor').count(), 'классы темы в новом окне');
      await frame.locator('#pop-nav').click();
      for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) {
        await page.keyboard.press(k);
      }
      await frame.locator('[data-hp-snitch]').waitFor({ state: 'attached' });
      assert.equal(await page.locator('[data-hp-snitch]').count(), 0, 'снитч прилетел в своё окно, а не в главное');
      await page.keyboard.type('nox');
      await page.waitForFunction(() => document.getElementById('popout').contentDocument.body.classList.contains('theme-dark'));
      assert.ok(await bodyHas('theme-dark'), 'и главное окно в гостиной');
      await page.evaluate(() => {
        const frame = document.getElementById('popout');
        harness.app.workspace.trigger('window-close', { win: frame.contentWindow, doc: frame.contentDocument }, frame.contentWindow);
        frame.remove();
      });
      await setMode('parchment');
    });

    await t.test('mischief managed выключает тему, клятва возвращает', async () => {
      await typeOutsideEditor('mischief managed');
      await page.waitForFunction(() => !document.body.classList.contains('hp-theme'));
      assert.equal(await page.isVisible('.hp-status'), false);
      assert.equal(await page.locator('.hp-marauders').count(), 0, 'карта стёрта');
      await typeOutsideEditor('I solemnly swear that I am up to no good');
      await page.waitForFunction(() => document.body.classList.contains('hp-theme'));
      await page.waitForSelector('.hp-map-card');
      await page.waitForSelector('.hp-marauders .hp-marauders-svg', { timeout: 4000 });
    });

    await t.test('Распределяющая шляпа: испытание', async () => {
      await page.evaluate(() => harness.runCommand('sorting-hat'));
      await page.click('.hp-hat-quiz');
      // Почти всё — за Когтевран, один ответ — за Слизерин
      for (let i = 0; i < 6; i++) {
        await page.waitForSelector(`.hp-hat-progress:has-text("Вопрос ${i + 1} из 6")`);
        assert.equal(await page.locator('.hp-hat-answer').count(), 4);
        await page.click(`.hp-hat-answer[data-house="${i === 2 ? 'slytherin' : 'ravenclaw'}"]`);
      }
      const verdict = await page.waitForSelector('.hp-hat-text.hp-verdict', { timeout: 8000 });
      assert.equal(await verdict.textContent(), 'КОГТЕВРАН!');
      await page.waitForSelector('.hp-hat-modal', { state: 'detached', timeout: 8000 });
      assert.ok(await bodyHas('hp-house-ravenclaw'));
    });

    await t.test('Распределяющая шляпа: довериться ей', async () => {
      await page.evaluate(() => harness.runCommand('sorting-hat'));
      await page.click('.hp-hat-trust');
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

      // Разделы
      assert.deepEqual(await page.$$eval('.setting-item-heading .setting-item-name', (els) => els.map((el) => el.textContent)),
        ['Оформление', 'Палочка', 'Карта Мародёров', 'Заклинания', 'Кубок школы']);

      // Всегда гостиная — без изменения настройки Obsidian
      await page.selectOption('.hp-mode-setting select', 'common');
      await page.waitForFunction(() => document.body.classList.contains('theme-dark'));
      assert.equal(await page.evaluate(() => harness.app.vault.config.theme), undefined);
      await page.selectOption('.hp-mode-setting select', 'auto');
      await page.waitForFunction(() => document.body.classList.contains('theme-light'));

      // Без магии жесты недоступны
      await page.locator('.setting-item', { hasText: 'Слова имеют силу' }).locator('.checkbox-container').click();
      await page.waitForSelector('.setting-item.is-disabled:has-text("Заклинания движениями палочки")');
      await page.locator('.setting-item', { hasText: 'Слова имеют силу' }).locator('.checkbox-container').click();
      await page.waitForSelector('.setting-item:not(.is-disabled):has-text("Заклинания движениями палочки")');

      // Кубок школы и сброс очков
      assert.equal(await page.locator('.hp-cup-row').count(), 4);
      assert.match(await page.textContent('.hp-cup-row[data-house="gryffindor"] .hp-cup-points'), /Очков: [1-9]/);
      await page.click('.hp-cup-actions button.mod-warning');
      await page.click('.modal button.mod-warning');
      await page.waitForFunction(() => Object.values(harness.plugin.settings.points).every((p) => p === 0));
      assert.equal(await page.textContent('.hp-cup-row[data-house="gryffindor"] .hp-cup-points'), 'Очков: 0');
      await page.evaluate(() => harness.closeSettings());
    });

    await t.test('меню факультетов из ленты', async () => {
      await page.click('.side-dock-ribbon-action');
      await page.waitForSelector('.menu');
      assert.equal(await page.locator('.menu .menu-item').count(), 10);
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
