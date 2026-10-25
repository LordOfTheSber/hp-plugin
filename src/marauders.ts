/*
 * Карта Мародёров — боковая панель навигации по ссылкам и тегам:
 * где вы, куда отсюда ведут ссылки, обратные ссылки и общие теги, путь к любой заметке и ваши следы.
 * Граф, маршрут и раскладка — в src/map.ts, здесь — Obsidian и отрисовка.
 */
import { FuzzySuggestModal, ItemView, Keymap, Notice, TFile, getAllTags } from 'obsidian';
import type { App, HoverParent, HoverPopover, WorkspaceLeaf } from 'obsidian';
import type { Translate } from './i18n.ts';
import {
  FOOTPRINTS_MAX, LinkGraph, addFootprint, followRoute, footsteps, isTag, layoutMap, nextNote, noteFolder, noteName, routeSteps
} from './map.ts';
import type { MapNode, Passage, Route, RouteStatus, TagTable } from './map.ts';
import type HpThemePlugin from './main.ts';

export const MAP_VIEW = 'hp-marauders-map';

const SVG_NS = 'http://www.w3.org/2000/svg';
const RESTRICTED = /(^|\/)(Restricted Section|Запретная секция)\//;
const LABEL_MAX = 14;

/** Состояние карты: маршрут, следы, граф ссылок. Панелей карты может быть несколько, состояние одно. */
export class MaraudersMap {
  route: Route | null = null;
  /** Что случилось с маршрутом при последнем переходе: на карте пишется «путь перестроен». */
  routeStatus: RouteStatus | null = null;
  footprints: string[] = [];
  private cachedGraph: LinkGraph | null = null;
  /** С тегами ли построен граф: настройка могла поменяться. */
  private graphTags = false;

  constructor(private readonly plugin: HpThemePlugin) {}

  get app(): App {
    return this.plugin.app;
  }

  get t(): Translate {
    return this.plugin.t;
  }

  load(): void {
    const { plugin, app, t } = this;
    plugin.registerView(MAP_VIEW, (leaf) => new MaraudersMapView(leaf, this));
    plugin.registerHoverLinkSource(MAP_VIEW, { display: t('mapTitle'), defaultMod: true });
    plugin.addRibbonIcon('footprints', t('mapTitle'), () => void this.reveal());

    plugin.addCommand({ id: 'marauders-map', name: t('commandMapOpen'), callback: () => void this.reveal() });
    plugin.addCommand({ id: 'marauders-route', name: t('commandMapRoute'), callback: () => this.planRoute() });
    plugin.addCommand({
      id: 'marauders-next',
      name: t('commandMapNext'),
      checkCallback: (checking) => {
        if (!this.nextStep) return false;
        if (!checking) this.goNext();
        return true;
      }
    });

    plugin.registerEvent(app.workspace.on('file-open', (file) => this.onFileOpen(file)));
    plugin.registerEvent(app.workspace.on('active-leaf-change', () => this.refresh()));
    plugin.registerEvent(app.metadataCache.on('resolved', () => {
      this.cachedGraph = null;
      this.refresh();
    }));
    plugin.registerEvent(app.vault.on('rename', (file, oldPath) => this.onRename(file.path, oldPath)));
    plugin.registerEvent(app.vault.on('delete', (file) => this.onDelete(file.path)));
    app.workspace.onLayoutReady(() => {
      const here = this.here();
      if (here) this.footprints = addFootprint(this.footprints, here);
      this.refresh();
    });
  }

  get graph(): LinkGraph {
    const tags = this.plugin.settings.mapTags;
    if (!this.cachedGraph || this.graphTags !== tags) {
      this.graphTags = tags;
      this.cachedGraph = new LinkGraph(this.app.metadataCache.resolvedLinks, tags ? this.tags() : {});
    }
    return this.cachedGraph;
  }

  /** Теги всех заметок: из текста и из свойств (frontmatter). */
  private tags(): TagTable {
    const { vault, metadataCache } = this.app;
    const tags: TagTable = {};
    for (const file of vault.getMarkdownFiles()) {
      const cache = metadataCache.getFileCache(file);
      const list = cache ? getAllTags(cache) : null;
      if (list?.length) tags[file.path] = list;
    }
    return tags;
  }

  /** Включили или выключили связи по тегам: граф заново, маршрут — тоже. */
  settingsChanged(): void {
    if (this.plugin.settings.mapTags === this.graphTags) return;
    const here = this.here();
    if (this.route && here) {
      const steps = this.graph.route(here, this.route.target);
      this.route = { ...this.route, steps };
      this.routeStatus = steps ? null : 'lost';
    }
    this.refresh();
  }

  /** Открытая заметка (последняя, если сейчас в фокусе боковая панель). */
  here(): string | null {
    const file = this.app.workspace.getActiveFile();
    return file && file.extension === 'md' ? file.path : null;
  }

  get nextStep(): string | null {
    const steps = this.route?.steps;
    return steps && steps[0] === this.here() ? nextNote(steps) : null;
  }

  async reveal(): Promise<void> {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(MAP_VIEW)[0];
    if (!leaf) {
      const right = workspace.getRightLeaf(false);
      if (!right) return;
      await right.setViewState({ type: MAP_VIEW, active: true });
      leaf = right;
    }
    await workspace.revealLeaf(leaf);
  }

  /** «Шалость удалась»: карта стирается. */
  close(): void {
    this.app.workspace.detachLeavesOfType(MAP_VIEW);
  }

  open(path: string, evt?: MouseEvent | KeyboardEvent): void {
    if (isTag(path)) {
      this.searchTag(path);
      return;
    }
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return;
    void this.app.workspace.getLeaf(evt ? Keymap.isModEvent(evt) : false).openFile(file);
  }

  /** Тег на карте: все заметки с ним — в поиске Obsidian. API поиска не публичное. */
  searchTag(tag: string): void {
    const app = this.app as unknown as {
      internalPlugins?: { getPluginById?(id: string): { instance?: { openGlobalSearch?(query: string): void } } | null };
    };
    app.internalPlugins?.getPluginById?.('global-search')?.instance?.openGlobalSearch?.(`tag:${tag}`);
  }

  planRoute(): void {
    const here = this.here();
    if (!here) {
      new Notice(this.t('mapNoNote'));
      return;
    }
    new RouteModal(this.app, this.t, here, (file) => this.setRoute(here, file.path)).open();
  }

  setRoute(from: string, to: string): void {
    const steps = this.graph.route(from, to);
    if (!steps) {
      new Notice(this.t('mapNoPath', noteName(to)));
      return;
    }
    this.route = { target: to, steps };
    this.routeStatus = null;
    this.refresh();
    void this.reveal();
  }

  clearRoute(): void {
    this.route = null;
    this.routeStatus = null;
    this.refresh();
  }

  goNext(): void {
    const next = this.nextStep;
    if (next) this.open(next);
  }

  refresh(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(MAP_VIEW)) {
      if (leaf.view instanceof MaraudersMapView) leaf.view.render();
    }
  }

  private onFileOpen(file: TFile | null): void {
    if (!file || file.extension !== 'md') return;
    this.footprints = addFootprint(this.footprints, file.path);
    if (this.route) {
      const { route, status } = followRoute(this.graph, this.route, file.path);
      if (status === 'arrived') new Notice(this.t('mapArrived', noteName(this.route.target)));
      this.route = route;
      this.routeStatus = route ? status : null;
    }
    this.refresh();
  }

  private onRename(path: string, oldPath: string): void {
    const rename = (p: string) => (p === oldPath ? path : p);
    this.footprints = this.footprints.map(rename);
    if (this.route) this.route = { target: rename(this.route.target), steps: this.route.steps?.map(rename) ?? null };
    this.refresh();
  }

  private onDelete(path: string): void {
    this.footprints = this.footprints.filter((p) => p !== path);
    if (this.route?.target === path) this.route = null;
    this.refresh();
  }
}

/** Боковая панель с картой. */
export class MaraudersMapView extends ItemView implements HoverParent {
  hoverPopover: HoverPopover | null = null;
  /** Что нарисовано сейчас: карта перерисовывается, только если что-то поменялось. */
  private drawn = '';

  constructor(leaf: WorkspaceLeaf, private readonly map: MaraudersMap) {
    super(leaf);
  }

  getViewType(): string {
    return MAP_VIEW;
  }

  getDisplayText(): string {
    return this.map.t('mapTitle');
  }

  getIcon(): string {
    return 'footprints';
  }

  async onOpen(): Promise<void> {
    this.contentEl.addClass('hp-marauders');
    this.render();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
    this.drawn = '';
  }

  render(): void {
    const { map, contentEl } = this;
    const here = map.here();
    const route = map.route;
    const steps = here && route?.steps && route.steps[0] === here ? route.steps : [];
    const layout = here ? layoutMap(map.graph, here, steps) : null;
    const footprints = map.footprints.filter((p) => p !== here).slice(0, FOOTPRINTS_MAX - 4);
    const state = JSON.stringify([here, layout, route, map.routeStatus, footprints]);
    if (state === this.drawn) return;
    this.drawn = state;

    contentEl.empty();
    const { t } = map;
    const head = contentEl.createDiv({ cls: 'hp-marauders-head' });
    head.createDiv({ cls: 'hp-marauders-title', text: t('mapTitle') });
    head.createDiv({ cls: 'hp-marauders-motto', text: t('eggMap1') });

    if (!here || !layout) {
      contentEl.createEl('p', { cls: 'hp-marauders-empty', text: t('mapEmpty') });
      this.renderFootprints(footprints);
      return;
    }

    const parchment = contentEl.createDiv({ cls: 'hp-marauders-parchment' });
    this.renderMap(parchment, layout.nodes, steps, new Set(footprints), route?.target ?? null);
    if (layout.hidden > 0) parchment.createDiv({ cls: 'hp-marauders-hidden', text: t('mapHidden', layout.hidden) });
    if (layout.nodes.length === 1) contentEl.createEl('p', { cls: 'hp-marauders-empty', text: t('mapLonely') });
    else {
      const legend = contentEl.createDiv({ cls: 'hp-marauders-legend' });
      legend.createSpan({ cls: 'hp-legend-link', text: t('mapLegendLink') });
      legend.createSpan({ cls: 'hp-legend-backlink', text: t('mapLegendBacklink') });
      if (layout.nodes.some((n) => isTag(n.path))) legend.createSpan({ cls: 'hp-legend-tag', text: t('mapLegendTag') });
    }

    this.renderRoute(here);
    this.renderFootprints(footprints);
  }

  private renderMap(parent: HTMLElement, nodes: MapNode[], steps: string[], visited: Set<string>, target: string | null): void {
    const svg = svgEl(parent, 'svg', { viewBox: '-180 -176 360 352', class: 'hp-marauders-svg', role: 'group', 'aria-label': this.map.t('mapTitle') });
    const at = new Map(nodes.map((n) => [n.path, n]));
    const edges = svgEl(svg, 'g', { class: 'hp-map-edges' });
    const trail = svgEl(svg, 'g', { class: 'hp-map-steps', 'aria-hidden': 'true' });
    const dots = svgEl(svg, 'g', { class: 'hp-map-nodes' });
    const onRoute = (a: string, b: string) => steps.indexOf(b) === steps.indexOf(a) + 1 && steps.includes(a);

    for (const node of nodes) {
      const from = node.parent ? at.get(node.parent) : null;
      if (!from) continue;
      // Чуть изогнутые чернильные коридоры, как на настоящей карте
      const mx = (from.x + node.x) / 2 - (node.y - from.y) * 0.08;
      const my = (from.y + node.y) / 2 + (node.x - from.x) * 0.08;
      svgEl(edges, 'path', {
        d: `M${from.x} ${from.y}Q${round(mx)} ${round(my)} ${node.x} ${node.y}`,
        class: `hp-map-edge is-${node.passage}` + (onRoute(from.path, node.path) ? ' is-route' : '')
      });
    }

    // Следы по маршруту — сколько его видно на карте
    let i = 0;
    for (let s = 1; s < steps.length; s++) {
      const a = at.get(steps[s - 1]);
      const b = at.get(steps[s]);
      if (!a || !b) break;
      for (const f of footsteps(a, b)) {
        const foot = svgEl(trail, 'ellipse', { cx: f.x, cy: f.y, rx: 2.3, ry: 3.8, transform: `rotate(${f.angle} ${f.x} ${f.y})` });
        foot.style.setProperty('--i', String(i++));
      }
    }

    for (const node of nodes) this.renderNode(dots, node, steps, visited, target);
  }

  private renderNode(parent: SVGElement, node: MapNode, steps: string[], visited: Set<string>, target: string | null): void {
    const { t } = this.map;
    const name = noteName(node.path);
    const tag = isTag(node.path);
    const cls = ['hp-map-node', `ring-${node.ring}`];
    if (node.ring === 0) cls.push('is-here');
    if (tag) cls.push('is-tag');
    if (nextNote(steps) === node.path) cls.push('is-next');
    if (steps.includes(node.path) && node.ring > 0) cls.push('is-route');
    if (node.path === target) cls.push('is-target');
    if (visited.has(node.path)) cls.push('is-visited');
    if (RESTRICTED.test(node.path)) cls.push('is-restricted');
    const label = node.ring === 0 ? `${name} — ${t('mapHere')}` : tag ? `${name} — ${t('mapTagHint')}` : `${name}${passageHint(t, node.passage)}`;
    const g = svgEl(parent, 'g', {
      class: cls.join(' '),
      'data-path': node.path,
      transform: `translate(${node.x} ${node.y})`,
      tabindex: 0,
      role: 'link',
      'aria-label': label
    });
    svgEl(g, 'title').textContent = noteFolder(node.path) ? `${label}\n${noteFolder(node.path)}` : label;
    svgEl(g, 'circle', { class: 'hp-map-hit', r: node.ring === 2 ? 9 : 13 });
    const r = [9, 6.5, 4.5][node.ring];
    // Тег — ромбик, заметка — кружок
    if (tag) svgEl(g, 'path', { class: 'hp-map-dot', d: `M0 ${-r - 1.5}L${r + 1.5} 0L0 ${r + 1.5}L${-r - 1.5} 0Z` });
    else svgEl(g, 'circle', { class: 'hp-map-dot', r });

    const text = svgEl(g, 'text', { class: 'hp-map-label' });
    text.textContent = name.length > LABEL_MAX ? name.slice(0, LABEL_MAX - 1) + '…' : name;
    placeLabel(text, node);
    if (node.ring === 0) svgEl(g, 'text', { class: 'hp-map-here', y: 42, 'text-anchor': 'middle' }).textContent = t('mapHere');

    const go = (e: MouseEvent | KeyboardEvent) => {
      if (node.ring > 0) this.map.open(node.path, e);
    };
    g.addEventListener('click', go);
    g.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      go(e);
    });
    if (!tag) g.addEventListener('mouseover', (event) => {
      this.app.workspace.trigger('hover-link', {
        event, source: MAP_VIEW, hoverParent: this, targetEl: g, linktext: node.path, sourcePath: this.map.here() ?? ''
      });
    });
  }

  private renderRoute(here: string): void {
    const { map } = this;
    const { t } = map;
    const box = this.contentEl.createDiv({ cls: 'hp-marauders-route' });
    const route = map.route;
    if (!route) {
      box.createEl('button', { cls: 'mod-cta hp-map-plan', text: t('mapRouteButton') })
        .addEventListener('click', () => map.planRoute());
      return;
    }

    box.createDiv({ cls: 'hp-marauders-heading', text: t('mapRouteTitle', noteName(route.target)) });
    if (!route.steps) {
      box.createEl('p', { cls: 'hp-marauders-note', text: t('mapLost', noteName(route.target)) });
    } else {
      const steps = routeSteps(map.graph, route.steps);
      const note = map.routeStatus === 'rerouted' ? t('mapRerouted') : '';
      box.createEl('p', { cls: 'hp-marauders-note', text: [t('mapRouteSteps', steps.length - 1), note].filter(Boolean).join(' · ') });
      const list = box.createEl('ol', { cls: 'hp-marauders-steps' });
      steps.forEach(({ path, passage, tag }, i) => {
        const li = list.createEl('li', { cls: i === 0 ? 'is-here' : i === 1 ? 'is-next' : '' });
        const btn = li.createEl('button', { cls: 'hp-map-step', attr: { type: 'button', 'data-path': path } });
        btn.createSpan({ cls: 'hp-map-step-name', text: noteName(path) });
        const hint = i === 0 ? t('mapHere')
          : tag ? t('mapStepTag', tag)
          : t(passage === 'backlink' ? 'mapStepBacklink' : 'mapStepLink');
        btn.createSpan({ cls: 'hp-map-step-hint', text: hint });
        if (i > 0) btn.addEventListener('click', (e) => map.open(path, e));
        else btn.disabled = true;
      });
    }

    const actions = box.createDiv({ cls: 'hp-marauders-actions' });
    if (route.steps && route.steps[0] === here && nextNote(route.steps)) {
      actions.createEl('button', { cls: 'mod-cta hp-map-next', text: t('mapNext') }).addEventListener('click', () => map.goNext());
    }
    actions.createEl('button', { cls: 'hp-map-plan', text: t('mapRouteButton') }).addEventListener('click', () => map.planRoute());
    actions.createEl('button', { cls: 'hp-map-clear', text: t('mapClear') }).addEventListener('click', () => map.clearRoute());
  }

  private renderFootprints(footprints: string[]): void {
    if (!footprints.length) return;
    const box = this.contentEl.createDiv({ cls: 'hp-marauders-footprints' });
    box.createDiv({ cls: 'hp-marauders-heading', text: this.map.t('mapFootprints') });
    for (const path of footprints) {
      const btn = box.createEl('button', { cls: 'hp-map-footprint', text: noteName(path), attr: { type: 'button', 'data-path': path } });
      btn.addEventListener('click', (e) => this.map.open(path, e));
    }
  }
}

/** «Куда идём?» — выбор заметки, к которой проложить путь. */
class RouteModal extends FuzzySuggestModal<TFile> {
  constructor(app: App, t: Translate, private readonly here: string, private readonly onChoose: (file: TFile) => void) {
    super(app);
    this.setPlaceholder(t('mapRoutePlaceholder'));
  }

  getItems(): TFile[] {
    return this.app.vault.getMarkdownFiles().filter((f) => f.path !== this.here);
  }

  getItemText(file: TFile): string {
    return file.path.replace(/\.md$/, '');
  }

  onChooseItem(file: TFile): void {
    this.onChoose(file);
  }
}

function passageHint(t: Translate, passage: Passage | null): string {
  return passage === 'backlink' ? ` (${t('mapLegendBacklink')})` : '';
}

/** Подпись снаружи круга: сверху и снизу — по центру, сбоку — от точки наружу. */
function placeLabel(text: SVGTextElement, node: MapNode): void {
  if (node.ring === 0) {
    text.setAttribute('y', '27');
    text.setAttribute('text-anchor', 'middle');
    return;
  }
  const len = Math.hypot(node.x, node.y) || 1;
  const cos = node.x / len;
  const sin = node.y / len;
  if (Math.abs(cos) < 0.3) {
    text.setAttribute('y', String(sin < 0 ? -11 : 20));
    text.setAttribute('text-anchor', 'middle');
    return;
  }
  // Сбоку у второго круга снаружи мало места — подпись внутрь
  const right = node.ring === 2 ? cos < 0 : cos > 0;
  text.setAttribute('x', String(right ? 10 : -10));
  text.setAttribute('y', '5');
  text.setAttribute('text-anchor', right ? 'start' : 'end');
}

const round = (v: number) => Math.round(v * 10) / 10;

function svgEl<K extends keyof SVGElementTagNameMap>(parent: Element, tag: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  parent.appendChild(el);
  return el;
}
