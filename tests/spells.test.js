const test = require('node:test');
const assert = require('node:assert');
const { createSpellbook, KONAMI } = require('../extension/shared/spells.js');

function type(book, text) {
  let last = null;
  for (const ch of text) last = book.push(ch) || last;
  return last;
}

test('английские и русские заклинания', () => {
  assert.strictEqual(type(createSpellbook(), 'lumos'), 'lumos');
  assert.strictEqual(type(createSpellbook(), 'Nox'), 'nox');
  assert.strictEqual(type(createSpellbook(), 'люмос'), 'lumos');
  assert.strictEqual(type(createSpellbook(), 'Accio Snitch'), 'accioSnitch');
  assert.strictEqual(type(createSpellbook(), 'Mischief managed!'), 'mischiefManaged');
  assert.strictEqual(type(createSpellbook(), 'Шалость удалась'), 'mischiefManaged');
});

test('клятва Мародёров с пунктуацией', () => {
  assert.strictEqual(type(createSpellbook(), 'I solemnly swear that I am up to no good'), 'solemnlySwear');
  assert.strictEqual(type(createSpellbook(), 'Клянусь, что замышляю только шалость'), 'solemnlySwear');
});

test('заклинание внутри слова не срабатывает', () => {
  assert.strictEqual(type(createSpellbook(), 'equinox'), null);
  assert.strictEqual(type(createSpellbook(), 'illumos'), null);
});

test('код Konami вызывает снитча, в том числе на русской раскладке', () => {
  const keys = KONAMI.map((k) => k.replace(/^arrow(\w)/, (m, c) => 'Arrow' + c.toUpperCase()));
  let book = createSpellbook();
  assert.strictEqual(keys.map((k) => book.push(k)).pop(), 'accioSnitch');
  book = createSpellbook();
  const ru = [...keys.slice(0, 8), 'и', 'ф'];
  assert.strictEqual(ru.map((k) => book.push(k)).pop(), 'accioSnitch');
});

test('служебные клавиши не ломают ввод', () => {
  const book = createSpellbook();
  for (const k of ['Shift', 'l', 'u', 'Shift', 'm', 'o']) assert.strictEqual(book.push(k), null);
  assert.strictEqual(book.push('s'), 'lumos');
});
