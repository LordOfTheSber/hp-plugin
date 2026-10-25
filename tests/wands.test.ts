import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CORE_IDS, FLEX_IDS, HANDLE_IDS, WAND_PRESETS, WOOD_IDS, DEFAULT_WAND,
  formatLength, presetOf, randomWand, sanitizeWand, wandCursorCss, wandCursorSvg, wandSideSvg
} from '../src/wands.ts';
import { STRINGS } from '../src/i18n.ts';

test('канонические палочки: древесина, сердцевина и длина из книг', () => {
  const byId = Object.fromEntries(WAND_PRESETS.map((p) => [p.id, p.wand]));
  assert.deepEqual([byId.harry.wood, byId.harry.core, byId.harry.length], ['holly', 'phoenix', 11]);
  assert.deepEqual([byId.hermione.wood, byId.hermione.core, byId.hermione.length], ['vine', 'dragon', 10.75]);
  assert.deepEqual([byId.voldemort.wood, byId.voldemort.core, byId.voldemort.length], ['yew', 'phoenix', 13.5]);
  assert.deepEqual([byId.dumbledore.wood, byId.dumbledore.core, byId.dumbledore.length], ['elder', 'thestral', 15]);
  assert.equal(new Set(WAND_PRESETS.map((p) => JSON.stringify(p.wand))).size, WAND_PRESETS.length, 'палочки не повторяются');
  for (const p of WAND_PRESETS) assert.equal(presetOf(p.wand), p.id);
  assert.equal(presetOf({ ...DEFAULT_WAND, length: 12 }), null);
});

test('сохранённая палочка проверяется', () => {
  assert.deepEqual(sanitizeWand(null), DEFAULT_WAND);
  assert.deepEqual(sanitizeWand({ wood: 'plastic', core: 'veela', length: 99, flex: 'swishy', handle: 'claw' }),
    { ...DEFAULT_WAND, core: 'veela', length: 16, flex: 'swishy', handle: 'claw' });
  assert.equal(sanitizeWand({ length: 10.6 }).length, 10.5);
  assert.equal(sanitizeWand({ length: 'long' }).length, DEFAULT_WAND.length);
});

test('случайная палочка всегда корректна', () => {
  for (let i = 0; i < 200; i++) {
    const w = randomWand();
    assert.deepEqual(sanitizeWand(w), w);
  }
});

test('длина в дюймах с дробями', () => {
  assert.equal(formatLength(11), '11');
  assert.equal(formatLength(10.75), '10¾');
  assert.equal(formatLength(12.25), '12¼');
  assert.equal(formatLength(13.5), '13½');
});

test('у каждой детали палочки есть название на обоих языках', () => {
  const keys = [
    ...WOOD_IDS.map((id) => `wood_${id}`), ...CORE_IDS.map((id) => `core_${id}`),
    ...FLEX_IDS.map((id) => `flex_${id}`), ...HANDLE_IDS.map((id) => `handle_${id}`),
    ...WAND_PRESETS.flatMap((p) => [`preset_${p.id}`, `presetWand_${p.id}`])
  ];
  for (const key of keys) {
    assert.ok(key in STRINGS.en, `en: ${key}`);
    assert.ok(key in STRINGS.ru, `ru: ${key}`);
  }
});

test('SVG палочки: любые сочетания рисуются без NaN', () => {
  for (const handle of HANDLE_IDS) {
    for (const length of [8, 11.25, 16]) {
      const wand = { ...DEFAULT_WAND, handle, length };
      for (const svg of [wandSideSvg(wand), wandCursorSvg(wand).svg]) {
        assert.ok(svg.startsWith('<svg'), handle);
        assert.ok(!/NaN|Infinity|undefined/.test(svg), `${handle} ${length}`);
      }
    }
  }
});

test('курсор: 32×32, кончик в пределах картинки, есть версия для Retina', () => {
  for (const { wand } of WAND_PRESETS) {
    const { svg, hotspot } = wandCursorSvg(wand);
    assert.match(svg, /width="32" height="32"/);
    for (const v of hotspot) assert.ok(v >= 0 && v < 32);
  }
  const css = wandCursorCss(DEFAULT_WAND);
  assert.match(css, /^image-set\(url\("data:image\/svg\+xml,[^"]+"\) 1x, url\("data:image\/svg\+xml,[^"]+"\) 2x\) \d+ \d+, auto$/);
  assert.notEqual(wandCursorCss({ ...DEFAULT_WAND, wood: 'ebony' }), css, 'курсор зависит от палочки');
});
