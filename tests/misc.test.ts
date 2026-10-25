import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { STRINGS, createTranslator } from '../src/i18n.ts';
import { DEFAULT_SETTINGS, migrateSettings, parseFolderList } from '../src/settings-data.ts';
import { restrictedCss } from '../src/css.ts';
import { crestSvg } from '../src/crest.ts';

test('русские и английские строки совпадают по ключам и подстановкам', () => {
  const placeholders = (s: string) => (s.match(/\{\d+\}/g) ?? []).sort().join();
  for (const key of Object.keys(STRINGS.en) as (keyof typeof STRINGS.en)[]) {
    assert.ok(STRINGS.ru[key], `нет перевода ${key}`);
    assert.equal(placeholders(STRINGS.ru[key]), placeholders(STRINGS.en[key]), key);
  }
});

test('переводчик выбирает язык и подставляет значения', () => {
  assert.equal(createTranslator('ru')('house_ravenclaw'), 'Когтевран');
  assert.equal(createTranslator('en-GB')('house_ravenclaw'), 'Ravenclaw');
  assert.equal(createTranslator('de')('house_ravenclaw'), 'Ravenclaw');
  assert.equal(createTranslator('ru')('eggSnitch', 150, 'Пуффендуй'), '+150 очков факультету Пуффендуй! Снитч пойман.');
});

test('настройки: значения по умолчанию и защита от мусора', () => {
  assert.deepEqual(migrateSettings(null), DEFAULT_SETTINGS);
  const s = migrateSettings({ house: 'durmstrang', points: { slytherin: 300 }, ornaments: false });
  assert.equal(s.house, 'gryffindor');
  assert.equal(s.ornaments, false);
  assert.deepEqual(s.points, { gryffindor: 0, slytherin: 300, ravenclaw: 0, hufflepuff: 0 });
  assert.notEqual(migrateSettings({}).points, DEFAULT_SETTINGS.points, 'очки не должны делить объект с умолчаниями');
  assert.notEqual(migrateSettings({}).wand, DEFAULT_SETTINGS.wand, 'палочка не должна делить объект с умолчаниями');
  assert.equal(migrateSettings({ wand: { wood: 'ebony', handle: 'laser' } }).wand.wood, 'ebony');
  assert.equal(migrateSettings({ wand: { wood: 'ebony', handle: 'laser' } }).wand.handle, DEFAULT_SETTINGS.wand.handle);
  assert.equal(migrateSettings({}).gestures, true, 'жесты включены по умолчанию');
});

test('настройки: значения не того типа заменяются умолчаниями', () => {
  const s = migrateSettings({
    ornaments: 'yes', gestures: 0, mode: 'twilight', mapDepth: 3, snitches: -4, birthdayShown: 2026,
    points: { gryffindor: 'много', ravenclaw: 12.7 }, mapExclude: ['Шаблоны', 5], footprints: 'a.md',
    route: { target: 'b.md', steps: 'a.md' }
  });
  assert.equal(s.ornaments, true);
  assert.equal(s.gestures, true);
  assert.equal(s.mode, 'auto');
  assert.equal(s.mapDepth, 2);
  assert.equal(s.snitches, 0);
  assert.equal(s.birthdayShown, '');
  assert.deepEqual(s.points, { gryffindor: 0, slytherin: 0, ravenclaw: 12, hufflepuff: 0 });
  assert.deepEqual(s.mapExclude, []);
  assert.deepEqual(s.footprints, []);
  assert.deepEqual(s.route, { target: 'b.md', steps: null });
  const ok = migrateSettings({ mode: 'common', mapDepth: 1, footprints: ['a.md'], route: { target: 'b.md', steps: ['a.md', 'b.md'] } });
  assert.equal(ok.mode, 'common');
  assert.equal(ok.mapDepth, 1);
  assert.deepEqual(ok.route?.steps, ['a.md', 'b.md']);
});

test('список папок: по строкам и через запятую, без «/» и повторов', () => {
  assert.deepEqual(parseFolderList(' Шаблоны/ ,\nАрхив\n/Личное/Тайное/\n\nАрхив'), ['Шаблоны', 'Архив', 'Личное/Тайное']);
});

test('свои Запретные секции: CSS только для своих названий, кавычки экранированы', () => {
  assert.equal(restrictedCss([]), '');
  const css = restrictedCss(['Секреты', 'Он "сам"']);
  assert.match(css, /\[data-path="Секреты"\], \[data-path\$="\/Секреты"\]/);
  assert.match(css, /\[data-path="Он \\"сам\\""\]/);
  assert.match(css, /:hover > \.nav-folder-children/);
});

test('гербы: у каждого своя маска, даже у одинаковых', () => {
  const id = (svg: string) => svg.match(/clipPath id="([^"]+)"/)?.[1];
  assert.notEqual(id(crestSvg('slytherin', 20)), id(crestSvg('slytherin', 20)));
});

test('манифест плагина корректен', () => {
  const manifest = JSON.parse(readFileSync(new URL('../manifest.json', import.meta.url), 'utf8'));
  const versions = JSON.parse(readFileSync(new URL('../versions.json', import.meta.url), 'utf8'));
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.match(manifest.id, /^[a-z0-9-]+$/);
  assert.ok(!manifest.id.includes('obsidian'), 'id не должен содержать «obsidian»');
  assert.equal(manifest.version, pkg.version);
  assert.equal(versions[manifest.version], manifest.minAppVersion);
});
