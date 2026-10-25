/*
 * Заклинания движениями палочки: распознавание фигуры, нарисованной мышью.
 * Чистая логика без DOM. Упрощённый $1 Unistroke Recognizer: штрих приводится к N точкам,
 * центрируется и масштабируется без искажения пропорций, затем сравнивается с шаблонами.
 * Поворот учитывается (↑ и ↓ — разные заклинания), кроме круга, где важен только сам круг.
 */
import type { SpellId } from './spells.ts';

export interface Point {
  x: number;
  y: number;
}

const N = 48;
/** Штрих меньше этого (в пикселях) — не жест, а случайное движение. */
export const MIN_GESTURE_SIZE = 50;
/** Средняя дистанция до шаблона (в долях размера фигуры), при которой жест ещё засчитывается. */
const MATCH_THRESHOLD = 0.17;

const P = (x: number, y: number): Point => ({ x, y });

function circle(clockwise: boolean): Point[] {
  const out: Point[] = [];
  for (let i = 0; i <= 32; i++) {
    const a = -Math.PI / 2 + (clockwise ? 1 : -1) * (i / 32) * Math.PI * 2;
    out.push(P(Math.cos(a), Math.sin(a)));
  }
  return out;
}

function quad(a: Point, c: Point, b: Point, steps = 16): Point[] {
  const out: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    out.push(P((1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y));
  }
  return out;
}

function wipe(passes: number, fromLeft: boolean): Point[] {
  const out: Point[] = [];
  for (let i = 0; i <= passes; i++) out.push(P((i % 2 === 0) === fromLeft ? 0 : 1, i * 0.06));
  return out;
}

/** Фигуры заклинаний в экранных координатах (y растёт вниз). Первый вариант — для подсказки. */
export const GESTURES: { spell: SpellId; variants: Point[][]; anyRotation?: boolean; threshold?: number }[] = [
  // Поднять палочку — свет, опустить — тьма. Прямую легко нарисовать случайно, поэтому допуск строже.
  { spell: 'lumos', variants: [[P(0, 1), P(0, 0)]], threshold: 0.11 },
  { spell: 'nox', variants: [[P(0, 0), P(0, 1)]], threshold: 0.11 },
  // «Взмах и щелчок»: плавная дуга и короткий резкий взмах вниз
  { spell: 'wingardiumLeviosa', variants: [[...quad(P(0, 0), P(0.35, 0.95), P(0.8, 0.05)), P(0.7, 0.42)]] },
  // Снитч круглый — круг в любую сторону
  { spell: 'accioSnitch', variants: [circle(true), circle(false)], anyRotation: true },
  // «M» — Мародёры (Moony, Wormtail, Padfoot, Prongs)
  { spell: 'solemnlySwear', variants: [[P(0, 1), P(0, 0), P(0.5, 0.65), P(1, 0), P(1, 1)]] },
  // Стереть карту: туда-обратно
  { spell: 'mischiefManaged', variants: [wipe(3, true), wipe(3, false), wipe(4, true), wipe(4, false), wipe(5, true), wipe(5, false)] }
];

function pathLength(points: Point[]): number {
  let d = 0;
  for (let i = 1; i < points.length; i++) d += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  return d;
}

/** Равномерно расставляет n точек вдоль ломаной. */
export function resample(points: Point[], n = N): Point[] {
  const step = pathLength(points) / (n - 1);
  if (step === 0) return Array.from({ length: n }, () => ({ ...points[0] }));
  const src = points.map((p) => ({ ...p }));
  const out: Point[] = [{ ...src[0] }];
  let acc = 0;
  for (let i = 1; i < src.length; i++) {
    const a = src[i - 1];
    const b = src[i];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (acc + d >= step && d > 0) {
      const t = (step - acc) / d;
      const q = P(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y));
      out.push(q);
      src.splice(i, 0, q);
      acc = 0;
    } else {
      acc += d;
    }
  }
  while (out.length < n) out.push({ ...src[src.length - 1] });
  return out.slice(0, n);
}

function bounds(points: Point[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { minX, minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
}

/** Центр масс в (0, 0), бо́льшая сторона = 1, пропорции сохраняются. */
function normalize(points: Point[]): Point[] {
  const pts = resample(points);
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const { w, h } = bounds(pts);
  const k = 1 / (Math.max(w, h) || 1);
  return pts.map((p) => P((p.x - cx) * k, (p.y - cy) * k));
}

/** Поворачивает фигуру так, чтобы первая точка лежала на оси x. */
function alignStart(points: Point[]): Point[] {
  const a = -Math.atan2(points[0].y, points[0].x);
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return points.map((p) => P(p.x * cos - p.y * sin, p.x * sin + p.y * cos));
}

function distance(a: Point[], b: Point[]): number {
  let d = 0;
  for (let i = 0; i < a.length; i++) d += Math.hypot(a[i].x - b[i].x, a[i].y - b[i].y);
  return d / a.length;
}

const TEMPLATES = GESTURES.flatMap((g) => g.variants.map((v) => {
  const points = normalize(v);
  return {
    spell: g.spell,
    anyRotation: !!g.anyRotation,
    threshold: g.threshold ?? MATCH_THRESHOLD,
    points: g.anyRotation ? alignStart(points) : points
  };
}));

export interface Recognition {
  spell: SpellId;
  /** Средняя дистанция до шаблона: чем меньше, тем точнее. */
  score: number;
}

/** Нарисованный штрих (экранные координаты) → заклинание или null. */
export function recognize(stroke: Point[]): Recognition | null {
  if (stroke.length < 5) return null;
  const box = bounds(stroke);
  if (Math.max(box.w, box.h) < MIN_GESTURE_SIZE) return null;
  const points = normalize(stroke);
  const aligned = alignStart(points);
  let best: (Recognition & { threshold: number }) | null = null;
  for (const t of TEMPLATES) {
    const score = distance(t.anyRotation ? aligned : points, t.points);
    if (!best || score < best.score) best = { spell: t.spell, score, threshold: t.threshold };
  }
  return best && best.score <= best.threshold ? { spell: best.spell, score: best.score } : null;
}

/** Схема жеста для учебника заклинаний: линия, точка начала и стрелка в конце. */
export function gestureSvg(spell: SpellId, size = 56): string {
  const g = GESTURES.find((x) => x.spell === spell);
  if (!g) return '';
  const pts = g.variants[0];
  const { minX, minY, w, h } = bounds(pts);
  const pad = 8;
  const k = (size - pad * 2) / (Math.max(w, h) || 1);
  const ox = pad + ((size - pad * 2) - w * k) / 2;
  const oy = pad + ((size - pad * 2) - h * k) / 2;
  const map = (p: Point) => P(ox + (p.x - minX) * k, oy + (p.y - minY) * k);
  const screen = pts.map(map);
  const f = (v: number) => String(Math.round(v * 10) / 10);
  const d = 'M' + screen.map((p) => `${f(p.x)} ${f(p.y)}`).join('L');
  const end = screen[screen.length - 1];
  const prev = resample(screen, 24)[21];
  const ang = Math.atan2(end.y - prev.y, end.x - prev.x);
  const arrow = [ang + 2.6, ang - 2.6].map((a) => `${f(end.x + Math.cos(a) * 7)} ${f(end.y + Math.sin(a) * 7)}`);
  const start = screen[0];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">` +
    `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M${arrow[0]}L${f(end.x)} ${f(end.y)}L${arrow[1]}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="${f(start.x)}" cy="${f(start.y)}" r="3.6" style="fill: var(--hp-accent, currentColor)"/></svg>`;
}
