/*
 * Волшебные палочки: древесина, сердцевина, длина, гибкость, рукоять — и SVG по этим параметрам.
 * Чистая логика без DOM: палочка рисуется строкой SVG (для курсора, превью и лавки Олливандера).
 */

export type WoodId = 'holly' | 'vine' | 'willow' | 'elder' | 'yew' | 'hawthorn' | 'cherry' | 'ash'
  | 'walnut' | 'hornbeam' | 'rosewood' | 'cypress' | 'oak' | 'ebony' | 'mahogany';
export type CoreId = 'phoenix' | 'dragon' | 'unicorn' | 'thestral' | 'veela';
export type FlexId = 'unyielding' | 'rigid' | 'springy' | 'supple' | 'pliable' | 'swishy';
export type HandleId = 'smooth' | 'ringed' | 'spiral' | 'knotted' | 'claw' | 'bulb';

export interface WandSpec {
  wood: WoodId;
  core: CoreId;
  /** Длина в дюймах, шаг ¼. */
  length: number;
  flex: FlexId;
  handle: HandleId;
}

/** Цвет древесины: основной, блик и тень. */
export const WOODS: Record<WoodId, { base: string; light: string; dark: string }> = {
  holly: { base: '#a8784a', light: '#d2a877', dark: '#5e3d21' },
  vine: { base: '#8a6a48', light: '#b89470', dark: '#4a3522' },
  willow: { base: '#b48a5a', light: '#dcb88a', dark: '#6e4f2e' },
  elder: { base: '#8f8576', light: '#bdb3a3', dark: '#4f463b' },
  yew: { base: '#d8cdb4', light: '#f3ecdc', dark: '#8e7f63' },
  hawthorn: { base: '#4e3527', light: '#7d5a45', dark: '#24170f' },
  cherry: { base: '#8c3f2b', light: '#b8674b', dark: '#4c1d12' },
  ash: { base: '#cdb48c', light: '#ecdcbc', dark: '#85704e' },
  walnut: { base: '#4a3021', light: '#765340', dark: '#22150d' },
  hornbeam: { base: '#b39b77', light: '#d8c4a2', dark: '#6b5a40' },
  rosewood: { base: '#7d3a2e', light: '#a8604f', dark: '#3f1813' },
  cypress: { base: '#a57348', light: '#cf9d70', dark: '#5c3c22' },
  oak: { base: '#8a6436', light: '#b48c5a', dark: '#4c3519' },
  ebony: { base: '#2b2320', light: '#554740', dark: '#110c0a' },
  mahogany: { base: '#6e2e1e', light: '#9a5240', dark: '#34120a' }
};

/** Цвет магии сердцевины: glow — на тёмном фоне, ink — на светлом. */
export const CORES: Record<CoreId, { glow: string; ink: string }> = {
  phoenix: { glow: '#ffb347', ink: '#b85f00' },
  dragon: { glow: '#ff6b4a', ink: '#b8321a' },
  unicorn: { glow: '#e6eeff', ink: '#5f6f9a' },
  thestral: { glow: '#9fb4d9', ink: '#475d8a' },
  veela: { glow: '#ffc4e1', ink: '#b04880' }
};

export const WOOD_IDS = Object.keys(WOODS) as WoodId[];
export const CORE_IDS = Object.keys(CORES) as CoreId[];
export const FLEX_IDS: FlexId[] = ['unyielding', 'rigid', 'springy', 'supple', 'pliable', 'swishy'];
export const HANDLE_IDS: HandleId[] = ['smooth', 'ringed', 'spiral', 'knotted', 'claw', 'bulb'];
export const LENGTH_MIN = 8;
export const LENGTH_MAX = 16;
export const LENGTH_STEP = 0.25;

export type PresetId = 'harry' | 'hermione' | 'ron' | 'dumbledore' | 'voldemort' | 'draco'
  | 'neville' | 'bellatrix' | 'cedric' | 'lupin' | 'fleur' | 'krum';

// Древесина, сердцевина и длина — из книг и Pottermore; рукоять — по палочкам из фильмов.
export const WAND_PRESETS: { id: PresetId; wand: WandSpec }[] = [
  { id: 'harry', wand: { wood: 'holly', core: 'phoenix', length: 11, flex: 'supple', handle: 'ringed' } },
  { id: 'hermione', wand: { wood: 'vine', core: 'dragon', length: 10.75, flex: 'supple', handle: 'spiral' } },
  { id: 'ron', wand: { wood: 'willow', core: 'unicorn', length: 14, flex: 'springy', handle: 'bulb' } },
  { id: 'dumbledore', wand: { wood: 'elder', core: 'thestral', length: 15, flex: 'unyielding', handle: 'knotted' } },
  { id: 'voldemort', wand: { wood: 'yew', core: 'phoenix', length: 13.5, flex: 'rigid', handle: 'claw' } },
  { id: 'draco', wand: { wood: 'hawthorn', core: 'unicorn', length: 10, flex: 'springy', handle: 'smooth' } },
  { id: 'neville', wand: { wood: 'cherry', core: 'unicorn', length: 13, flex: 'supple', handle: 'ringed' } },
  { id: 'bellatrix', wand: { wood: 'walnut', core: 'dragon', length: 12.75, flex: 'unyielding', handle: 'claw' } },
  { id: 'cedric', wand: { wood: 'ash', core: 'unicorn', length: 12.25, flex: 'springy', handle: 'smooth' } },
  { id: 'lupin', wand: { wood: 'cypress', core: 'unicorn', length: 10.25, flex: 'pliable', handle: 'ringed' } },
  { id: 'fleur', wand: { wood: 'rosewood', core: 'veela', length: 9.5, flex: 'rigid', handle: 'smooth' } },
  { id: 'krum', wand: { wood: 'hornbeam', core: 'dragon', length: 10.25, flex: 'rigid', handle: 'bulb' } }
];

export const DEFAULT_WAND: WandSpec = { ...WAND_PRESETS[0].wand };

export function sameWand(a: WandSpec, b: WandSpec): boolean {
  return a.wood === b.wood && a.core === b.core && a.length === b.length && a.flex === b.flex && a.handle === b.handle;
}

/** Чья это палочка, если она совпадает с канонической. */
export function presetOf(spec: WandSpec): PresetId | null {
  return WAND_PRESETS.find((p) => sameWand(p.wand, spec))?.id ?? null;
}

export function clampLength(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_WAND.length;
  const stepped = Math.round(value / LENGTH_STEP) * LENGTH_STEP;
  return Math.min(LENGTH_MAX, Math.max(LENGTH_MIN, stepped));
}

/** Сохранённые данные → корректная палочка (неизвестное заменяется палочкой по умолчанию). */
export function sanitizeWand(data: unknown): WandSpec {
  const raw = (data && typeof data === 'object' ? data : {}) as Partial<Record<keyof WandSpec, unknown>>;
  const pick = <T extends string>(value: unknown, ids: readonly T[], fallback: T): T =>
    ids.includes(value as T) ? (value as T) : fallback;
  return {
    wood: pick(raw.wood, WOOD_IDS, DEFAULT_WAND.wood),
    core: pick(raw.core, CORE_IDS, DEFAULT_WAND.core),
    length: typeof raw.length === 'number' ? clampLength(raw.length) : DEFAULT_WAND.length,
    flex: pick(raw.flex, FLEX_IDS, DEFAULT_WAND.flex),
    handle: pick(raw.handle, HANDLE_IDS, DEFAULT_WAND.handle)
  };
}

/** «Палочка выбирает волшебника»: случайная палочка (обычно 9–14 дюймов). */
export function randomWand(rnd: () => number = Math.random): WandSpec {
  const one = <T>(list: readonly T[]): T => list[Math.floor(rnd() * list.length) % list.length];
  return {
    wood: one(WOOD_IDS),
    core: one(CORE_IDS),
    length: clampLength(9 + rnd() * 5),
    flex: one(FLEX_IDS),
    handle: one(HANDLE_IDS)
  };
}

const FRACTIONS: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾' };

/** 10.75 → «10¾». */
export function formatLength(length: number): string {
  const whole = Math.floor(length);
  const frac = String(Math.round((length - whole) * 100) / 100);
  return `${whole}${FRACTIONS[frac] ?? ''}`;
}

// ---------- Рисование ----------

type Pt = [number, number];

const HANDLE_LEN = 34; // длина рукояти в единицах рисунка (10 единиц = 1 дюйм)
const TIP_R = 0.9;
const JOIN_R = 2.5;

const bump = (x: number, center: number, width: number): number => {
  const d = (x - center) / width;
  return d * d < 1 ? (1 - d * d) ** 2 : 0;
};
const smoothstep = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Положения узлов бузинной палочки. */
function knots(len: number): number[] {
  const out: number[] = [];
  const step = (len - 16) / 7;
  for (let x = 6; x < len - 9; x += step) out.push(x);
  return out;
}

/** Профиль палочки: радиус в точке x (0 — навершие, len — кончик). */
function radiusAt(handle: HandleId, x: number, len: number): number {
  const h = HANDLE_LEN;
  const t = 1 - x / h; // 1 у навершия, 0 у стыка с древком
  let grip: number;
  let cap = 2.2;
  switch (handle) {
    case 'ringed':
      grip = 2.95 + 0.2 * t + 0.9 * bump(x, 2.8, 3);
      for (const c of [8, 13.5, 19, 24.5, 30]) grip += 0.5 * bump(x, c, 1.7);
      cap = 2;
      break;
    case 'spiral':
      grip = 3 + 0.15 * t + 0.18 * Math.max(0, Math.sin(x * 2.2));
      break;
    case 'knotted':
      grip = 2.8 + 0.25 * t;
      break;
    case 'claw':
      grip = 2.7 + 0.5 * bump(x, 11, 2.2) + 0.5 * bump(x, 21, 2.2);
      cap = 0;
      break;
    case 'bulb':
      grip = 2.8 + 1.9 * bump(x, 4.2, 4.4);
      cap = 1.4;
      break;
    default:
      grip = 2.9 + 0.35 * t;
  }
  const shaft = TIP_R + (JOIN_R - TIP_R) * Math.pow(Math.max(0, (len - x) / (len - h)), 0.85);
  const blend = smoothstep(h - 1.5, h + 1.5, x);
  let r = grip * (1 - blend) + shaft * blend + 0.45 * bump(x, h, 1.4);
  if (handle === 'knotted') {
    for (const c of knots(len)) r += (0.85 - 0.4 * (c / len)) * bump(x, c, 1.6);
  }
  // Навершие: скруглённое, у «когтя» — заострённое
  if (cap > 0 && x < cap) r *= Math.sqrt(1 - ((cap - x) / cap) ** 2);
  if (handle === 'claw' && x < 7) r *= Math.pow(x / 7, 0.75);
  // Кончик
  if (x > len - 1) r *= Math.sqrt(Math.max(0, 1 - (x - (len - 1)) ** 2));
  return r;
}

/** Изгиб оси: только у «когтя» рукоять загибается крюком. */
function axisAt(handle: HandleId, x: number): number {
  if (handle !== 'claw' || x >= HANDLE_LEN) return 0;
  return 6.5 * Math.pow((HANDLE_LEN - x) / HANDLE_LEN, 2.4);
}

// Рамер — Дуглас — Пекер: убирает лишние точки на прямых участках.
function simplify(points: Pt[], eps: number): Pt[] {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const d = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / len;
    if (d > worst) {
      worst = d;
      index = i;
    }
  }
  if (worst <= eps) return [points[0], points[points.length - 1]];
  return simplify(points.slice(0, index + 1), eps).slice(0, -1).concat(simplify(points.slice(index), eps));
}

const num = (v: number) => String(Math.round(v * 100) / 100);
const pt = ([x, y]: Pt) => `${num(x)} ${num(y)}`;

/** Контур палочки в своих координатах: ось по x от 0 (навершие) до длины·10 (кончик). */
export function wandOutline(spec: WandSpec, thickness = 1, bend = 1): string {
  const len = spec.length * 10;
  const top: Pt[] = [];
  const bottom: Pt[] = [];
  const dx = 0.4;
  for (let x = 0; x <= len + 1e-9; x += dx) {
    const r = radiusAt(spec.handle, x, len) * thickness;
    const y = axisAt(spec.handle, x) * bend;
    const slope = (axisAt(spec.handle, x + 0.01) - axisAt(spec.handle, x - 0.01)) * bend / 0.02;
    const n = Math.hypot(slope, 1);
    top.push([x + (slope / n) * r, y - r / n]);
    bottom.push([x - (slope / n) * r, y + r / n]);
  }
  const outline = simplify(top, 0.03).concat(simplify(bottom, 0.03).reverse());
  return 'M' + outline.map(pt).join('L') + 'Z';
}

interface Layers {
  defs: string;
  body: string;
}

/** Палочка целиком в своих координатах (с отделкой рукояти, без свечения кончика). */
interface LayerOptions {
  /** Мелкие детали: волокна, бороздки колец (только для крупного рисунка). */
  detail: boolean;
  thickness: number;
  bend: number;
  /** Толщина контура и светлого ореола (0 — без ореола) в единицах рисунка. */
  outline: number;
  halo: number;
}

function wandLayers(spec: WandSpec, id: string, { detail, thickness, bend, outline: stroke, halo }: LayerOptions): Layers {
  const wood = WOODS[spec.wood];
  const len = spec.length * 10;
  const outline = wandOutline(spec, thickness, bend);
  const h = HANDLE_LEN;
  const grad = `${id}-wood`;
  const clip = `${id}-clip`;
  const ext = 4 * thickness;
  const span = 6 * thickness;
  let defs = `<linearGradient id="${grad}" gradientUnits="userSpaceOnUse" x1="0" y1="${num(-ext)}" x2="0" y2="${num(ext)}">` +
    `<stop offset="0" stop-color="${wood.light}"/><stop offset=".45" stop-color="${wood.base}"/>` +
    `<stop offset="1" stop-color="${wood.dark}"/></linearGradient>`;
  let body = '';
  if (halo > 0) body += `<path d="${outline}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${num(halo)}" stroke-linejoin="round"/>`;
  body += `<path d="${outline}" fill="url(#${grad})"/>`;

  // Отделка рукояти, обрезанная по контуру
  const marks: string[] = [];
  const dark = wood.dark;
  if (spec.handle !== 'claw') marks.push(`<rect x="-1" y="${num(-2 * span)}" width="${h + 1}" height="${num(4 * span)}" fill="${dark}" opacity=".16"/>`);
  if (spec.handle === 'spiral') {
    for (let x = 1; x < h + 16; x += 2.6) {
      const fade = x > h ? 0.5 * (1 - (x - h) / 16) : 0.55;
      marks.push(`<path d="M${num(x)} ${num(-span)}L${num(x + 2.4 * thickness)} ${num(span)}" stroke="${dark}" stroke-width="${num(0.55 * thickness)}" opacity="${num(fade)}"/>`);
    }
  }
  if (spec.handle === 'ringed' && detail) {
    for (const x of [10.75, 16.25, 21.75, 27.25]) marks.push(`<path d="M${x} -6V6" stroke="${dark}" stroke-width=".4" opacity=".55"/>`);
  }
  if (detail) {
    marks.push(`<path d="M${h} -6V6" stroke="${dark}" stroke-width=".45" opacity=".6"/>`);
    // Волокна древесины вдоль древка
    marks.push(`<path d="M${h + 3} -.7L${num(len - 6)} -.35M${h + 6} .8L${num(len - 12)} .4" stroke="${dark}" stroke-width=".22" opacity=".25" fill="none"/>`);
  }
  if (marks.length) {
    defs += `<clipPath id="${clip}"><path d="${outline}"/></clipPath>`;
    body += `<g clip-path="url(#${clip})">${marks.join('')}</g>`;
  }
  body += `<path d="${outline}" fill="none" stroke="${dark}" stroke-width="${num(stroke)}" stroke-linejoin="round" opacity=".8"/>`;
  return { defs, body };
}

function glowSvg(id: string, color: string, cx: number, cy: number, r: number, core: number): Layers {
  const grad = `${id}-glow`;
  return {
    defs: `<radialGradient id="${grad}"><stop offset="0" stop-color="${color}" stop-opacity=".95"/>` +
      `<stop offset=".4" stop-color="${color}" stop-opacity=".55"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`,
    body: `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" fill="url(#${grad})"/>` +
      `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(core)}" fill="#fffdf0"/>`
  };
}

/** Палочка сбоку: навершие слева, кончик справа. Все палочки в одном масштабе, так что видна длина. */
export function wandSideSvg(spec: WandSpec, width = 340, id = 'hp-wand'): string {
  const len = spec.length * 10;
  const vb = { x: -3, y: -11, w: LENGTH_MAX * 10 + 12, h: 22 };
  const wand = wandLayers(spec, id, { detail: true, thickness: 1, bend: 1, outline: 0.35, halo: 0 });
  const glow = glowSvg(id, CORES[spec.core].glow, len, 0, 5.5, 0.9);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${num((width * vb.h) / vb.w)}" ` +
    `viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" aria-hidden="true"><defs>${wand.defs}${glow.defs}</defs>` +
    `${wand.body}${glow.body}</svg>`;
}

export const CURSOR_SIZE = 32;

/** Курсор: палочка по диагонали, кончик слева вверху. Возвращает SVG и точку кончика. */
export function wandCursorSvg(spec: WandSpec, scale = 1, id = 'c'): { svg: string; hotspot: Pt } {
  const len = spec.length * 10;
  const end = 29.5; // навершие в правом нижнем углу
  const diag = 30 + ((spec.length - LENGTH_MIN) / (LENGTH_MAX - LENGTH_MIN)) * 8.5;
  const s = diag / len;
  const tip = end - diag / Math.SQRT2;
  const thickness = 2.1;
  const wand = wandLayers(spec, id, { detail: false, thickness, bend: 1.5, outline: 0.5 / s, halo: 1.6 / s });
  const glow = glowSvg(id, CORES[spec.core].glow, tip, tip, 3.2, 1.1);
  const size = CURSOR_SIZE * scale;
  // Зеркалим по y, чтобы блик был сверху справа
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${CURSOR_SIZE} ${CURSOR_SIZE}">` +
    `<defs>${wand.defs}${glow.defs}</defs>` +
    `<g transform="translate(${end} ${end}) rotate(225) scale(${s.toFixed(4)} ${(-s).toFixed(4)})">${wand.body}</g>` +
    `${glow.body}</svg>`;
  return { svg, hotspot: [Math.round(tip), Math.round(tip)] };
}

const dataUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** Значение CSS-свойства cursor: чёткая палочка и на обычных, и на Retina-экранах. */
export function wandCursorCss(spec: WandSpec): string {
  const one = wandCursorSvg(spec, 1);
  const two = wandCursorSvg(spec, 2);
  const [x, y] = one.hotspot;
  return `image-set(${dataUri(one.svg)} 1x, ${dataUri(two.svg)} 2x) ${x} ${y}, auto`;
}
