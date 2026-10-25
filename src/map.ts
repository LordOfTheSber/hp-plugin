/*
 * Карта Мародёров: граф ссылок между заметками, маршрут от заметки к заметке и раскладка карты.
 * Чистая логика без DOM и Obsidian: на вход — metadataCache.resolvedLinks.
 */

/** metadataCache.resolvedLinks: откуда → куда → сколько ссылок. */
export type LinkTable = Record<string, Record<string, number>>;

/**
 * Как пройти к соседней заметке: по ссылке из текста, по обратной ссылке
 * (соседняя заметка ссылается на эту, в тексте ссылки нет) или в обе стороны.
 */
export type Passage = 'link' | 'backlink' | 'both';

export interface Neighbor {
  path: string;
  passage: Passage;
}

const isNote = (path: string) => path.endsWith('.md');

/** «Люди/Гарри Поттер.md» → «Гарри Поттер». */
export function noteName(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '');
}

/** «Люди/Гарри Поттер.md» → «Люди», заметка в корне → «». */
export function noteFolder(path: string): string {
  const i = path.lastIndexOf('/');
  return i < 0 ? '' : path.slice(0, i);
}

const collator = new Intl.Collator();
const byName = (a: string, b: string) => collator.compare(noteName(a), noteName(b)) || collator.compare(a, b);

export class LinkGraph {
  private out = new Map<string, Set<string>>();
  private in = new Map<string, Set<string>>();

  /** Вложения (картинки, PDF) в граф не попадают: через общую картинку заметки не связаны. */
  constructor(links: LinkTable) {
    for (const [from, targets] of Object.entries(links)) {
      if (!isNote(from)) continue;
      for (const to of Object.keys(targets ?? {})) {
        if (to === from || !isNote(to)) continue;
        link(this.out, from, to);
        link(this.in, to, from);
      }
    }
  }

  passage(from: string, to: string): Passage | null {
    const forward = this.out.get(from)?.has(to) ?? false;
    const back = this.in.get(from)?.has(to) ?? false;
    return forward && back ? 'both' : forward ? 'link' : back ? 'backlink' : null;
  }

  /** Соседи: сначала куда ведут ссылки из текста, потом откуда ссылаются сюда; внутри — по имени. */
  neighbors(path: string): Neighbor[] {
    const out = [...(this.out.get(path) ?? [])].sort(byName);
    const back = [...(this.in.get(path) ?? [])].filter((p) => !this.out.get(path)?.has(p)).sort(byName);
    return [...out, ...back].map((p) => ({ path: p, passage: this.passage(path, p)! }));
  }

  degree(path: string): number {
    const out = this.out.get(path);
    let n = out?.size ?? 0;
    for (const p of this.in.get(path) ?? []) if (!out?.has(p)) n++;
    return n;
  }

  /**
   * Кратчайший путь по ссылкам в обе стороны: обратная ссылка — тоже тайный ход.
   * При равной длине предпочитаются ссылки из текста — по ним проще идти.
   * Возвращает заметки от from до to включительно или null, если хода нет.
   */
  route(from: string, to: string): string[] | null {
    if (from === to) return [from];
    const prev = new Map<string, string>([[from, '']]);
    let layer = [from];
    while (layer.length) {
      const next: string[] = [];
      for (const node of layer) {
        for (const { path } of this.neighbors(node)) {
          if (prev.has(path)) continue;
          prev.set(path, node);
          if (path === to) {
            const route = [to];
            for (let p = node; p; p = prev.get(p)!) route.unshift(p);
            return route;
          }
          next.push(path);
        }
      }
      layer = next;
    }
    return null;
  }
}

function link(map: Map<string, Set<string>>, from: string, to: string): void {
  let set = map.get(from);
  if (!set) map.set(from, (set = new Set()));
  set.add(to);
}

// ---------- Маршрут ----------

export interface Route {
  /** Куда идём. */
  target: string;
  /** Путь от текущей заметки до цели включительно; null — отсюда к цели хода нет. */
  steps: string[] | null;
}

export type RouteStatus = 'arrived' | 'onRoute' | 'rerouted' | 'lost';

/**
 * Пользователь открыл заметку current: продвинуться по маршруту, перестроить его
 * (свернули с пути — как навигатор) или сообщить, что пришли.
 */
export function followRoute(graph: LinkGraph, route: Route, current: string): { route: Route | null; status: RouteStatus } {
  if (current === route.target) return { route: null, status: 'arrived' };
  const i = route.steps?.indexOf(current) ?? -1;
  if (i >= 0) return { route: { ...route, steps: route.steps!.slice(i) }, status: 'onRoute' };
  const steps = graph.route(current, route.target);
  return { route: { ...route, steps }, status: steps ? 'rerouted' : 'lost' };
}

// ---------- Следы ----------

export const FOOTPRINTS_MAX = 12;

/** Недавние заметки, свежие первыми, без повторов. */
export function addFootprint(footprints: string[], path: string, max = FOOTPRINTS_MAX): string[] {
  return [path, ...footprints.filter((p) => p !== path)].slice(0, max);
}

// ---------- Раскладка карты ----------

export interface MapNode {
  path: string;
  x: number;
  y: number;
  /** 0 — вы здесь, 1 — соседние заметки, 2 — через одну. */
  ring: 0 | 1 | 2;
  /** Через какую заметку сюда идти (для ring 2 — сосед из ring 1). */
  parent: string | null;
  /** Как пройти от parent сюда. */
  passage: Passage | null;
}

export interface MapLayout {
  nodes: MapNode[];
  /** Сколько соседей не поместилось на карту. */
  hidden: number;
}

/** Круги карты — эллипсы, вытянутые вверх: боковая панель узкая, а подписи пишутся по бокам. */
export const MAP_RINGS = { ring1: { rx: 70, ry: 98 }, ring2: { rx: 122, ry: 150 } };
export const MAP_LIMITS = { ring1: 12, ring2: 16 };

/**
 * Окрестности заметки: в центре — вы, по первому кругу — соседи, по второму — их соседи.
 * Следующие шаги маршрута всегда попадают на карту, первый из них — наверху.
 */
export function layoutMap(graph: LinkGraph, center: string, route: string[] = [], limits = MAP_LIMITS): MapLayout {
  const nodes: MapNode[] = [{ path: center, x: 0, y: 0, ring: 0, parent: null, passage: null }];
  const all = graph.neighbors(center);
  const first = route[0] === center ? route[1] : undefined;
  // Не всё помещается: остаются шаг маршрута и самые связанные заметки
  const isFirst = (n: Neighbor) => Number(n.path === first);
  const ordered = all
    .map((n, i) => ({ ...n, i, degree: graph.degree(n.path) }))
    .sort((a, b) => isFirst(b) - isFirst(a) || b.degree - a.degree || a.i - b.i)
    .slice(0, limits.ring1)
    // Шаг маршрута — наверху, остальные по кругу в исходном порядке
    .sort((a, b) => isFirst(b) - isFirst(a) || a.i - b.i);
  const taken = new Set([center, ...ordered.map((n) => n.path)]);
  const step = (Math.PI * 2) / Math.max(ordered.length, 1);

  const children = new Map<string, Neighbor[]>();
  let budget = limits.ring2;
  const perParent = Math.min(3, Math.max(1, Math.ceil(limits.ring2 / Math.max(ordered.length, 1))));
  // Шаг маршрута идёт первым, и его продолжение (второй шаг) точно попадает на карту
  const second = first ? route[2] : undefined;
  for (const n of ordered) {
    const isSecond = (k: Neighbor) => Number(n.path === first && k.path === second);
    const kids = graph.neighbors(n.path)
      .filter((k) => !taken.has(k.path))
      .sort((a, b) => isSecond(b) - isSecond(a));
    const pick = kids.slice(0, Math.min(perParent, budget));
    for (const k of pick) taken.add(k.path);
    budget -= pick.length;
    children.set(n.path, pick);
  }

  ordered.forEach((n, i) => {
    const angle = -Math.PI / 2 + i * step;
    nodes.push({ path: n.path, ...ellipse(MAP_RINGS.ring1, angle), ring: 1, parent: center, passage: n.passage });
    const kids = children.get(n.path) ?? [];
    const spread = Math.min(step * 0.7, 0.8);
    kids.forEach((k, j) => {
      const a = kids.length > 1 ? angle - spread / 2 + (spread * j) / (kids.length - 1) : angle;
      const inset = j % 2 ? 10 : 0;
      const ring = { rx: MAP_RINGS.ring2.rx - inset, ry: MAP_RINGS.ring2.ry - inset };
      nodes.push({ path: k.path, ...ellipse(ring, a), ring: 2, parent: n.path, passage: k.passage });
    });
  });

  return { nodes, hidden: all.length - ordered.length };
}

function ellipse({ rx, ry }: { rx: number; ry: number }, angle: number): { x: number; y: number } {
  return { x: round(Math.cos(angle) * rx), y: round(Math.sin(angle) * ry) };
}

const round = (v: number) => Math.round(v * 10) / 10;

export interface Footstep {
  x: number;
  y: number;
  /** Куда смотрит носок, в градусах (0 — вверх). */
  angle: number;
}

/** Следы от точки a к точке b: левый, правый, левый… с отступом от кружков заметок. */
export function footsteps(a: { x: number; y: number }, b: { x: number; y: number }, spacing = 15, margin = 14): Footstep[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const count = Math.floor((len - margin * 2) / spacing);
  if (count < 1) return [];
  const ux = dx / len;
  const uy = dy / len;
  const angle = round((Math.atan2(dy, dx) * 180) / Math.PI + 90);
  const start = (len - (count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, i) => {
    const d = start + i * spacing;
    const side = i % 2 ? 3.5 : -3.5;
    return { x: round(a.x + ux * d - uy * side), y: round(a.y + uy * d + ux * side), angle };
  });
}
