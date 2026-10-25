/*
 * Карта Мародёров: граф ссылок и тегов, маршрут от заметки к заметке и раскладка карты.
 * Чистая логика без DOM и Obsidian: на вход — metadataCache.resolvedLinks и теги заметок.
 */

/** metadataCache.resolvedLinks: откуда → куда → сколько ссылок. */
export type LinkTable = Record<string, Record<string, number>>;

/** Теги заметок: путь → теги («#домашка», как отдаёт getAllTags). */
export type TagTable = Record<string, string[]>;

/**
 * Как пройти к соседу: по ссылке из текста, по обратной ссылке (соседняя заметка
 * ссылается на эту, в тексте ссылки нет), в обе стороны или через общий тег.
 * Тег — отдельный узел графа: заметка → #тег → другая заметка с этим тегом.
 * Так популярный тег не превращает карту в паутину, а связь через тег
 * весит как две ссылки — прямые ссылки при равной длине пути важнее.
 */
export type Passage = 'link' | 'backlink' | 'both' | 'tag';

export interface Neighbor {
  path: string;
  passage: Passage;
}

/** Неизведанная комната: ссылка на заметку, которой ещё нет. «?» в именах файлов Obsidian запрещён. */
const GHOST = '?';

/** Узел — неизведанная комната: «?Новая заметка». */
export function isGhost(id: string): boolean {
  return id.startsWith(GHOST);
}

export const ghostId = (linktext: string) => GHOST + linktext;
/** Текст ссылки неизведанной комнаты: по нему Obsidian и создаёт заметку. */
export const ghostLink = (id: string) => id.slice(GHOST.length);

const isNote = (path: string) => path.endsWith('.md') && !isGhost(path);

/** Узел-тег: «#домашка». Пути заметок кончаются на .md, а точек в тегах не бывает. */
export function isTag(id: string): boolean {
  return id.startsWith('#') && !isNote(id);
}

/** «Люди/Гарри Поттер.md» → «Гарри Поттер», тег остаётся тегом: «#хогвартс/зелья». */
export function noteName(path: string): string {
  if (isTag(path)) return path;
  const name = isGhost(path) ? ghostLink(path) : path;
  return name.slice(name.lastIndexOf('/') + 1).replace(/\.md$/, '');
}

/** «Люди/Гарри Поттер.md» → «Люди», заметка в корне, тег или неизведанная комната → «». */
export function noteFolder(path: string): string {
  if (isTag(path) || isGhost(path)) return '';
  const i = path.lastIndexOf('/');
  return i < 0 ? '' : path.slice(0, i);
}

/** Лежит ли заметка в одной из папок (на любой глубине вложенности для имён без «/»: «Архив» — и «Работа/Архив»). */
export function inFolder(path: string, folders: string[], anyDepth = false): boolean {
  const p = '/' + path;
  return folders.some((f) => path.startsWith(f + '/') || (anyDepth && p.includes('/' + f + '/')));
}

const collator = new Intl.Collator();
const byName = (a: string, b: string) => collator.compare(noteName(a), noteName(b)) || collator.compare(a, b);

export interface GraphOptions {
  /** metadataCache.unresolvedLinks: ссылки на заметки, которых ещё нет, — неизведанные комнаты. */
  unresolved?: LinkTable;
  /** Папки, которых нет на карте и в маршрутах. */
  exclude?: string[];
}

export class LinkGraph {
  private out = new Map<string, Set<string>>();
  private in = new Map<string, Set<string>>();
  /** Заметка → её теги и тег → его заметки. */
  private tagged = new Map<string, Set<string>>();
  /** Заметка → неизведанные комнаты, на которые она ссылается. */
  private ghostsOf = new Map<string, Set<string>>();
  /** Тег без учёта регистра → написание на карте. */
  private tagIds = new Map<string, string>();
  /** Отсортированные соседи: поиск пути спрашивает их много раз. */
  private sorted = new Map<string, Neighbor[]>();
  private readonly exclude: string[];

  /**
   * Вложения (картинки, PDF) в граф не попадают: через общую картинку заметки не связаны.
   * Теги сравниваются без учёта регистра, как в Obsidian; на карте — написание из первой заметки.
   */
  constructor(links: LinkTable, tags: TagTable = {}, options: GraphOptions = {}) {
    this.exclude = options.exclude ?? [];
    const unresolved = options.unresolved ?? {};
    const paths = new Set([...Object.keys(links), ...Object.keys(tags), ...Object.keys(unresolved)]);
    for (const path of paths) this.addNote(path, links[path], tags[path], unresolved[path]);
  }

  /** Заметку поправили: её ссылки, теги и неизведанные комнаты — заново, остальной граф не трогаем. */
  setNote(path: string, links?: Record<string, number>, tags?: string[], unresolved?: Record<string, number>): void {
    this.removeNote(path);
    this.addNote(path, links, tags, unresolved);
    this.sorted.clear();
  }

  private excluded(path: string): boolean {
    return inFolder(path, this.exclude);
  }

  private addNote(path: string, links?: Record<string, number>, tags?: string[], unresolved?: Record<string, number>): void {
    if (!isNote(path) || this.excluded(path)) return;
    for (const to of Object.keys(links ?? {})) {
      if (to === path || !isNote(to) || this.excluded(to)) continue;
      link(this.out, path, to);
      link(this.in, to, path);
    }
    for (const raw of tags ?? []) {
      const tag = raw.startsWith('#') ? raw : `#${raw}`;
      if (tag.length < 2) continue;
      const key = tag.toLowerCase();
      if (!this.tagIds.has(key)) this.tagIds.set(key, tag);
      const id = this.tagIds.get(key)!;
      link(this.tagged, path, id);
      link(this.tagged, id, path);
    }
    for (const text of Object.keys(unresolved ?? {})) {
      if (text) link(this.ghostsOf, path, ghostId(text));
    }
  }

  private removeNote(path: string): void {
    for (const to of this.out.get(path) ?? []) this.in.get(to)?.delete(path);
    this.out.delete(path);
    for (const tag of this.tagged.get(path) ?? []) {
      const notes = this.tagged.get(tag);
      notes?.delete(path);
      if (notes && !notes.size) {
        this.tagged.delete(tag);
        this.tagIds.delete(tag.toLowerCase());
      }
    }
    this.tagged.delete(path);
    this.ghostsOf.delete(path);
  }

  passage(from: string, to: string): Passage | null {
    if (this.tagged.get(from)?.has(to)) return 'tag';
    const forward = this.out.get(from)?.has(to) ?? false;
    const back = this.in.get(from)?.has(to) ?? false;
    return forward && back ? 'both' : forward ? 'link' : back ? 'backlink' : null;
  }

  /**
   * Соседи: сначала куда ведут ссылки из текста, потом откуда ссылаются сюда, потом теги;
   * внутри — по имени. У тега соседи — заметки с этим тегом. Список общий, менять его нельзя.
   */
  neighbors(path: string): readonly Neighbor[] {
    let list = this.sorted.get(path);
    if (!list) {
      const out = [...(this.out.get(path) ?? [])].sort(byName);
      const back = [...(this.in.get(path) ?? [])].filter((p) => !this.out.get(path)?.has(p)).sort(byName);
      const tags = [...(this.tagged.get(path) ?? [])].sort(byName);
      list = [...out, ...back, ...tags].map((p) => ({ path: p, passage: this.passage(path, p)! }));
      this.sorted.set(path, list);
    }
    return list;
  }

  /** Неизведанные комнаты: ссылки из заметки на заметки, которых ещё нет. По имени. */
  ghosts(path: string): string[] {
    return [...(this.ghostsOf.get(path) ?? [])].sort(byName);
  }

  degree(path: string): number {
    const out = this.out.get(path);
    let n = (out?.size ?? 0) + (this.tagged.get(path)?.size ?? 0);
    for (const p of this.in.get(path) ?? []) if (!out?.has(p)) n++;
    return n;
  }

  /**
   * Кратчайший путь по ссылкам в обе стороны и через теги: обратная ссылка и общий тег — тоже тайные ходы.
   * При равной длине предпочитаются ссылки из текста — по ним проще идти.
   * Возвращает узлы от from до to включительно (теги — как промежуточные) или null, если хода нет.
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

/** rerouted — свернули с пути, changed — поменялись ссылки, и путь пришлось проложить заново. */
export type RouteStatus = 'arrived' | 'onRoute' | 'rerouted' | 'changed' | 'lost';

/** Следующая заметка маршрута: тег — не остановка, через него проходят. */
export function nextNote(steps: string[]): string | null {
  return steps.slice(1).find((p) => !isTag(p)) ?? null;
}

export interface RouteStep {
  path: string;
  /** Как сюда пройти от предыдущей заметки; у первой — null. */
  passage: Passage | null;
  /** Общий тег, если идти через него. */
  tag: string | null;
}

/** Маршрут списком заметок: теги становятся способом пройти («общий тег #домашка»). */
export function routeSteps(graph: LinkGraph, steps: string[]): RouteStep[] {
  const out: RouteStep[] = [];
  steps.forEach((path, i) => {
    if (isTag(path)) return;
    const prev = steps[i - 1];
    if (prev === undefined) out.push({ path, passage: null, tag: null });
    else if (isTag(prev)) out.push({ path, passage: 'tag', tag: prev });
    else out.push({ path, passage: graph.passage(prev, path), tag: null });
  });
  return out;
}

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

/**
 * Граф поменялся (ссылку убрали, заметку удалили, папку исключили): по маршруту ещё можно пройти?
 * Если нет — новый путь от current (или от начала маршрута). status null — ничего не изменилось.
 * Если раньше хода не было, а теперь появился, маршрут просто находится.
 */
export function revalidateRoute(graph: LinkGraph, route: Route, current: string | null): { route: Route; status: RouteStatus | null } {
  const steps = route.steps;
  const start = current ?? steps?.[0];
  if (steps && steps.every((p, i) => i === 0 || graph.passage(steps[i - 1], p) !== null) && (!current || steps[0] === current)) {
    return { route, status: null };
  }
  if (!start) return { route, status: null };
  const fresh = graph.route(start, route.target);
  if (!steps) return fresh ? { route: { ...route, steps: fresh }, status: null } : { route, status: null };
  return { route: { ...route, steps: fresh }, status: fresh ? 'changed' : 'lost' };
}

// ---------- Следы ----------

export const FOOTPRINTS_MAX = 12;

/** Недавние заметки, свежие первыми, без повторов. */
export function addFootprint(footprints: string[], path: string, max = FOOTPRINTS_MAX): string[] {
  return [path, ...footprints.filter((p) => p !== path)].slice(0, max);
}

/** «Запретная секция» — папка с одним из этих названий на любой глубине или путь к ней («Личное/Тайное»). */
export const RESTRICTED_FOLDERS = ['Restricted Section', 'Запретная секция'];

export function isRestricted(path: string, extra: string[] = []): boolean {
  return inFolder(path, [...RESTRICTED_FOLDERS, ...extra], true);
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
 * Окрестности заметки: в центре — вы, по первому кругу — соседи и неизведанные комнаты, по второму — соседи соседей.
 * Следующие шаги маршрута всегда попадают на карту, первый из них — наверху. limits.ring2 = 0 — карта в один круг.
 */
export function layoutMap(graph: LinkGraph, center: string, route: string[] = [], limits = MAP_LIMITS): MapLayout {
  const nodes: MapNode[] = [{ path: center, x: 0, y: 0, ring: 0, parent: null, passage: null }];
  // Неизведанные комнаты — в конце: у них нет связей, и при нехватке места они уступают заметкам
  const all: Neighbor[] = [...graph.neighbors(center), ...graph.ghosts(center).map((path) => ({ path, passage: 'link' as const }))];
  const first = route[0] === center ? route[1] : undefined;
  // Не всё помещается: остаются шаг маршрута, теги (их у заметки немного, а объединяют они многое)
  // и самые связанные заметки
  const isFirst = (n: Neighbor) => Number(n.path === first);
  const tagFirst = (n: Neighbor) => Number(isTag(n.path));
  const ordered = all
    .map((n, i) => ({ ...n, i, degree: graph.degree(n.path) }))
    .sort((a, b) => isFirst(b) - isFirst(a) || tagFirst(b) - tagFirst(a) || b.degree - a.degree || a.i - b.i)
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
