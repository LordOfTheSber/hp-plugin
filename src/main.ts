/*
 * HP Theme — плагин Obsidian: оформление в стиле факультетов Хогвартса.
 * Цвета и шрифты — в styles.css (генерируется из src/houses.ts и src/styles/theme.css),
 * плагин переключает классы на <body>, добавляет команды, меню и пасхалки.
 */
import { Menu, Notice, Plugin, TFile, moment } from 'obsidian';
import type { CachedMetadata, Editor, WorkspaceWindow } from 'obsidian';
import * as obsidian from 'obsidian';
import { HOUSE_IDS } from './houses.ts';
import type { HouseId, Mode } from './houses.ts';
import { crestSvg, svgElement } from './crest.ts';
import { restrictedCss } from './css.ts';
import { createTranslator } from './i18n.ts';
import type { Translate } from './i18n.ts';
import { createSpellbook, parseIncantation } from './spells.ts';
import type { SpellId } from './spells.ts';
import { Effects } from './effects.ts';
import { eventDocument, isEditable } from './dom.ts';
import { GestureInput } from './gesture-input.ts';
import type { Point } from './gestures.ts';
import { MaraudersMap } from './marauders.ts';
import { inFolder, noteName } from './map.ts';
import { daysSince, pickPensieve, timeTurner, yearAgo } from './memories.ts';
import type { NoteStat } from './memories.ts';
import { cloakCallout, toggleCloak } from './cloak.ts';
import { DAILY_POINTS, TASK_POINTS, countDoneTasks, isDailyNote, newlyDone } from './work.ts';
import { HouseSuggestModal, NoteSuggestModal, SortingHatModal, WandModal, WandShopModal } from './modals.ts';
import { CORES, wandCursorCss } from './wands.ts';
import type { WandSpec } from './wands.ts';
import { DEFAULT_SETTINGS, HpSettingTab, migrateSettings } from './settings.ts';
import type { HpSettings } from './settings.ts';

const SNITCH_POINTS = 150;
const SAVE_DELAY = 400;
/** Заметка моложе минуты — новая: закрытые в ней задачи считаются, хотя рекорда у неё ещё нет. */
const NEW_NOTE_MS = 60 * 1000;
const RESTRICTED_STYLE_ID = 'hp-restricted-css';

function detectLanguage(): string {
  const getLanguage = (obsidian as { getLanguage?: () => string }).getLanguage;
  if (typeof getLanguage === 'function') return getLanguage();
  return window.localStorage.getItem('language') || 'en';
}

export default class HpThemePlugin extends Plugin {
  settings: HpSettings = { ...DEFAULT_SETTINGS };
  t: Translate = createTranslator('en');
  /** «Шалость удалась»: тема выключена до клятвы или перезапуска. */
  paused = false;

  map!: MaraudersMap;
  private effects!: Effects;
  private gestures!: GestureInput;
  private saveTimer = 0;
  private saveDue = 0;
  private statusEl: HTMLElement | null = null;
  private bodies = new Set<HTMLElement>();
  private spellbook = createSpellbook();
  private reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  /**
   * Светлая или тёмная тема — как выбрано в Obsidian. Плагин может временно её подменить
   * («Люмос», «Нокс») или держать пергамент / гостиную всегда (настройка), но настройку Obsidian не трогает.
   */
  private nativeDark = document.body.classList.contains('theme-dark');
  /** Что плагин поставил на <body> сам: чужие изменения классов темы — это Obsidian. */
  private appliedDark: boolean | null = null;
  /** «Люмос» и «Нокс» до перезапуска, смены темы в Obsidian или настройки режима. */
  private spellMode: Mode | null = null;
  /** Рекорд закрытых задач по заметкам: очки только за новые. */
  private taskBest = new Map<string, number>();

  async onload(): Promise<void> {
    this.t = createTranslator(detectLanguage());
    await this.loadSettings();
    this.effects = new Effects(() => this.reducedMotionQuery.matches);
    this.gestures = new GestureInput({
      enabled: () => this.settings.easterEggs && this.settings.gestures,
      colors: () => CORES[this.settings.wand.core],
      cast: (spell, at, doc) => this.cast(spell, at, doc)
    }, this.effects);

    this.bodies.add(document.body);
    this.watchWindow(window);
    this.watchNativeTheme();
    this.registerEvent(this.app.workspace.on('window-open', (win: WorkspaceWindow, view: Window) => {
      this.bodies.add(win.doc.body);
      this.watchWindow(view ?? win.win);
      this.applyTheme();
    }));
    this.registerEvent(this.app.workspace.on('window-close', (win: WorkspaceWindow) => {
      this.bodies.delete(win.doc.body);
      this.effects.forget(win.doc);
    }));

    this.addSettingTab(new HpSettingTab(this.app, this));
    this.addRibbonIcon('wand', this.t('ribbonTitle'), (evt) => this.openHouseMenu(evt));
    this.map = new MaraudersMap(this);
    this.map.load();
    this.statusEl = this.addStatusBarItem();
    this.statusEl.addClass('hp-status', 'mod-clickable');
    this.registerDomEvent(this.statusEl, 'click', (evt) => this.openHouseMenu(evt));

    this.addCommand({
      id: 'choose-house',
      name: this.t('commandChooseHouse'),
      callback: () => new HouseSuggestModal(this.app, this.t, (h) => void this.setHouse(h)).open()
    });
    this.addCommand({ id: 'sorting-hat', name: this.t('commandSortingHat'), callback: () => this.openSortingHat() });
    this.addCommand({ id: 'wave-wand', name: this.t('commandWand'), callback: () => this.openWand() });
    this.addCommand({ id: 'wand-shop', name: this.t('commandWandShop'), callback: () => this.openWandShop() });
    this.addCommand({ id: 'pensieve', name: this.t('commandPensieve'), callback: () => this.openPensieve() });
    this.addCommand({ id: 'time-turner', name: this.t('commandTimeTurner'), callback: () => this.openTimeTurner() });
    this.addCommand({ id: 'cloak', name: this.t('commandCloak'), editorCallback: (editor) => this.cloak(editor) });
    this.addCommand({
      id: 'toggle-theme',
      name: this.t('commandToggle'),
      callback: () => {
        this.paused = !this.paused;
        this.applyTheme();
      }
    });

    this.registerEvent(this.app.metadataCache.on('changed', (file, _data, cache) => this.onNoteChanged(file, cache)));
    this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
      const best = this.taskBest.get(oldPath);
      this.taskBest.delete(oldPath);
      if (best !== undefined) this.taskBest.set(file.path, best);
    }));
    this.registerEvent(this.app.vault.on('delete', (file) => this.taskBest.delete(file.path)));

    this.applyTheme();
    this.app.workspace.onLayoutReady(() => {
      this.rememberTasks();
      void this.birthday();
    });
  }

  onunload(): void {
    if (this.saveTimer) {
      window.clearTimeout(this.saveTimer);
      void this.saveData(this.settings);
    }
    this.gestures?.cancel();
    this.effects?.destroy();
    let changed = false;
    for (const body of this.bodies) {
      this.setBodyClasses(body, false);
      body.style.removeProperty('--hp-wand-cursor');
      body.ownerDocument.getElementById(RESTRICTED_STYLE_ID)?.remove();
      // Светлая или тёмная — снова как выбрано в Obsidian
      if (body.classList.contains('theme-dark') !== this.nativeDark) {
        body.classList.toggle('theme-dark', this.nativeDark);
        body.classList.toggle('theme-light', !this.nativeDark);
        changed = true;
      }
    }
    if (changed) this.app.workspace.trigger('css-change');
  }

  /** Заклинания с клавиатуры и жесты — в каждом окне Obsidian, а не только в главном. */
  private watchWindow(view: Window): void {
    this.registerDomEvent(view, 'keydown', (e) => this.onKeydown(e), true);
    this.registerDomEvent(view, 'pointermove', (e) => {
      this.effects.trackPointer(e);
      this.gestures.pointerMove(e);
    }, { passive: true });
    this.registerDomEvent(view, 'pointerdown', (e) => this.gestures.pointerDown(e), true);
    this.registerDomEvent(view, 'pointerup', (e) => this.gestures.pointerUp(e), true);
    this.registerDomEvent(view, 'pointercancel', () => this.gestures.cancel(), true);
    this.registerDomEvent(view, 'contextmenu', (e) => this.gestures.contextMenu(e), true);
  }

  // ---------- Настройки ----------

  async loadSettings(): Promise<void> {
    this.settings = migrateSettings(await this.loadData());
  }

  async saveSettings(): Promise<void> {
    window.clearTimeout(this.saveTimer);
    this.saveTimer = 0;
    await this.saveData(this.settings);
    this.applyTheme();
    this.map?.settingsChanged();
  }

  /** Сохранить чуть позже: палочку крутят ползунком, следы на карте меняются на каждом шаге. */
  saveSoon(delay = SAVE_DELAY): void {
    // Уже назначенное более раннее сохранение не откладываем
    const due = Date.now() + delay;
    if (this.saveTimer && this.saveDue <= due) return;
    window.clearTimeout(this.saveTimer);
    this.saveDue = due;
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = 0;
      void this.saveData(this.settings);
    }, delay);
  }

  /** Палочка меняется сразу, а сохраняется с задержкой. */
  setWand(wand: WandSpec): void {
    this.settings.wand = wand;
    this.applyTheme();
    this.saveSoon();
  }

  async setHouse(house: HouseId): Promise<void> {
    this.settings.house = house;
    await this.saveSettings();
  }

  /** Пергамент, гостиная или по теме Obsidian. Временный «Люмос» или «Нокс» при этом забывается. */
  async setMode(mode: HpSettings['mode']): Promise<void> {
    this.settings.mode = mode;
    this.spellMode = null;
    await this.saveSettings();
  }

  async resetPoints(): Promise<void> {
    this.settings.points = { ...DEFAULT_SETTINGS.points };
    this.settings.snitches = 0;
    await this.saveSettings();
  }

  // ---------- Тема ----------

  applyTheme(): void {
    const cursor = wandCursorCss(this.settings.wand);
    const css = restrictedCss(this.settings.restrictedFolders);
    for (const body of this.bodies) {
      this.setBodyClasses(body, !this.paused);
      if (this.settings.wandCursor && !this.paused) body.style.setProperty('--hp-wand-cursor', cursor);
      else body.style.removeProperty('--hp-wand-cursor');
      this.setRestrictedCss(body.ownerDocument, css);
    }
    this.applyBaseMode();
    this.updateStatus();
  }

  private setBodyClasses(body: HTMLElement, on: boolean): void {
    const s = this.settings;
    body.classList.toggle('hp-theme', on);
    for (const id of HOUSE_IDS) body.classList.toggle(`hp-house-${id}`, on && s.house === id);
    body.classList.toggle('hp-font-text', on && s.readableFont);
    body.classList.toggle('hp-font-headings', on && s.headingFont);
    body.classList.toggle('hp-ornaments', on && s.ornaments);
    body.classList.toggle('hp-wand', on && s.wandCursor);
  }

  /** Свои «Запретные секции» в проводнике: селекторы зависят от настроек. */
  private setRestrictedCss(doc: Document, css: string): void {
    let style = doc.getElementById(RESTRICTED_STYLE_ID);
    if (!css) {
      style?.remove();
      return;
    }
    if (!style) {
      style = doc.createElement('style');
      style.id = RESTRICTED_STYLE_ID;
      doc.head.appendChild(style);
    }
    if (style.textContent !== css) style.textContent = css;
  }

  private wantDark(): boolean {
    if (this.paused) return this.nativeDark;
    const mode = this.spellMode ?? (this.settings.mode === 'auto' ? null : this.settings.mode);
    return mode ? mode === 'common' : this.nativeDark;
  }

  /** Классы светлой и тёмной темы на <body> всех окон — как нужно сейчас (без записи в настройки Obsidian). */
  private applyBaseMode(): void {
    const dark = this.wantDark();
    this.appliedDark = dark;
    let changed = false;
    for (const body of this.bodies) {
      if (body.classList.contains('theme-dark') === dark && body.classList.contains('theme-light') !== dark) continue;
      body.classList.toggle('theme-dark', dark);
      body.classList.toggle('theme-light', !dark);
      changed = true;
    }
    // Графу, Mermaid и другим плагинам нужно знать, что цвета поменялись
    if (changed) this.app.workspace.trigger('css-change');
  }

  /** Тему поменяли в Obsidian (настройки, «как в системе»): запомнить выбор и снова применить свой режим. */
  private watchNativeTheme(): void {
    const body = document.body;
    const observer = new MutationObserver(() => {
      const dark = body.classList.contains('theme-dark');
      if (dark === this.appliedDark || (!dark && !body.classList.contains('theme-light'))) return;
      this.nativeDark = dark;
      this.spellMode = null;
      this.applyBaseMode();
    });
    observer.observe(body, { attributes: true, attributeFilter: ['class'] });
    this.register(() => observer.disconnect());
  }

  private updateStatus(): void {
    const el = this.statusEl;
    if (!el) return;
    const s = this.settings;
    el.toggle(s.statusBar && !this.paused);
    el.setText(`⚡ ${this.t(`house_${s.house}`)} · ${s.points[s.house] ?? 0}`);
    el.setAttribute('aria-label', this.t('statusTitle', s.snitches));
  }

  private isDark(): boolean {
    return document.body.classList.contains('theme-dark');
  }

  // ---------- Меню, Шляпа, палочка ----------

  openHouseMenu(evt: MouseEvent): void {
    const menu = new Menu();
    for (const id of HOUSE_IDS) {
      menu.addItem((item) => {
        item.setTitle(this.t(`house_${id}`))
          .setIcon('shield')
          .setChecked(id === this.settings.house)
          .onClick(() => void this.setHouse(id));
        // Мини-герб вместо иконки
        const dom = (item as unknown as { iconEl?: HTMLElement }).iconEl;
        if (dom) {
          dom.empty();
          dom.appendChild(svgElement(crestSvg(id, 16)));
        }
      });
    }
    menu.addSeparator();
    menu.addItem((item) => item.setTitle(this.t('shopTitle')).setIcon('wand').onClick(() => this.openWandShop()));
    menu.addItem((item) => item.setTitle(this.t('mapTitle')).setIcon('footprints').onClick(() => void this.map.reveal()));
    menu.addItem((item) => item.setTitle(this.t('pensieveTitle')).setIcon('droplets').onClick(() => this.openPensieve()));
    menu.addItem((item) => item.setTitle(this.t('timeTurnerTitle')).setIcon('hourglass').onClick(() => this.openTimeTurner()));
    menu.addItem((item) => item.setTitle(this.t('commandSortingHat')).setIcon('graduation-cap').onClick(() => this.openSortingHat()));
    menu.addItem((item) => item.setTitle(this.t('menuSettings')).setIcon('settings').onClick(() => this.openSettings()));
    menu.showAtMouseEvent(evt);
  }

  openSortingHat(after?: () => void): void {
    new SortingHatModal(this.app, this.t, this.isDark(), (house) => {
      void this.setHouse(house).then(() => after?.());
    }).open();
  }

  openWandShop(after?: () => void): void {
    new WandShopModal(this.app, this.t, {
      wand: this.settings.wand,
      cursor: this.settings.wandCursor,
      onChange: (wand) => this.setWand(wand),
      onCursor: (enabled) => {
        this.settings.wandCursor = enabled;
        void this.saveSettings();
      },
      onClosed: after
    }).open();
  }

  openWand(): void {
    new WandModal(this.app, this.t, this.settings.gestures, (phrase) => {
      if (!this.settings.easterEggs) {
        new Notice(this.t('wandOff'));
        return;
      }
      const spell = parseIncantation(phrase);
      if (spell) this.cast(spell);
      else new Notice(this.t('wandFail'));
    }).open();
  }

  private openSettings(): void {
    const setting = (this.app as unknown as { setting?: { open(): void; openTabById(id: string): void } }).setting;
    setting?.open();
    setting?.openTabById(this.manifest.id);
  }

  // ---------- Омут памяти, Маховик времени, Мантия-невидимка ----------

  /** Заметки хранилища без исключённых с карты папок (шаблоны, архив). */
  private noteStats(): NoteStat[] {
    return this.app.vault.getMarkdownFiles()
      .filter((f) => !inFolder(f.path, this.settings.mapExclude))
      .map((f) => ({ path: f.path, ctime: f.stat.ctime, mtime: f.stat.mtime }));
  }

  private openNote(path: string): void {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) void this.app.workspace.getLeaf(false).openFile(file);
  }

  /** «Омут памяти»: случайная заметка, которую давно не открывали для правки. */
  openPensieve(): void {
    const here = this.app.workspace.getActiveFile()?.path;
    const now = Date.now();
    const note = pickPensieve(this.noteStats().filter((n) => n.path !== here), now);
    if (!note) {
      new Notice(this.t('pensieveEmpty'));
      return;
    }
    this.openNote(note.path);
    new Notice(this.t('pensieveNotice', noteName(note.path), daysSince(note.mtime, now)));
  }

  /** «Маховик времени»: что было записано ровно год назад. */
  openTimeTurner(): void {
    const day = yearAgo(new Date());
    const notes = timeTurner(this.noteStats(), day, moment(day).format(this.dailyFormat()));
    const date = day.toLocaleDateString(this.t('locale'), { day: 'numeric', month: 'long', year: 'numeric' });
    if (!notes.length) {
      new Notice(this.t('timeTurnerEmpty', date));
      return;
    }
    if (notes.length === 1) {
      this.openNote(notes[0].path);
      new Notice(this.t('timeTurnerNotice', date));
      return;
    }
    new NoteSuggestModal(this.app, this.t('timeTurnerPlaceholder', date), notes.map((n) => n.path), (path) => this.openNote(path)).open();
  }

  /** «Мантия-невидимка»: выделенное — под мантию (или из-под неё), без выделения — коллаут-мантия. */
  private cloak(editor: Editor): void {
    const selection = editor.getSelection();
    if (selection) editor.replaceSelection(toggleCloak(selection));
    else editor.replaceSelection(cloakCallout(this.t('cloakTitle')));
  }

  // ---------- Очки за работу ----------

  /** Формат имени ежедневной заметки из настроек дневника Obsidian (API не публичное). */
  private dailyFormat(): string {
    const app = this.app as unknown as {
      internalPlugins?: { getPluginById?(id: string): { instance?: { options?: { format?: string } } } | null };
    };
    return app.internalPlugins?.getPluginById?.('daily-notes')?.instance?.options?.format || 'YYYY-MM-DD';
  }

  /** Сколько задач уже закрыто в каждой заметке: за них очков не дают. */
  private rememberTasks(): void {
    for (const file of this.app.vault.getMarkdownFiles()) {
      const cache = this.app.metadataCache.getFileCache(file);
      if (cache) this.taskBest.set(file.path, countDoneTasks(cache.listItems));
    }
  }

  private onNoteChanged(file: TFile, cache: CachedMetadata): void {
    // Рекорд обновляется и при выключенных очках: иначе, включив их, получишь очки за старое
    let best = this.taskBest.get(file.path);
    if (best === undefined && Date.now() - file.stat.ctime < NEW_NOTE_MS) best = 0;
    const { award, best: record } = newlyDone(best, countDoneTasks(cache.listItems));
    this.taskBest.set(file.path, record);
    if (!this.settings.workPoints || this.paused) return;
    // Очки — за то, что сделано здесь и сейчас, а не за то, что пришло синхронизацией
    if (this.app.workspace.getActiveFile()?.path !== file.path) return;
    if (award > 0) this.addPoints(award * TASK_POINTS);

    const today = moment().format('YYYY-MM-DD');
    if (this.settings.dailyAwarded !== today && isDailyNote(file.path, moment().format(this.dailyFormat()))) {
      this.settings.dailyAwarded = today;
      this.addPoints(DAILY_POINTS, this.t('pointsDaily', DAILY_POINTS, this.t(`house_${this.settings.house}`)));
    }
  }

  private addPoints(points: number, message?: string): void {
    const house = this.settings.house;
    this.settings.points[house] = (this.settings.points[house] ?? 0) + points;
    this.saveSoon();
    this.updateStatus();
    if (this.statusEl?.isShown()) this.effects.floatText(this.statusEl, `+${points}`);
    if (message) new Notice(message);
  }

  // ---------- Пасхалки ----------

  private onKeydown(e: KeyboardEvent): void {
    if (!this.settings.easterEggs || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const target = (e.composedPath()[0] ?? e.target) as HTMLElement | null;
    if (isEditable(target)) return;
    const spell = this.spellbook.push(e.key);
    if (spell) this.cast(spell, undefined, eventDocument(e));
  }

  /** at — где начат жест палочкой (для «Вингардиум Левиосы»), иначе — где курсор. doc — окно, где колдуют. */
  cast(spell: SpellId, at?: Point, doc: Document = activeDocument): void {
    if (this.paused && spell !== 'solemnlySwear') return;
    switch (spell) {
      case 'wingardiumLeviosa': {
        const p = at ?? this.effects.pointerIn(doc);
        this.effects.levitate(doc, p.x, p.y);
        new Notice(this.t('eggLeviosa'));
        break;
      }
      case 'lumos':
        this.effects.lumos(doc);
        this.spellMode = 'parchment';
        this.applyBaseMode();
        new Notice(this.t('eggLumos'));
        break;
      case 'nox':
        this.effects.nox(doc);
        this.effects.later(() => {
          this.spellMode = 'common';
          this.applyBaseMode();
        }, this.effects.noxSwitchDelay);
        new Notice(this.t('eggNox'));
        break;
      case 'solemnlySwear':
        if (this.paused) {
          this.paused = false;
          this.applyTheme();
        }
        this.effects.marauders(doc, [this.t('eggMap1'), this.t('eggMap2'), this.t('eggMapTitle')]);
        // Карта проявляется вслед за надписью
        this.effects.later(() => void this.map.reveal(), 1200);
        break;
      case 'mischiefManaged':
        this.effects.inkFade(doc);
        this.map.close();
        new Notice(this.t('eggMischief'));
        this.effects.later(() => {
          this.paused = true;
          this.applyTheme();
        }, 500);
        break;
      case 'accioSnitch':
        this.effects.releaseSnitch(doc, { label: this.t('eggSnitchLabel'), onCatch: () => void this.awardSnitch() });
        break;
    }
  }

  private async awardSnitch(): Promise<void> {
    const house = this.settings.house;
    this.settings.points[house] = (this.settings.points[house] ?? 0) + SNITCH_POINTS;
    this.settings.snitches += 1;
    await this.saveSettings();
    new Notice(this.t('eggSnitch', SNITCH_POINTS, this.t(`house_${house}`)));
  }

  private async birthday(): Promise<void> {
    const now = new Date();
    if (!this.settings.easterEggs || now.getMonth() !== 6 || now.getDate() !== 31) return;
    const year = String(now.getFullYear());
    if (this.settings.birthdayShown === year) return;
    this.settings.birthdayShown = year;
    await this.saveData(this.settings);
    new Notice(this.t('eggBirthday'), 10000);
  }
}
