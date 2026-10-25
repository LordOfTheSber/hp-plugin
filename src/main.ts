/*
 * HP Theme — плагин Obsidian: оформление в стиле факультетов Хогвартса.
 * Цвета и шрифты — в styles.css (генерируется из src/houses.ts и src/styles/theme.css),
 * плагин переключает классы на <body>, добавляет команды, меню и пасхалки.
 */
import { Menu, Notice, Plugin } from 'obsidian';
import type { WorkspaceWindow } from 'obsidian';
import * as obsidian from 'obsidian';
import { HOUSE_IDS } from './houses.ts';
import type { HouseId } from './houses.ts';
import { crestSvg, svgElement } from './crest.ts';
import { createTranslator } from './i18n.ts';
import type { Translate } from './i18n.ts';
import { createSpellbook, parseIncantation } from './spells.ts';
import type { SpellId } from './spells.ts';
import { Effects } from './effects.ts';
import { isEditable } from './dom.ts';
import { GestureInput } from './gesture-input.ts';
import type { Point } from './gestures.ts';
import { HouseSuggestModal, SortingHatModal, WandModal, WandShopModal } from './modals.ts';
import { CORES, wandCursorCss } from './wands.ts';
import type { WandSpec } from './wands.ts';
import { DEFAULT_SETTINGS, HpSettingTab, migrateSettings } from './settings.ts';
import type { HpSettings } from './settings.ts';

const SNITCH_POINTS = 150;
const LIGHT_THEME = 'moonstone';
const DARK_THEME = 'obsidian';

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

  private effects!: Effects;
  private gestures!: GestureInput;
  private saveTimer = 0;
  private statusEl: HTMLElement | null = null;
  private bodies = new Set<HTMLElement>();
  private spellbook = createSpellbook();
  private reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  async onload(): Promise<void> {
    this.t = createTranslator(detectLanguage());
    await this.loadSettings();
    this.effects = new Effects(() => this.reducedMotionQuery.matches);
    this.gestures = new GestureInput({
      enabled: () => this.settings.easterEggs && this.settings.gestures,
      colors: () => CORES[this.settings.wand.core],
      cast: (spell, at) => this.cast(spell, at)
    }, this.effects);

    this.bodies.add(document.body);
    this.registerEvent(this.app.workspace.on('window-open', (win: WorkspaceWindow) => {
      this.bodies.add(win.doc.body);
      this.applyTheme();
    }));
    this.registerEvent(this.app.workspace.on('window-close', (win: WorkspaceWindow) => {
      this.bodies.delete(win.doc.body);
    }));

    this.addSettingTab(new HpSettingTab(this.app, this));
    this.addRibbonIcon('wand', this.t('ribbonTitle'), (evt) => this.openHouseMenu(evt));
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
    this.addCommand({
      id: 'toggle-theme',
      name: this.t('commandToggle'),
      callback: () => {
        this.paused = !this.paused;
        this.applyTheme();
      }
    });

    this.registerDomEvent(window, 'keydown', (e) => this.onKeydown(e), true);
    this.registerDomEvent(window, 'pointermove', (e) => {
      this.effects.trackPointer(e);
      this.gestures.pointerMove(e);
    }, { passive: true });
    this.registerDomEvent(window, 'pointerdown', (e) => this.gestures.pointerDown(e), true);
    this.registerDomEvent(window, 'pointerup', (e) => this.gestures.pointerUp(e), true);
    this.registerDomEvent(window, 'pointercancel', () => this.gestures.cancel(), true);
    this.registerDomEvent(window, 'contextmenu', (e) => this.gestures.contextMenu(e), true);

    this.applyTheme();
    this.app.workspace.onLayoutReady(() => void this.birthday());
  }

  onunload(): void {
    if (this.saveTimer) {
      window.clearTimeout(this.saveTimer);
      void this.saveData(this.settings);
    }
    this.gestures?.cancel();
    this.effects?.destroy();
    for (const body of this.bodies) {
      this.setBodyClasses(body, false);
      body.style.removeProperty('--hp-wand-cursor');
    }
  }

  // ---------- Настройки ----------

  async loadSettings(): Promise<void> {
    this.settings = migrateSettings(await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.applyTheme();
  }

  /** Палочка меняется сразу, а сохраняется с задержкой: в лавке её крутят ползунком. */
  setWand(wand: WandSpec): void {
    this.settings.wand = wand;
    this.applyTheme();
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = 0;
      void this.saveData(this.settings);
    }, 400);
  }

  async setHouse(house: HouseId): Promise<void> {
    this.settings.house = house;
    await this.saveSettings();
  }

  // ---------- Тема ----------

  applyTheme(): void {
    const cursor = wandCursorCss(this.settings.wand);
    for (const body of this.bodies) {
      this.setBodyClasses(body, !this.paused);
      if (this.settings.wandCursor && !this.paused) body.style.setProperty('--hp-wand-cursor', cursor);
      else body.style.removeProperty('--hp-wand-cursor');
    }
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

  /** Переключает базовую тему Obsidian (светлая/тёмная). API не публичное, поэтому с запасными путями. */
  setBaseTheme(theme: typeof LIGHT_THEME | typeof DARK_THEME): void {
    const app = this.app as unknown as {
      setTheme?: (t: string) => void;
      changeTheme?: (t: string) => void;
      vault: { setConfig?: (k: string, v: string) => void };
    };
    if (typeof app.setTheme === 'function') {
      app.setTheme(theme);
      app.vault.setConfig?.('theme', theme);
    } else if (typeof app.changeTheme === 'function') {
      app.changeTheme(theme);
    } else {
      for (const body of this.bodies) {
        body.classList.toggle('theme-dark', theme === DARK_THEME);
        body.classList.toggle('theme-light', theme === LIGHT_THEME);
      }
      this.app.workspace.trigger('css-change');
    }
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
    new WandShopModal(this.app, this.t, this.settings.wand, (wand) => this.setWand(wand), after).open();
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

  // ---------- Пасхалки ----------

  private onKeydown(e: KeyboardEvent): void {
    if (!this.settings.easterEggs || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const target = (e.composedPath()[0] ?? e.target) as HTMLElement | null;
    if (isEditable(target)) return;
    const spell = this.spellbook.push(e.key);
    if (spell) this.cast(spell);
  }

  /** at — где начат жест палочкой (для «Вингардиум Левиосы»), иначе — где курсор. */
  cast(spell: SpellId, at?: Point): void {
    if (this.paused && spell !== 'solemnlySwear') return;
    switch (spell) {
      case 'wingardiumLeviosa': {
        const p = at ?? this.effects.pointerPosition;
        this.effects.levitate(p.x, p.y);
        new Notice(this.t('eggLeviosa'));
        break;
      }
      case 'lumos':
        this.effects.lumos();
        this.setBaseTheme(LIGHT_THEME);
        new Notice(this.t('eggLumos'));
        break;
      case 'nox':
        this.effects.nox();
        this.effects.later(() => this.setBaseTheme(DARK_THEME), this.effects.noxSwitchDelay);
        new Notice(this.t('eggNox'));
        break;
      case 'solemnlySwear':
        if (this.paused) {
          this.paused = false;
          this.applyTheme();
        }
        this.effects.marauders([this.t('eggMap1'), this.t('eggMap2'), this.t('eggMapTitle')]);
        break;
      case 'mischiefManaged':
        this.effects.inkFade();
        new Notice(this.t('eggMischief'));
        this.effects.later(() => {
          this.paused = true;
          this.applyTheme();
        }, 500);
        break;
      case 'accioSnitch':
        this.effects.releaseSnitch({ label: this.t('eggSnitchLabel'), onCatch: () => void this.awardSnitch() });
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
