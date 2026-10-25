import { FuzzySuggestModal, Modal, Setting } from 'obsidian';
import type { App, DropdownComponent, SliderComponent } from 'obsidian';
import { HOUSE_IDS, palette } from './houses.ts';
import type { HouseId } from './houses.ts';
import { HAT_SVG, crestSvg, svgElement } from './crest.ts';
import type { Translate } from './i18n.ts';
import {
  CORE_IDS, FLEX_IDS, HANDLE_IDS, LENGTH_MAX, LENGTH_MIN, LENGTH_STEP, WAND_PRESETS, WOOD_IDS,
  formatLength, presetOf, randomWand, wandSideSvg
} from './wands.ts';
import type { PresetId, WandSpec } from './wands.ts';

/** Распределяющая шляпа: три фразы «в раздумьях», затем вердикт. */
export class SortingHatModal extends Modal {
  private cancelled = false;

  constructor(
    app: App,
    private readonly t: Translate,
    private readonly isDark: boolean,
    private readonly onSorted: (house: HouseId) => void
  ) {
    super(app);
  }

  onOpen(): void {
    this.modalEl.addClass('hp-hat-modal');
    const hat = this.contentEl.appendChild(svgElement(HAT_SVG));
    hat.classList.add('hp-hat-img');
    const text = this.contentEl.createEl('p', { cls: 'hp-hat-text' });
    text.setAttribute('aria-live', 'assertive');
    void this.run(text);
  }

  onClose(): void {
    this.cancelled = true;
    this.contentEl.empty();
  }

  // При «уменьшении движения» анимации отключает CSS, а паузы остаются: фразы нужно успеть прочитать.
  private sleep(ms: number): Promise<void> {
    return new Promise((r) => window.setTimeout(r, ms));
  }

  private async run(text: HTMLElement): Promise<void> {
    const phrases = (['hat1', 'hat2', 'hat3', 'hat4'] as const).slice().sort(() => Math.random() - 0.5).slice(0, 3);
    for (const key of phrases) {
      text.setText(this.t(key));
      await this.sleep(1100);
      if (this.cancelled) return;
    }
    const house = HOUSE_IDS[Math.floor(Math.random() * HOUSE_IDS.length)];
    text.addClass('hp-verdict');
    text.style.setProperty('--hp-verdict-color', palette(house, this.isDark ? 'common' : 'parchment').primary);
    text.setText(this.t(`houseShout_${house}`));
    this.onSorted(house);
    await this.sleep(1600);
    if (!this.cancelled) this.close();
  }
}

/** «Остролист, перо феникса, 11 дюймов, гибкая». */
export function describeWand(t: Translate, wand: WandSpec): string {
  const length = t(wand.length % 1 ? 'lengthFraction' : 'lengthWhole', formatLength(wand.length));
  return t('wandDescription', t(`wood_${wand.wood}`), t(`core_${wand.core}`), length, t(`flex_${wand.flex}`));
}

/** «Палочка Гарри Поттера» или «Ваша собственная палочка». */
export function wandName(t: Translate, wand: WandSpec): string {
  const preset = presetOf(wand);
  return preset ? t(`presetWand_${preset}`) : t('shopCustomWand');
}

export interface WandShopOptions {
  wand: WandSpec;
  /** Включён ли курсор-палочка: переключатель есть прямо в лавке. */
  cursor: boolean;
  onChange(wand: WandSpec): void;
  onCursor(enabled: boolean): void;
  onClosed?(): void;
}

/** Лавка Олливандера: знаменитые палочки и конструктор своей. */
export class WandShopModal extends Modal {
  private wand: WandSpec;
  private stage!: { preview: HTMLElement; name: HTMLElement; desc: HTMLElement };
  private cards = new Map<PresetId, HTMLElement>();
  private dropdowns: { key: 'wood' | 'core' | 'handle' | 'flex'; control: DropdownComponent }[] = [];
  private slider: SliderComponent | null = null;
  private lengthLabel: HTMLElement | null = null;

  constructor(app: App, private readonly t: Translate, private readonly options: WandShopOptions) {
    super(app);
    this.wand = { ...options.wand };
  }

  onOpen(): void {
    const { t, contentEl } = this;
    this.modalEl.addClass('hp-shop-modal');
    this.titleEl.setText(t('shopTitle'));
    this.titleEl.addClass('hp-display');
    contentEl.createEl('p', { cls: 'hp-shop-quote', text: t('shopQuote') });

    const stage = contentEl.createDiv({ cls: 'hp-shop-stage' });
    this.stage = {
      preview: stage.createDiv({ cls: 'hp-shop-preview' }),
      name: stage.createDiv({ cls: 'hp-shop-name' }),
      desc: stage.createDiv({ cls: 'hp-shop-desc' })
    };
    new Setting(contentEl)
      .setName(t('settingWandCursor'))
      .setDesc(t('settingWandCursorDesc'))
      .addToggle((tg) => tg.setValue(this.options.cursor).onChange((value) => this.options.onCursor(value)))
      .settingEl.addClass('hp-shop-cursor');

    contentEl.createDiv({ cls: 'hp-shop-heading', text: t('shopCanon') });
    const grid = contentEl.createDiv({ cls: 'hp-shop-presets' });
    for (const preset of WAND_PRESETS) {
      const card = grid.createEl('button', { cls: 'hp-shop-preset', attr: { type: 'button', 'data-preset': preset.id } });
      card.appendChild(svgElement(wandSideSvg(preset.wand, 150, `hp-shop-${preset.id}`)));
      card.createSpan({ text: t(`preset_${preset.id}`) });
      card.addEventListener('click', () => this.set(preset.wand));
      this.cards.set(preset.id, card);
    }

    contentEl.createDiv({ cls: 'hp-shop-heading', text: t('shopCustom') });
    const form = contentEl.createDiv({ cls: 'hp-shop-form' });
    this.dropdown(form, 'wood', t('shopWood'), WOOD_IDS.map((id) => [id, t(`wood_${id}`)]));
    this.dropdown(form, 'core', t('shopCore'), CORE_IDS.map((id) => [id, t(`core_${id}`)]));
    this.dropdown(form, 'handle', t('shopHandle'), HANDLE_IDS.map((id) => [id, t(`handle_${id}`)]));
    this.dropdown(form, 'flex', t('shopFlex'), FLEX_IDS.map((id) => [id, t(`flex_${id}`)]));
    const length = new Setting(form).setName(t('shopLength'));
    this.lengthLabel = length.nameEl.createSpan({ cls: 'hp-shop-length' });
    length.addSlider((s) => {
      this.slider = s;
      s.setLimits(LENGTH_MIN, LENGTH_MAX, LENGTH_STEP)
        .setValue(this.wand.length)
        .onChange((value) => this.update({ length: value }));
    });
    new Setting(form).addButton((b) => b
      .setButtonText(t('shopRandom'))
      .onClick(() => this.set(randomWand())));

    this.refresh();
  }

  onClose(): void {
    this.contentEl.empty();
    this.cards.clear();
    this.dropdowns = [];
    this.options.onClosed?.();
  }

  private dropdown(container: HTMLElement, key: 'wood' | 'core' | 'handle' | 'flex', name: string, options: [string, string][]): void {
    new Setting(container).setName(name).addDropdown((d) => {
      for (const [value, text] of options) d.addOption(value, text);
      d.setValue(this.wand[key]).onChange((value) => this.update({ [key]: value } as Partial<WandSpec>));
      this.dropdowns.push({ key, control: d });
    });
  }

  /** Выбрана целая палочка (знаменитая или случайная): обновить и поля конструктора. */
  private set(wand: WandSpec): void {
    this.wand = { ...wand };
    for (const { key, control } of this.dropdowns) control.setValue(this.wand[key]);
    this.slider?.setValue(this.wand.length);
    this.refresh();
    this.options.onChange({ ...this.wand });
  }

  private update(patch: Partial<WandSpec>): void {
    this.wand = { ...this.wand, ...patch };
    this.refresh();
    this.options.onChange({ ...this.wand });
  }

  private refresh(): void {
    const { t, wand, stage } = this;
    stage.preview.empty();
    stage.preview.appendChild(svgElement(wandSideSvg(wand, 480, 'hp-shop-main')));
    stage.name.setText(wandName(t, wand));
    stage.desc.setText(describeWand(t, wand));
    const preset = presetOf(wand);
    for (const [id, card] of this.cards) {
      card.toggleClass('is-selected', id === preset);
      card.setAttribute('aria-pressed', String(id === preset));
    }
    this.lengthLabel?.setText(` · ${formatLength(wand.length)}″`);
  }
}

/** «Взмахнуть палочкой…»: поле для заклинания. */
export class WandModal extends Modal {
  constructor(
    app: App,
    private readonly t: Translate,
    private readonly gestures: boolean,
    private readonly onCast: (phrase: string) => void
  ) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText(this.t('wandTitle'));
    this.titleEl.addClass('hp-display');
    const input = this.contentEl.createEl('input', {
      cls: 'hp-wand-input',
      attr: { type: 'text', placeholder: this.t('wandPlaceholder'), 'aria-label': this.t('wandPlaceholder') }
    });
    this.contentEl.createEl('p', { cls: 'hp-wand-hint', text: this.t(this.gestures ? 'wandHintGestures' : 'wandHint') });
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault();
      const phrase = input.value;
      this.close();
      this.onCast(phrase);
    });
    window.setTimeout(() => input.focus(), 0);
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

/** Команда «Выбрать факультет». */
export class HouseSuggestModal extends FuzzySuggestModal<HouseId> {
  constructor(app: App, private readonly t: Translate, private readonly onChoose: (house: HouseId) => void) {
    super(app);
    this.setPlaceholder(t('commandChooseHouse'));
  }

  getItems(): HouseId[] {
    return HOUSE_IDS;
  }

  getItemText(house: HouseId): string {
    return this.t(`house_${house}`);
  }

  renderSuggestion(match: { item: HouseId }, el: HTMLElement): void {
    el.addClass('hp-house-suggestion');
    const icon = el.createSpan({ cls: 'hp-menu-crest' });
    icon.appendChild(svgElement(crestSvg(match.item, 18)));
    el.createSpan({ text: ' ' + this.getItemText(match.item) });
  }

  onChooseItem(house: HouseId): void {
    this.onChoose(house);
  }
}
