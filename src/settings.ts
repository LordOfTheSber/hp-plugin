import { PluginSettingTab, Setting } from 'obsidian';
import type { App } from 'obsidian';
import { HOUSES, HOUSE_IDS } from './houses.ts';
import { crestSvg, svgElement } from './crest.ts';
import { GESTURES, gestureSvg } from './gestures.ts';
import { ConfirmModal, describeWand, wandName } from './modals.ts';
import { wandSideSvg } from './wands.ts';
import { DAILY_POINTS, TASK_POINTS } from './work.ts';
import { MODE_SETTINGS, parseFolderList } from './settings-data.ts';
import type { HpSettings } from './settings-data.ts';
import type HpThemePlugin from './main.ts';

export { DEFAULT_SETTINGS, migrateSettings } from './settings-data.ts';
export type { HpSettings } from './settings-data.ts';

type ToggleKey = { [K in keyof HpSettings]: HpSettings[K] extends boolean ? K : never }[keyof HpSettings];

export class HpSettingTab extends PluginSettingTab {
  private clicks: number[] = [];

  constructor(app: App, private readonly plugin: HpThemePlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    const { t, settings } = this.plugin;
    containerEl.empty();

    // Заголовок с гербом. Пасхалка: тройной клик по гербу — девиз Хогвартса.
    const header = containerEl.createDiv({ cls: 'hp-settings-header' });
    const crest = header.createDiv({ cls: 'hp-crest' });
    crest.appendChild(svgElement(crestSvg(settings.house, 44)));
    header.createDiv({ cls: 'hp-settings-title', text: t('pluginName') });
    const motto = containerEl.createDiv({ cls: 'hp-motto' });
    motto.hide();
    motto.createDiv({ cls: 'hp-motto-latin', text: t('motto') });
    motto.createDiv({ cls: 'hp-motto-translation', text: t('mottoTranslation') });
    crest.addEventListener('click', () => {
      const now = Date.now();
      this.clicks = this.clicks.filter((x) => now - x < 700).concat(now);
      if (this.clicks.length < 3) return;
      this.clicks = [];
      motto.toggle(!motto.isShown());
    });

    // Факультеты
    const houses = containerEl.createDiv({ cls: 'hp-houses', attr: { role: 'radiogroup' } });
    for (const id of HOUSE_IDS) {
      const card = houses.createEl('button', {
        cls: 'hp-house-card' + (id === settings.house ? ' is-selected' : ''),
        attr: { type: 'button', role: 'radio', 'aria-checked': String(id === settings.house), 'data-house': id }
      });
      card.appendChild(svgElement(crestSvg(id, 36)));
      card.createSpan({ text: t(`house_${id}`) });
      card.addEventListener('click', async () => {
        await this.plugin.setHouse(id);
        this.display();
      });
    }
    containerEl.createEl('p', { cls: 'setting-item-description', text: t('settingsIntro') });

    // ---------- Оформление ----------
    this.heading(t('sectionAppearance'));
    new Setting(containerEl)
      .setName(t('settingMode'))
      .setDesc(t('settingModeDesc'))
      .addDropdown((d) => {
        for (const mode of MODE_SETTINGS) d.addOption(mode, t(`mode_${mode}`));
        d.setValue(settings.mode).onChange((value) => void this.plugin.setMode(value as HpSettings['mode']));
      })
      .settingEl.addClass('hp-mode-setting');
    this.toggle('readableFont', t('settingReadableFont'), t('settingReadableFontDesc'));
    this.toggle('headingFont', t('settingHeadingFont'), t('settingHeadingFontDesc'));
    this.toggle('ornaments', t('settingOrnaments'), t('settingOrnamentsDesc'));
    this.toggle('statusBar', t('settingStatusBar'));

    // ---------- Палочка ----------
    this.heading(t('sectionWand'));
    const wand = new Setting(containerEl)
      .setName(t('settingWand'))
      .setDesc(`${wandName(t, settings.wand)}: ${describeWand(t, settings.wand).toLowerCase()}`)
      .addButton((b) => b
        .setButtonText(t('buttonWandShop'))
        .onClick(() => this.plugin.openWandShop(() => this.display())));
    wand.settingEl.addClass('hp-wand-setting');
    wand.infoEl.createDiv({ cls: 'hp-wand-current' }).appendChild(svgElement(wandSideSvg(settings.wand, 260, 'hp-settings-wand')));
    this.toggle('wandCursor', t('settingWandCursor'), t('settingWandCursorDesc'));

    // ---------- Карта Мародёров ----------
    this.heading(t('sectionMap'));
    this.toggle('mapTags', t('settingMapTags'), t('settingMapTagsDesc'));
    this.toggle('mapUnresolved', t('settingMapUnresolved'), t('settingMapUnresolvedDesc'));
    new Setting(containerEl)
      .setName(t('settingMapDepth'))
      .setDesc(t('settingMapDepthDesc'))
      .addDropdown((d) => d
        .addOption('2', t('mapDepth_2'))
        .addOption('1', t('mapDepth_1'))
        .setValue(String(settings.mapDepth))
        .onChange(async (value) => {
          settings.mapDepth = value === '1' ? 1 : 2;
          await this.plugin.saveSettings();
        }))
      .settingEl.addClass('hp-map-depth-setting');
    this.folders('mapExclude', t('settingMapExclude'), t('settingMapExcludeDesc'), 'Templates\nArchive', true);
    this.folders('restrictedFolders', t('settingRestricted'), t('settingRestrictedDesc'), 'Secrets', false);

    // ---------- Магия ----------
    this.heading(t('sectionMagic'));
    this.toggle('easterEggs', t('settingEasterEggs'), t('settingEasterEggsDesc'), () => this.display());
    const gestures = this.toggle('gestures', t('settingGestures'),
      `${t('settingGesturesDesc')} ${settings.easterEggs ? t('settingGesturesAlt') : t('settingGesturesDisabled')}`);
    gestures.setDisabled(!settings.easterEggs);
    gestures.settingEl.toggleClass('is-disabled', !settings.easterEggs);

    // Учебник заклинаний: какие фигуры рисовать палочкой (спрятан — это спойлер)
    const book = containerEl.createEl('details', { cls: 'hp-spellbook' });
    book.createEl('summary', { text: t('spellbookTitle') });
    const list = book.createDiv({ cls: 'hp-spellbook-list' });
    for (const { spell } of GESTURES) {
      const item = list.createDiv({ cls: 'hp-spellbook-item', attr: { 'data-spell': spell } });
      item.createDiv({ cls: 'hp-spellbook-figure' }).appendChild(svgElement(gestureSvg(spell)));
      const text = item.createDiv();
      text.createDiv({ cls: 'hp-spellbook-name', text: t(`spell_${spell}`) });
      text.createDiv({ cls: 'setting-item-description', text: t(`gesture_${spell}`) });
    }

    // ---------- Кубок школы ----------
    this.heading(t('sectionCup'));
    this.toggle('workPoints', t('settingWorkPoints'), t('settingWorkPointsDesc', TASK_POINTS, DAILY_POINTS));
    this.cup();
    new Setting(containerEl)
      .setName(t('settingSortingHat'))
      .addButton((b) => b
        .setButtonText(t('buttonSortingHat'))
        .setCta()
        .onClick(() => this.plugin.openSortingHat(() => this.display())))
      .addButton((b) => b
        .setButtonText(t('buttonResetPoints'))
        .setWarning()
        .onClick(() => new ConfirmModal(this.app, {
          title: t('resetTitle'),
          text: t('resetText'),
          confirm: t('resetConfirm'),
          cancel: t('cancel'),
          onConfirm: () => void this.plugin.resetPoints().then(() => this.display())
        }).open()))
      .settingEl.addClass('hp-cup-actions');
  }

  private heading(name: string): void {
    new Setting(this.containerEl).setName(name).setHeading();
  }

  /** Кубок школы: очки всех факультетов, полоски — относительно лидера. */
  private cup(): void {
    const { t, settings } = this.plugin;
    const cup = this.containerEl.createDiv({ cls: 'hp-cup' });
    const max = Math.max(1, ...HOUSE_IDS.map((id) => settings.points[id] ?? 0));
    for (const id of HOUSE_IDS) {
      const points = settings.points[id] ?? 0;
      const row = cup.createDiv({ cls: 'hp-cup-row' + (id === settings.house ? ' is-current' : ''), attr: { 'data-house': id } });
      row.appendChild(svgElement(crestSvg(id, 20)));
      row.createSpan({ cls: 'hp-cup-name', text: t(`house_${id}`) });
      const bar = row.createDiv({ cls: 'hp-cup-bar' }).createDiv({ cls: 'hp-cup-fill' });
      bar.style.width = `${Math.round((points / max) * 100)}%`;
      bar.style.background = HOUSES[id].crest.field;
      row.createSpan({ cls: 'hp-cup-points', text: t('cupPoints', points) });
    }
    cup.createDiv({ cls: 'setting-item-description', text: t('cupSnitches', settings.snitches) });
  }

  private toggle(key: ToggleKey, name: string, desc?: string, after?: () => void): Setting {
    const setting = new Setting(this.containerEl).setName(name);
    if (desc) setting.setDesc(desc);
    setting.addToggle((tg) => tg
      .setValue(this.plugin.settings[key])
      .onChange(async (value) => {
        this.plugin.settings[key] = value;
        await this.plugin.saveSettings();
        after?.();
      }));
    return setting;
  }

  /** Список папок: сохраняется, когда поле отпустили, а не на каждую букву — карта перестраивается целиком. */
  private folders(key: 'mapExclude' | 'restrictedFolders', name: string, desc: string, placeholder: string, multiline: boolean): void {
    const setting = new Setting(this.containerEl).setName(name).setDesc(desc);
    setting.settingEl.addClass(`hp-folders-${key}`);
    const save = async (text: string) => {
      const folders = parseFolderList(text);
      if (folders.join('\n') === this.plugin.settings[key].join('\n')) return;
      this.plugin.settings[key] = folders;
      await this.plugin.saveSettings();
    };
    const value = this.plugin.settings[key].join(multiline ? '\n' : ', ');
    if (multiline) {
      setting.addTextArea((ta) => {
        ta.setPlaceholder(placeholder).setValue(value);
        ta.inputEl.rows = 3;
        ta.inputEl.addEventListener('change', () => void save(ta.getValue()));
      });
    } else {
      setting.addText((tx) => {
        tx.setPlaceholder(placeholder).setValue(value);
        tx.inputEl.addEventListener('change', () => void save(tx.getValue()));
      });
    }
  }
}
