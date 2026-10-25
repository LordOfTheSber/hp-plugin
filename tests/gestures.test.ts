import test from 'node:test';
import assert from 'node:assert/strict';
import { GESTURES, gestureSvg, recognize, resample } from '../src/gestures.ts';
import type { Point } from '../src/gestures.ts';
import { SPELLS } from '../src/spells.ts';
import { STRINGS } from '../src/i18n.ts';

// Детерминированный «дрожащий» рисунок фигуры: масштаб, растяжение, наклон, шум
function random(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

function hand(shape: Point[], rnd: () => number, o: { scale: number; sx: number; sy: number; rot: number; noise: number }): Point[] {
  return resample(shape, 60).map((p) => {
    const x = p.x * o.scale * o.sx;
    const y = p.y * o.scale * o.sy;
    return {
      x: 500 + x * Math.cos(o.rot) - y * Math.sin(o.rot) + (rnd() - 0.5) * o.noise,
      y: 400 + x * Math.sin(o.rot) + y * Math.cos(o.rot) + (rnd() - 0.5) * o.noise
    };
  });
}

test('каждая фигура узнаётся, даже нарисованная неровно', () => {
  const rnd = random(42);
  for (const g of GESTURES) {
    for (const shape of g.variants) {
      for (let i = 0; i < 25; i++) {
        const stroke = hand(shape, rnd, {
          scale: 90 + rnd() * 250, sx: 0.75 + rnd() * 0.5, sy: 0.75 + rnd() * 0.5, rot: (rnd() - 0.5) * 0.4, noise: rnd() * 10
        });
        assert.equal(recognize(stroke)?.spell, g.spell, `${g.spell} #${i}`);
      }
    }
  }
});

test('направление важно: вверх — Люмос, вниз — Нокс', () => {
  const line = (y0: number, y1: number) => Array.from({ length: 20 }, (_, i) => ({ x: 300 + i * 0.5, y: y0 + ((y1 - y0) * i) / 19 }));
  assert.equal(recognize(line(500, 200))?.spell, 'lumos');
  assert.equal(recognize(line(200, 500))?.spell, 'nox');
});

test('круг узнаётся с любой точки и в обе стороны', () => {
  for (const start of [0, 1.5, 3, 4.5]) {
    for (const dir of [1, -1]) {
      const stroke = Array.from({ length: 40 }, (_, i) => {
        const a = start + dir * (i / 39) * Math.PI * 2;
        return { x: 400 + Math.cos(a) * 120, y: 300 + Math.sin(a) * 120 };
      });
      assert.equal(recognize(stroke)?.spell, 'accioSnitch', `${start} ${dir}`);
    }
  }
});

test('мелкие и случайные движения — не заклинания', () => {
  assert.equal(recognize([{ x: 0, y: 0 }, { x: 10, y: 20 }, { x: 20, y: 5 }, { x: 30, y: 30 }, { x: 35, y: 10 }]), null);
  assert.equal(recognize([{ x: 0, y: 0 }, { x: 0, y: 1 }]), null);
  // Каракули
  const scribble = [[0, 0], [120, 40], [30, 150], [160, 160], [60, 20], [200, 90], [10, 200]].map(([x, y]) => ({ x, y }));
  assert.equal(recognize(scribble), null);
});

test('у каждого жеста есть заклинание, название, подсказка и схема', () => {
  const known = new Set(SPELLS.map((s) => s.id));
  for (const { spell } of GESTURES) {
    assert.ok(known.has(spell), spell);
    for (const key of [`spell_${spell}`, `gesture_${spell}`]) {
      assert.ok(key in STRINGS.en && key in STRINGS.ru, key);
    }
    const svg = gestureSvg(spell);
    assert.ok(svg.startsWith('<svg') && !/NaN/.test(svg), spell);
  }
});
