import { PluginSettingTab, Setting } from 'obsidian';
import type { App } from 'obsidian';
import { HOUSE_IDS } from './houses.ts';
import { crestSvg, svgElement } from './crest.ts';
import { GESTURES, gestureSvg } from './gestures.ts';
import { describeWand, wandName } from './modals.ts';
import { wandSideSvg } from './wands.ts';
import type HpThemePlugin from './main.ts';

export { DEFAULT_SETTINGS, migrateSettings } from './settings-data.ts';
export type { HpSettings } from './settings-data.ts';

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

    this.toggle('readableFont', t('settingReadableFont'), t('settingReadableFontDesc'));
    this.toggle('headingFont', t('settingHeadingFont'), t('settingHeadingFontDesc'));
    this.toggle('ornaments', t('settingOrnaments'), t('settingOrnamentsDesc'));
    const wand = new Setting(containerEl)
      .setName(t('settingWand'))
      .setDesc(`${wandName(t, settings.wand)}: ${describeWand(t, settings.wand).toLowerCase()}`)
      .addButton((b) => b
        .setButtonText(t('buttonWandShop'))
        .onClick(() => this.plugin.openWandShop(() => this.display())));
    wand.settingEl.addClass('hp-wand-setting');
    wand.infoEl.createDiv({ cls: 'hp-wand-current' }).appendChild(svgElement(wandSideSvg(settings.wand, 260, 'hp-settings-wand')));
    this.toggle('wandCursor', t('settingWandCursor'), t('settingWandCursorDesc'));
    this.toggle('statusBar', t('settingStatusBar'));
    this.toggle('easterEggs', t('settingEasterEggs'), t('settingEasterEggsDesc'));
    this.toggle('gestures', t('settingGestures'), t('settingGesturesDesc'));

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

    new Setting(containerEl)
      .setName(t('settingSortingHat'))
      .setDesc(t('settingPoints', t(`house_${settings.house}`), settings.points[settings.house] ?? 0))
      .addButton((b) => b
        .setButtonText(t('buttonSortingHat'))
        .setCta()
        .onClick(() => this.plugin.openSortingHat(() => this.display())));
  }

  private toggle(key: 'readableFont' | 'headingFont' | 'ornaments' | 'wandCursor' | 'statusBar' | 'easterEggs' | 'gestures',
    name: string, desc?: string): void {
    const setting = new Setting(this.containerEl).setName(name);
    if (desc) setting.setDesc(desc);
    setting.addToggle((tg) => tg
      .setValue(this.plugin.settings[key])
      .onChange(async (value) => {
        this.plugin.settings[key] = value;
        await this.plugin.saveSettings();
      }));
  }
}
