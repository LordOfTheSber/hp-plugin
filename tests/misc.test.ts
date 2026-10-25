import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { STRINGS, createTranslator } from '../src/i18n.ts';
import { DEFAULT_SETTINGS, migrateSettings } from '../src/settings-data.ts';

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

test('манифест плагина корректен', () => {
  const manifest = JSON.parse(readFileSync(new URL('../manifest.json', import.meta.url), 'utf8'));
  const versions = JSON.parse(readFileSync(new URL('../versions.json', import.meta.url), 'utf8'));
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.match(manifest.id, /^[a-z0-9-]+$/);
  assert.ok(!manifest.id.includes('obsidian'), 'id не должен содержать «obsidian»');
  assert.equal(manifest.version, pkg.version);
  assert.equal(versions[manifest.version], manifest.minAppVersion);
});
