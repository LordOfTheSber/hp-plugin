const test = require('node:test');
const assert = require('node:assert');
const C = require('../extension/shared/colors.js');

const rgb = (r, g, b, a = 1) => ({ r, g, b, a });

test('parseColor понимает rgb, rgba и современный синтаксис', () => {
  assert.deepStrictEqual(C.parseColor('rgb(1, 2, 3)'), rgb(1, 2, 3));
  assert.deepStrictEqual(C.parseColor('rgba(10, 20, 30, 0.5)'), rgb(10, 20, 30, 0.5));
  assert.deepStrictEqual(C.parseColor('rgb(10 20 30 / 25%)'), rgb(10, 20, 30, 0.25));
  assert.strictEqual(C.parseColor('transparent'), null);
  assert.strictEqual(C.parseColor(''), null);
});

test('нейтральные фоны перекрашиваются, брендовые — нет', () => {
  assert.ok(C.isThemeableBackground(rgb(255, 255, 255), true), 'белый на светлом сайте');
  assert.ok(C.isThemeableBackground(rgb(246, 246, 246), true), 'светло-серый');
  assert.ok(!C.isThemeableBackground(rgb(51, 51, 51), true), 'тёмная шапка на светлом сайте остаётся');
  assert.ok(!C.isThemeableBackground(rgb(26, 115, 232), true), 'синяя кнопка остаётся');
  assert.ok(!C.isThemeableBackground(rgb(255, 255, 255, 0), true), 'прозрачный фон не трогаем');
  assert.ok(C.isThemeableBackground(rgb(18, 18, 18), false), 'почти чёрный на тёмном сайте');
  assert.ok(!C.isThemeableBackground(rgb(255, 255, 255), false), 'белая карточка на тёмном сайте остаётся');
});

test('роль текста', () => {
  const white = rgb(255, 255, 255);
  const parchment = C.hexToColor('#f6ecd6');
  assert.strictEqual(C.textRole(rgb(34, 34, 34), white, parchment), 'text');
  assert.strictEqual(C.textRole(rgb(120, 120, 120), white, parchment), 'muted');
  // Насыщенный тёмно-красный читается на пергаменте — оставляем как есть
  assert.strictEqual(C.textRole(rgb(160, 20, 20), white, parchment), null);
  // Жёлтый текст на пергаменте нечитаем — заменяем цветом текста
  assert.strictEqual(C.textRole(rgb(240, 200, 40), white, parchment), 'text');
});
