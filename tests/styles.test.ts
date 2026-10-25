import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generateHouseCss, houseVariables, selectorFor, hexToHsl } from '../src/css.ts';
import { HOUSE_IDS, MODES, palette } from '../src/houses.ts';

const themeCss = readFileSync(new URL('../src/styles/theme.css', import.meta.url), 'utf8');
const built = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('для каждого факультета и режима есть блок переменных', () => {
  const css = generateHouseCss();
  for (const house of HOUSE_IDS) {
    for (const mode of MODES) {
      assert.ok(css.includes(selectorFor(house, mode) + ' {'), `${house}/${mode}`);
    }
  }
  assert.ok(selectorFor('slytherin', 'common').endsWith('.theme-dark'));
  assert.ok(selectorFor('slytherin', 'parchment').endsWith('.theme-light'));
});

test('theme.css использует только объявленные переменные --hp-*', () => {
  const declared = new Set(Object.keys(houseVariables(palette('gryffindor', 'parchment'))));
  for (const m of themeCss.matchAll(/--hp-[\w-]+:/g)) declared.add(m[0].slice(0, -1));
  // Переменные, которые задаёт сам плагин инлайном
  declared.add('--hp-verdict-color');
  const used = new Set([...themeCss.matchAll(/var\((--hp-[\w-]+)/g)].map((m) => m[1]));
  const missing = [...used].filter((v) => !declared.has(v));
  assert.deepEqual(missing, []);
});

test('styles.css собран из актуальных исходников', () => {
  assert.ok(built.includes(generateHouseCss()), 'запустите npm run build: цвета устарели');
  assert.ok(built.includes(themeCss), 'запустите npm run build: theme.css устарел');
  const faces = built.match(/@font-face/g) ?? [];
  assert.equal(faces.length, 8, 'Literata (3 начертания) и Forum × латиница и кириллица');
  assert.ok(built.includes('U+0400-045F'), 'кириллица');
});

test('акцент Obsidian (HSL) соответствует основному цвету', () => {
  assert.deepEqual(hexToHsl('#ff0000'), [0, 100, 50]);
  const vars = houseVariables(palette('ravenclaw', 'parchment'));
  assert.equal(vars['--accent-h'], String(hexToHsl('#0e1a40')[0]));
  assert.equal(vars['--color-base-00'], palette('ravenclaw', 'parchment').bg);
  assert.equal(vars['--color-base-100'], palette('ravenclaw', 'parchment').text);
});
