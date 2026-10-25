import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LinkGraph, MAP_RINGS, addFootprint, followRoute, footsteps, isTag, layoutMap, nextNote, noteFolder, noteName, routeSteps
} from '../src/map.ts';
import type { LinkTable } from '../src/map.ts';

// Маленький Хогвартс: Гарри → Рон, Гермиона; Гермиона → Библиотека → Крестражи; Дневник ссылается на Гарри.
const links: LinkTable = {
  'Гарри.md': { 'Рон.md': 2, 'Гермиона.md': 1, 'шрам.png': 1 },
  'Рон.md': { 'Гарри.md': 1 },
  'Гермиона.md': { 'Библиотека.md': 1 },
  'Библиотека.md': { 'Запретная секция/Крестражи.md': 1 },
  'Дневник/31 июля.md': { 'Гарри.md': 1 },
  'Квиддич.md': { 'шрам.png': 1 },
  'Одиночка.md': {}
};
const graph = new LinkGraph(links);

test('имя и папка заметки', () => {
  assert.equal(noteName('Дневник/31 июля.md'), '31 июля');
  assert.equal(noteName('Гарри.md'), 'Гарри');
  assert.equal(noteFolder('Запретная секция/Крестражи.md'), 'Запретная секция');
  assert.equal(noteFolder('Гарри.md'), '');
});

test('соседи: ссылки, обратные ссылки и в обе стороны; вложения не считаются', () => {
  assert.deepEqual(graph.neighbors('Гарри.md'), [
    { path: 'Гермиона.md', passage: 'link' },
    { path: 'Рон.md', passage: 'both' },
    { path: 'Дневник/31 июля.md', passage: 'backlink' }
  ]);
  assert.equal(graph.passage('Библиотека.md', 'Гермиона.md'), 'backlink');
  assert.equal(graph.passage('Гарри.md', 'Библиотека.md'), null);
  assert.deepEqual(graph.neighbors('Квиддич.md'), [], 'общая картинка — не тайный ход');
});

test('маршрут идёт по ссылкам и против них', () => {
  assert.deepEqual(graph.route('Рон.md', 'Запретная секция/Крестражи.md'),
    ['Рон.md', 'Гарри.md', 'Гермиона.md', 'Библиотека.md', 'Запретная секция/Крестражи.md']);
  assert.deepEqual(graph.route('Библиотека.md', 'Дневник/31 июля.md'),
    ['Библиотека.md', 'Гермиона.md', 'Гарри.md', 'Дневник/31 июля.md']);
  assert.deepEqual(graph.route('Гарри.md', 'Гарри.md'), ['Гарри.md']);
  assert.equal(graph.route('Гарри.md', 'Одиночка.md'), null);
  assert.equal(graph.route('Гарри.md', 'Нет такой.md'), null);
});

test('маршрут предпочитает ссылки из текста', () => {
  // A → B → D и A ← C ← D: обе дороги в два шага, по ссылкам идти удобнее
  const g = new LinkGraph({ 'A.md': { 'B.md': 1 }, 'B.md': { 'D.md': 1 }, 'C.md': { 'A.md': 1 }, 'D.md': { 'C.md': 1 } });
  assert.deepEqual(g.route('A.md', 'D.md'), ['A.md', 'B.md', 'D.md']);
});

test('навигатор: шаг по пути, свернули — новый путь, пришли', () => {
  const start = { target: 'Запретная секция/Крестражи.md', steps: graph.route('Рон.md', 'Запретная секция/Крестражи.md') };
  let r = followRoute(graph, start, 'Гарри.md');
  assert.equal(r.status, 'onRoute');
  assert.deepEqual(r.route?.steps, ['Гарри.md', 'Гермиона.md', 'Библиотека.md', 'Запретная секция/Крестражи.md']);
  r = followRoute(graph, r.route!, 'Дневник/31 июля.md');
  assert.equal(r.status, 'rerouted');
  assert.deepEqual(r.route?.steps?.slice(0, 2), ['Дневник/31 июля.md', 'Гарри.md']);
  r = followRoute(graph, r.route!, 'Одиночка.md');
  assert.equal(r.status, 'lost');
  assert.equal(r.route?.steps, null);
  assert.equal(r.route?.target, 'Запретная секция/Крестражи.md', 'цель не забывается');
  r = followRoute(graph, r.route!, 'Библиотека.md');
  assert.equal(r.status, 'rerouted');
  assert.deepEqual(followRoute(graph, r.route!, 'Запретная секция/Крестражи.md'), { route: null, status: 'arrived' });
});

test('следы: свежие первыми, без повторов, не больше лимита', () => {
  let f: string[] = [];
  for (const p of ['a', 'b', 'c', 'b']) f = addFootprint(f, p, 3);
  assert.deepEqual(f, ['b', 'c', 'a']);
  assert.deepEqual(addFootprint(f, 'd', 3), ['d', 'b', 'c']);
});

test('карта: вы в центре, соседи по кругу, их соседи дальше', () => {
  const { nodes, hidden } = layoutMap(graph, 'Гарри.md');
  assert.equal(hidden, 0);
  assert.deepEqual(nodes[0], { path: 'Гарри.md', x: 0, y: 0, ring: 0, parent: null, passage: null });
  const ring1 = nodes.filter((n) => n.ring === 1);
  assert.deepEqual(ring1.map((n) => n.path).sort(), ['Гермиона.md', 'Дневник/31 июля.md', 'Рон.md'].sort());
  const { rx, ry } = MAP_RINGS.ring1;
  for (const n of ring1) assert.ok(Math.abs((n.x / rx) ** 2 + (n.y / ry) ** 2 - 1) < 0.02, 'соседи на первом круге');
  const ring2 = nodes.filter((n) => n.ring === 2);
  assert.deepEqual(ring2.map((n) => [n.path, n.parent]), [['Библиотека.md', 'Гермиона.md']]);
  assert.equal(new Set(nodes.map((n) => n.path)).size, nodes.length, 'каждая заметка на карте один раз');
});

test('карта: лишние соседи прячутся, шаги маршрута — нет', () => {
  const big: LinkTable = { 'hub.md': {} };
  for (let i = 0; i < 20; i++) big['hub.md'][`n${String(i).padStart(2, '0')}.md`] = 1;
  big['n19.md'] = { 'far.md': 1 };
  const g = new LinkGraph(big);
  const plain = layoutMap(g, 'hub.md');
  assert.equal(plain.hidden, 8);
  assert.equal(plain.nodes.filter((n) => n.ring === 1).length, 12);
  const routed = layoutMap(g, 'hub.md', ['hub.md', 'n05.md']);
  const top = routed.nodes[1];
  assert.equal(top.path, 'n05.md', 'шаг маршрута — первый, наверху');
  assert.ok(top.y < 0 && Math.abs(top.x) < 0.5);
  // Самая связанная заметка (n19 → far) попадает на карту, а с ней и её сосед
  assert.ok(plain.nodes.some((n) => n.path === 'far.md' && n.parent === 'n19.md'));
});

test('следы по коридору между заметками', () => {
  const steps = footsteps({ x: 0, y: 0 }, { x: 0, y: -98 });
  assert.ok(steps.length >= 4);
  assert.ok(steps.every((s) => s.y < -10 && s.y > -88), 'не наступают на кружки заметок');
  assert.ok(steps.every((s) => s.angle === 0), 'носки смотрят по ходу движения');
  assert.notEqual(Math.sign(steps[0].x), Math.sign(steps[1].x), 'левый, правый');
  assert.deepEqual(footsteps({ x: 0, y: 0 }, { x: 10, y: 0 }), []);
});

// ---------- Теги ----------

const tags = {
  'Гарри.md': ['#квиддич', '#Гриффиндор'],
  'Рон.md': ['#гриффиндор'],
  'Квиддич.md': ['#Квиддич'],
  'Одиночка.md': [],
  'шрам.png': ['#картинка']
};
const tagged = new LinkGraph(links, tags);

test('теги — узлы графа: заметка → #тег → заметка, без учёта регистра', () => {
  assert.equal(isTag('#квиддич'), true);
  assert.equal(isTag('#заметка.md'), false, 'заметка, чьё имя начинается с #, — не тег');
  assert.equal(noteName('#хогвартс/зелья'), '#хогвартс/зелья');
  assert.deepEqual(tagged.neighbors('Гарри.md').slice(-2), [
    { path: '#Гриффиндор', passage: 'tag' },
    { path: '#квиддич', passage: 'tag' }
  ]);
  assert.deepEqual(tagged.neighbors('#квиддич'), [
    { path: 'Гарри.md', passage: 'tag' },
    { path: 'Квиддич.md', passage: 'tag' }
  ]);
  assert.deepEqual(tagged.neighbors('Рон.md').map((n) => n.path), ['Гарри.md', '#Гриффиндор'], 'ссылки раньше тегов');
  assert.equal(tagged.passage('Квиддич.md', '#квиддич'), 'tag');
  assert.deepEqual(graph.neighbors('Квиддич.md'), [], 'без тегов граф прежний');
});

test('маршрут через общий тег, но ссылки при равной длине важнее', () => {
  // Квиддич связан с остальными только тегом
  assert.deepEqual(tagged.route('Квиддич.md', 'Гермиона.md'), ['Квиддич.md', '#квиддич', 'Гарри.md', 'Гермиона.md']);
  assert.equal(graph.route('Квиддич.md', 'Гермиона.md'), null);
  // Рон → Гарри: прямая ссылка, а не через #гриффиндор
  assert.deepEqual(tagged.route('Рон.md', 'Гарри.md'), ['Рон.md', 'Гарри.md']);
});

test('шаги маршрута: тег — способ пройти, а не остановка', () => {
  const steps = ['Квиддич.md', '#квиддич', 'Гарри.md', 'Гермиона.md'];
  assert.equal(nextNote(steps), 'Гарри.md');
  assert.equal(nextNote(['Гарри.md']), null);
  assert.deepEqual(routeSteps(tagged, steps), [
    { path: 'Квиддич.md', passage: null, tag: null },
    { path: 'Гарри.md', passage: 'tag', tag: '#квиддич' },
    { path: 'Гермиона.md', passage: 'link', tag: null }
  ]);
  const r = followRoute(tagged, { target: 'Гермиона.md', steps }, 'Гарри.md');
  assert.deepEqual(r, { route: { target: 'Гермиона.md', steps: ['Гарри.md', 'Гермиона.md'] }, status: 'onRoute' });
});

test('карта: теги на первом круге, их заметки — на втором', () => {
  const { nodes } = layoutMap(tagged, 'Квиддич.md');
  assert.deepEqual(nodes.filter((n) => n.ring === 1).map((n) => n.path), ['#квиддич']);
  assert.deepEqual(nodes.filter((n) => n.ring === 2).map((n) => [n.path, n.parent, n.passage]), [['Гарри.md', '#квиддич', 'tag']]);
  // Теги не вытесняются более связанными заметками
  const many: LinkTable = { 'hub.md': {} };
  for (let i = 0; i < 14; i++) {
    many['hub.md'][`n${i}.md`] = 1;
    many[`n${i}.md`] = { 'x.md': 1, 'y.md': 1 };
  }
  const ring1 = layoutMap(new LinkGraph(many, { 'hub.md': ['#важное'] }), 'hub.md').nodes.filter((n) => n.ring === 1);
  assert.ok(ring1.some((n) => n.path === '#важное'));
});
