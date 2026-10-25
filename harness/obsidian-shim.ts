/*
 * Минимальная заглушка API Obsidian для тестового стенда (harness/index.html).
 * Реализует ровно то, чем пользуется плагин, на обычном DOM.
 * Это НЕ Obsidian: стенд проверяет код плагина и CSS на похожей разметке.
 */

// ---------- Расширения HTMLElement, которые Obsidian добавляет глобально ----------

type DomInfo = { cls?: string | string[]; text?: string; attr?: Record<string, string> };

function applyInfo(el: HTMLElement, info?: DomInfo | string): HTMLElement {
  if (typeof info === 'string') info = { cls: info };
  if (!info) return el;
  if (info.cls) el.className = Array.isArray(info.cls) ? info.cls.join(' ') : info.cls;
  if (info.text !== undefined) el.textContent = info.text;
  for (const [k, v] of Object.entries(info.attr ?? {})) el.setAttribute(k, v);
  return el;
}

const proto = HTMLElement.prototype as any;
proto.createEl = function (tag: string, info?: DomInfo) { return this.appendChild(applyInfo(document.createElement(tag), info)); };
proto.createDiv = function (info?: DomInfo) { return this.createEl('div', typeof info === 'string' ? { cls: info } : info); };
proto.createSpan = function (info?: DomInfo) { return this.createEl('span', typeof info === 'string' ? { cls: info } : info); };
proto.empty = function () { this.replaceChildren(); };
proto.setText = function (t: string) { this.textContent = t; };
proto.addClass = function (...c: string[]) { this.classList.add(...c); };
proto.removeClass = function (...c: string[]) { this.classList.remove(...c); };
proto.toggleClass = function (c: string, on: boolean) { this.classList.toggle(c, on); };
proto.hide = function () { this.style.display = 'none'; };
proto.show = function () { this.style.display = ''; };
proto.isShown = function () { return this.style.display !== 'none'; };
proto.toggle = function (on: boolean) { this.style.display = on ? '' : 'none'; };
(window as any).activeDocument = document;

// ---------- События и компоненты ----------

class Events {
  private handlers = new Map<string, Set<(...a: unknown[]) => unknown>>();
  on(name: string, cb: (...a: unknown[]) => unknown) {
    if (!this.handlers.has(name)) this.handlers.set(name, new Set());
    this.handlers.get(name)!.add(cb);
    return { name, cb };
  }
  trigger(name: string, ...args: unknown[]) {
    for (const cb of this.handlers.get(name) ?? []) cb(...args);
  }
}

export class Component {
  private cleanups: (() => void)[] = [];
  registerEvent(_ref: unknown) {}
  registerDomEvent(el: EventTarget, type: string, cb: EventListener, options?: boolean | AddEventListenerOptions) {
    el.addEventListener(type, cb, options);
    this.cleanups.push(() => el.removeEventListener(type, cb, options));
  }
  register(cb: () => void) { this.cleanups.push(cb); }
  unload() { for (const c of this.cleanups.splice(0)) c(); }
}

const store: Record<string, unknown> = JSON.parse(localStorage.getItem('hp-harness-data') || '{}');

export class Plugin extends Component {
  settingTab: PluginSettingTab | null = null;
  registerView(type: string, creator: (leaf: WorkspaceLeaf) => ItemView) { this.app.workspace.viewCreators.set(type, creator); }
  registerHoverLinkSource(_id: string, _info: unknown) {}
  commands: Record<string, { id: string; name: string; callback: () => void }> = {};
  constructor(public app: any, public manifest: any) { super(); }
  async loadData() { return store[this.manifest.id] ?? null; }
  async saveData(data: unknown) {
    store[this.manifest.id] = JSON.parse(JSON.stringify(data));
    localStorage.setItem('hp-harness-data', JSON.stringify(store));
  }
  addSettingTab(tab: PluginSettingTab) { this.settingTab = tab; }
  addRibbonIcon(icon: string, title: string, cb: (e: MouseEvent) => void) {
    const el = document.querySelector('.side-dock-actions')!.createDiv({ cls: 'clickable-icon side-dock-ribbon-action', attr: { 'aria-label': title, 'data-icon': icon } });
    el.textContent = ({ wand: '✨', footprints: '👣' } as Record<string, string>)[icon] ?? '•';
    el.addEventListener('click', cb);
    return el;
  }
  addStatusBarItem() { return document.querySelector('.status-bar')!.createDiv({ cls: 'status-bar-item' }); }
  addCommand(cmd: { id: string; name: string; callback?: () => void; checkCallback?: (checking: boolean) => boolean | void }) {
    const run = cmd.callback ?? (() => cmd.checkCallback?.(false));
    this.commands[cmd.id] = { ...cmd, callback: run };
    return cmd;
  }
}

// ---------- Файлы, панели ----------

export class TFile {
  basename: string;
  extension: string;
  name: string;
  constructor(public path: string) {
    this.name = path.slice(path.lastIndexOf('/') + 1);
    this.extension = this.name.slice(this.name.lastIndexOf('.') + 1);
    this.basename = this.name.slice(0, -this.extension.length - 1);
  }
}

export class Keymap {
  static isModEvent(e?: MouseEvent | KeyboardEvent | null) { return !!e && (e.ctrlKey || e.metaKey) ? 'tab' : false; }
}

export class ItemView extends Component {
  app: any;
  containerEl: HTMLElement;
  contentEl: HTMLElement;
  constructor(public leaf: WorkspaceLeaf) {
    super();
    this.app = leaf.app;
    this.containerEl = document.createElement('div');
    this.containerEl.className = 'workspace-leaf-content';
    this.contentEl = (this.containerEl as any).createDiv({ cls: 'view-content' });
  }
  getViewType() { return ''; }
  getDisplayText() { return ''; }
  getIcon() { return ''; }
  async onOpen() {}
  async onClose() {}
}

/** Панель: в главной области открывает файлы, в правой боковой — показывает вид плагина. */
export class WorkspaceLeaf {
  view: ItemView | null = null;
  constructor(public app: any) {}
  async setViewState(state: { type: string }) {
    const creator = this.app.workspace.viewCreators.get(state.type);
    this.view = creator(this);
    this.view!.containerEl.dataset.type = state.type;
    const host = document.querySelector('.mod-right-split') as HTMLElement;
    host.appendChild(this.view!.containerEl);
    host.style.display = '';
    this.app.workspace.leaves.push(this);
    await this.view!.onOpen();
  }
  async openFile(file: TFile) { this.app.workspace.setActiveFile(file); }
  detach() {
    const ws = this.app.workspace;
    ws.leaves = ws.leaves.filter((l: WorkspaceLeaf) => l !== this);
    void this.view?.onClose();
    this.view?.containerEl.remove();
    if (!ws.leaves.length) (document.querySelector('.mod-right-split') as HTMLElement).style.display = 'none';
  }
}

export class PluginSettingTab {
  containerEl = document.createElement('div');
  constructor(public app: any, public plugin: Plugin) { this.containerEl.className = 'vertical-tab-content'; }
  display() {}
}

export class Setting {
  settingEl: HTMLElement;
  infoEl: HTMLElement;
  nameEl: HTMLElement;
  descEl: HTMLElement;
  controlEl: HTMLElement;
  constructor(container: HTMLElement) {
    this.settingEl = (container as any).createDiv({ cls: 'setting-item' });
    this.infoEl = (this.settingEl as any).createDiv({ cls: 'setting-item-info' });
    this.nameEl = (this.infoEl as any).createDiv({ cls: 'setting-item-name' });
    this.descEl = (this.infoEl as any).createDiv({ cls: 'setting-item-description' });
    this.controlEl = (this.settingEl as any).createDiv({ cls: 'setting-item-control' });
  }
  private get control() { return this.controlEl; }
  setName(name: string) { this.nameEl.prepend(name); return this; }
  setDesc(desc: string) { this.descEl.textContent = desc; return this; }
  addToggle(cb: (t: any) => void) {
    const el = (this.control as any).createDiv({ cls: 'checkbox-container' });
    let handler: (v: boolean) => void = () => {};
    const api = {
      setValue(v: boolean) { el.classList.toggle('is-enabled', v); return api; },
      onChange(h: (v: boolean) => void) { handler = h; return api; }
    };
    el.addEventListener('click', () => { const v = !el.classList.contains('is-enabled'); api.setValue(v); handler(v); });
    cb(api);
    return this;
  }
  addDropdown(cb: (d: any) => void) {
    const el = (this.control as any).createEl('select', { cls: 'dropdown' }) as HTMLSelectElement;
    let handler: (v: string) => void = () => {};
    const api = {
      selectEl: el,
      addOption(value: string, text: string) { el.createEl('option', { text, attr: { value } }); return api; },
      setValue(v: string) { el.value = v; return api; },
      getValue() { return el.value; },
      onChange(h: (v: string) => void) { handler = h; return api; }
    };
    el.addEventListener('change', () => handler(el.value));
    cb(api);
    return this;
  }
  addSlider(cb: (s: any) => void) {
    const el = (this.control as any).createEl('input', { cls: 'slider', attr: { type: 'range' } }) as HTMLInputElement;
    let handler: (v: number) => void = () => {};
    const api = {
      sliderEl: el,
      setLimits(min: number, max: number, step: number) { el.min = String(min); el.max = String(max); el.step = String(step); return api; },
      setValue(v: number) { el.value = String(v); return api; },
      getValue() { return Number(el.value); },
      setDynamicTooltip() { return api; },
      onChange(h: (v: number) => void) { handler = h; return api; }
    };
    el.addEventListener('input', () => handler(Number(el.value)));
    cb(api);
    return this;
  }
  addButton(cb: (b: any) => void) {
    const el = (this.control as any).createEl('button');
    const api = {
      setButtonText(t: string) { el.textContent = t; return api; },
      setCta() { el.classList.add('mod-cta'); return api; },
      onClick(h: () => void) { el.addEventListener('click', h); return api; }
    };
    cb(api);
    return this;
  }
}

export class Modal {
  containerEl = document.createElement('div');
  modalEl: HTMLElement;
  titleEl: HTMLElement;
  contentEl: HTMLElement;
  constructor(public app: any) {
    this.containerEl.className = 'modal-container mod-dim';
    (this.containerEl as any).createDiv({ cls: 'modal-bg' }).addEventListener('click', () => this.close());
    this.modalEl = (this.containerEl as any).createDiv({ cls: 'modal' });
    this.titleEl = (this.modalEl as any).createDiv({ cls: 'modal-title' });
    this.contentEl = (this.modalEl as any).createDiv({ cls: 'modal-content' });
  }
  open() { document.body.appendChild(this.containerEl); this.onOpen(); }
  close() { this.onClose(); this.containerEl.remove(); }
  onOpen() {}
  onClose() {}
}

export class FuzzySuggestModal<T> extends Modal {
  setPlaceholder(_p: string) {}
  getItems(): T[] { return []; }
  getItemText(_i: T): string { return ''; }
  renderSuggestion(m: { item: T }, el: HTMLElement) { el.textContent = this.getItemText(m.item); }
  onChooseItem(_i: T) {}
  onOpen() {
    for (const item of this.getItems()) {
      const el = (this.contentEl as any).createDiv({ cls: 'suggestion-item' });
      this.renderSuggestion({ item }, el);
      el.addEventListener('click', () => { this.close(); this.onChooseItem(item); });
    }
  }
}

export class Notice {
  constructor(message: string, timeout = 4000) {
    let box = document.querySelector('.notice-container');
    if (!box) box = (document.body as any).createDiv({ cls: 'notice-container' });
    const el = (box as any).createDiv({ cls: 'notice', text: message });
    setTimeout(() => el.remove(), timeout);
  }
}

export class Menu {
  private el = document.createElement('div');
  constructor() { this.el.className = 'menu'; }
  addItem(cb: (item: any) => void) {
    const row = (this.el as any).createDiv({ cls: 'menu-item' });
    const iconEl = row.createDiv({ cls: 'menu-item-icon' });
    const title = row.createDiv({ cls: 'menu-item-title' });
    const item = {
      iconEl,
      setTitle(t: string) { title.textContent = t; return item; },
      setIcon(_i: string) { return item; },
      setChecked(c: boolean) { row.classList.toggle('mod-checked', c); return item; },
      onClick: (h: () => void) => { row.addEventListener('click', () => { this.hide(); h(); }); return item; }
    };
    cb(item);
    return this;
  }
  addSeparator() { (this.el as any).createDiv({ cls: 'menu-separator' }); return this; }
  showAtMouseEvent(e: MouseEvent) {
    this.el.style.left = `${e.clientX}px`;
    this.el.style.top = `${Math.max(8, e.clientY - 260)}px`;
    document.body.appendChild(this.el);
    setTimeout(() => document.addEventListener('click', () => this.hide(), { once: true }), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      document.removeEventListener('keydown', onKey);
      this.hide();
    };
    document.addEventListener('keydown', onKey);
  }
  hide() { this.el.remove(); }
}

export function setIcon(_el: HTMLElement, _icon: string) {}
export function getAllTags(cache: { tags?: { tag: string }[] }) { return cache.tags?.map((t) => t.tag) ?? null; }
export function getLanguage() { return new URLSearchParams(location.search).get('lang') || 'en'; }

// ---------- app ----------

/** Хранилище стенда: заметки и ссылки между ними (как metadataCache.resolvedLinks). */
const VAULT: Record<string, string[]> = {
  'Хогвартс/Зельеварение.md': ['Люди/Северус Снегг.md', 'Хогвартс/Расписание.md', 'Ингредиенты/Безоар.md'],
  'Хогвартс/Расписание.md': ['Хогвартс/Квиддич.md', 'Хогвартс/Зельеварение.md', 'Хогвартс/Трансфигурация.md'],
  'Хогвартс/Квиддич.md': ['Хогвартс/Расписание.md', 'Люди/Гарри Поттер.md'],
  'Хогвартс/Трансфигурация.md': [],
  'Хогвартс/Библиотека.md': ['Запретная секция/Тайны крестражей.md'],
  'Люди/Северус Снегг.md': ['Люди/Лили Поттер.md'],
  'Люди/Гарри Поттер.md': ['Люди/Рон Уизли.md', 'Люди/Гермиона Грейнджер.md', 'Люди/Лили Поттер.md'],
  'Люди/Рон Уизли.md': ['Хогвартс/Квиддич.md'],
  'Люди/Гермиона Грейнджер.md': ['Хогвартс/Библиотека.md', 'Ингредиенты/Безоар.md'],
  'Люди/Лили Поттер.md': [],
  'Ингредиенты/Безоар.md': [],
  'Запретная секция/Тайны крестражей.md': [],
  'Дневник/31 июля.md': ['Люди/Гарри Поттер.md'],
  'Дневник/Заметки на полях.md': [],
  'Дневник/Сны.md': []
};

/** Теги заметок стенда (как getAllTags). */
const TAGS: Record<string, string[]> = {
  'Хогвартс/Зельеварение.md': ['#домашка', '#зелья'],
  'Хогвартс/Трансфигурация.md': ['#домашка'],
  'Ингредиенты/Безоар.md': ['#Зелья'],
  'Дневник/Сны.md': ['#домашка']
};

export function createApp() {
  const files = new Map(Object.keys(VAULT).map((p) => [p, new TFile(p)]));
  const workspace = new Events() as any;
  workspace.onLayoutReady = (cb: () => void) => setTimeout(cb, 0);
  workspace.viewCreators = new Map();
  workspace.leaves = [] as WorkspaceLeaf[];
  workspace.activeFile = files.get('Хогвартс/Зельеварение.md');
  workspace.getActiveFile = () => workspace.activeFile;
  workspace.setActiveFile = (file: TFile) => {
    workspace.activeFile = file;
    for (const el of document.querySelectorAll('#inline-title, .mod-root .workspace-tabs:first-child .workspace-tab-header.is-active .workspace-tab-header-inner')) {
      el.textContent = file.basename;
    }
    workspace.trigger('file-open', file);
  };
  workspace.getLeavesOfType = (type: string) => workspace.leaves.filter((l: WorkspaceLeaf) => l.view?.getViewType() === type);
  workspace.getRightLeaf = () => new WorkspaceLeaf(app);
  workspace.getLeaf = () => new WorkspaceLeaf(app);
  workspace.revealLeaf = async () => {};
  workspace.detachLeavesOfType = (type: string) => { for (const l of workspace.getLeavesOfType(type)) l.detach(); };
  const vault = new Events() as any;
  Object.assign(vault, {
    config: {} as Record<string, string>,
    setConfig(k: string, v: string) { this.config[k] = v; },
    getMarkdownFiles: () => [...files.values()],
    getAbstractFileByPath: (p: string) => files.get(p) ?? null
  });
  const metadataCache = new Events() as any;
  metadataCache.getFileCache = (file: TFile) => ({ tags: (TAGS[file.path] ?? []).map((tag) => ({ tag })) });
  metadataCache.resolvedLinks = Object.fromEntries(Object.entries(VAULT).map(([from, to]) => [from, Object.fromEntries(to.map((p) => [p, 1]))]));
  const app = {
    workspace,
    vault,
    metadataCache,
    setTheme(theme: string) {
      document.body.classList.toggle('theme-dark', theme === 'obsidian');
      document.body.classList.toggle('theme-light', theme === 'moonstone');
      workspace.trigger('css-change');
    },
    setting: { open() { (window as any).harness.openSettings(); }, openTabById() {} },
    /** Поиск Obsidian: стенд только запоминает запрос. */
    lastSearch: '',
    internalPlugins: {
      getPluginById: (id: string) => id === 'global-search' ? { instance: { openGlobalSearch: (q: string) => { app.lastSearch = q; } } } : null
    }
  };
  return app;
}
