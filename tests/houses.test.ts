// Читаемость: каждая палитра каждого факультета обязана проходить WCAG.
import test from 'node:test';
import assert from 'node:assert/strict';
import { HOUSE_IDS, MODES, palette, contrastRatio, mix, relativeLuminance } from '../src/houses.ts';

test('все четыре факультета', () => {
  assert.deepEqual([...HOUSE_IDS].sort(), ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']);
});

for (const house of HOUSE_IDS) {
  for (const mode of MODES) {
    const p = palette(house, mode);
    const backgrounds = { bg: p.bg, surface: p.surface, sidebar: p.sidebar, sidebarAlt: p.sidebarAlt, hover: p.hover, active: p.active };

    test(`${house}/${mode}: основной текст ≥ 7:1 на любом фоне`, () => {
      for (const [name, bg] of Object.entries({ ...backgrounds, selection: p.selection, highlight: p.highlight })) {
        const r = contrastRatio(p.text, bg);
        // Маркер (==highlight==) — короткие фрагменты, для него достаточно AA
        assert.ok(r >= (name === 'highlight' ? 4.5 : 7), `text/${name} = ${r.toFixed(2)}`);
      }
    });

    test(`${house}/${mode}: заголовки, ссылки, вторичный текст ≥ 4.5:1`, () => {
      for (const key of ['primary', 'link', 'muted'] as const) {
        for (const [name, bg] of Object.entries(backgrounds)) {
          const r = contrastRatio(p[key], bg);
          assert.ok(r >= 4.5, `${key}/${name} = ${r.toFixed(2)}`);
        }
      }
      assert.ok(contrastRatio(p.onPrimary, p.primary) >= 7, 'текст на кнопках');
    });

    test(`${house}/${mode}: бледный текст (плейсхолдеры) ≥ 3:1`, () => {
      for (const bg of [p.bg, p.sidebar, p.surface]) assert.ok(contrastRatio(p.faint, bg) >= 3, `faint/${bg}`);
    });
  }
}

test('пергамент светлый, гостиная тёмная', () => {
  for (const house of HOUSE_IDS) {
    assert.ok(relativeLuminance(palette(house, 'parchment').bg) > 0.7, house);
    assert.ok(relativeLuminance(palette(house, 'common').bg) < 0.03, house);
  }
});

test('mix совпадает с color-mix в sRGB', () => {
  assert.equal(mix('#000000', '#ffffff', 0.5), '#808080');
  assert.equal(mix('#ff0000', '#0000ff', 0), '#ff0000');
  assert.equal(mix('#ff0000', '#0000ff', 1), '#0000ff');
});
