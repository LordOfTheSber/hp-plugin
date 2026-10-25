import test from 'node:test';
import assert from 'node:assert/strict';
import { createSpellbook, parseIncantation, KONAMI } from '../src/spells.ts';

function type(text: string) {
  const book = createSpellbook();
  let last = null;
  for (const ch of text) last = book.push(ch) ?? last;
  return last;
}

test('английские и русские заклинания', () => {
  assert.equal(type('lumos'), 'lumos');
  assert.equal(type('Nox'), 'nox');
  assert.equal(type('люмос'), 'lumos');
  assert.equal(type('Accio Snitch'), 'accioSnitch');
  assert.equal(type('Mischief managed!'), 'mischiefManaged');
  assert.equal(type('Шалость удалась'), 'mischiefManaged');
});

test('клятва Мародёров', () => {
  assert.equal(type('I solemnly swear that I am up to no good'), 'solemnlySwear');
  assert.equal(type('Клянусь, что замышляю только шалость'), 'solemnlySwear');
});

test('заклинание внутри слова не срабатывает', () => {
  assert.equal(type('equinox'), null);
  assert.equal(type('illumos'), null);
});

test('Konami, в том числе на русской раскладке', () => {
  const keys = KONAMI.map((k) => k.replace(/^arrow(\w)/, (m, c: string) => 'Arrow' + c.toUpperCase()));
  let book = createSpellbook();
  assert.equal(keys.map((k) => book.push(k)).pop(), 'accioSnitch');
  book = createSpellbook();
  assert.equal([...keys.slice(0, 8), 'и', 'ф'].map((k) => book.push(k)).pop(), 'accioSnitch');
});

test('служебные клавиши не мешают', () => {
  const book = createSpellbook();
  for (const k of ['Shift', 'l', 'u', 'Shift', 'm', 'o']) assert.equal(book.push(k), null);
  assert.equal(book.push('s'), 'lumos');
});

test('модалка «Взмахнуть палочкой» понимает целые фразы', () => {
  assert.equal(parseIncantation('  Lumos! '), 'lumos');
  assert.equal(parseIncantation('Акцио, снитч!'), 'accioSnitch');
  assert.equal(parseIncantation('I solemnly swear that I am up to no good.'), 'solemnlySwear');
  assert.equal(parseIncantation('Шалость удалась'), 'mischiefManaged');
  assert.equal(parseIncantation('Вингардиум Левиоса!'), 'wingardiumLeviosa');
  assert.equal(parseIncantation('Авада Кедавра'), null);
  assert.equal(parseIncantation('lumos maxima'), null);
});
