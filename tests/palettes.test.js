// Читаемость: каждая палитра каждого факультета обязана проходить WCAG.
const test = require('node:test');
const assert = require('node:assert');
const { HOUSES, HOUSE_IDS, DEFAULT_SETTINGS, contrastRatio } = require('../extension/shared/houses.js');

test('все четыре факультета на месте', () => {
  assert.deepStrictEqual(HOUSE_IDS.sort(), ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']);
  assert.ok(HOUSES[DEFAULT_SETTINGS.house]);
});

for (const house of Object.values(HOUSES)) {
  for (const [mode, p] of Object.entries(house.palettes)) {
    test(`${house.id}/${mode}: контраст текста`, () => {
      // Основной текст — AAA (7:1) и на фоне, и на поверхности
      assert.ok(contrastRatio(p.text, p.bg) >= 7, `text/bg ${contrastRatio(p.text, p.bg)}`);
      assert.ok(contrastRatio(p.text, p.surface) >= 7, `text/surface ${contrastRatio(p.text, p.surface)}`);
      // Заголовки (primary), ссылки и второстепенный текст — минимум AA (4.5:1)
      for (const key of ['primary', 'link', 'muted']) {
        assert.ok(contrastRatio(p[key], p.bg) >= 4.5, `${key}/bg ${contrastRatio(p[key], p.bg)}`);
        assert.ok(contrastRatio(p[key], p.surface) >= 4.5, `${key}/surface ${contrastRatio(p[key], p.surface)}`);
      }
      // Текст на кнопках и выделении
      assert.ok(contrastRatio(p.onPrimary, p.primary) >= 7, `onPrimary/primary ${contrastRatio(p.onPrimary, p.primary)}`);
    });
  }
}

test('светлый режим светлый, тёмный тёмный', () => {
  for (const house of Object.values(HOUSES)) {
    assert.ok(contrastRatio(house.palettes.parchment.bg, '#ffffff') < 1.3, `${house.id} parchment`);
    assert.ok(contrastRatio(house.palettes.common.bg, '#000000') < 1.6, `${house.id} common`);
  }
});
