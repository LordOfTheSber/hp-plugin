import { FuzzySuggestModal, Modal, Setting } from 'obsidian';
import type { App, DropdownComponent, SliderComponent, ToggleComponent } from 'obsidian';
import { HOUSE_IDS, palette } from './houses.ts';
import type { HouseId } from './houses.ts';
import { HAT_SVG, crestSvg, svgElement } from './crest.ts';
import type { Translate } from './i18n.ts';
import {
  CORE_IDS, FLEX_IDS, HANDLE_IDS, LENGTH_MAX, LENGTH_MIN, LENGTH_STEP, WAND_PRESETS, WOOD_IDS,
  formatLength, presetOf, randomWand, wandSideSvg
} from './wands.ts';
import type { PresetId, WandSpec } from './wands.ts';
import { QUIZ_QUESTIONS, shuffled, sortByAnswers } from './sorting.ts';

/**
 * Распределяющая шляпа: испытание из нескольких вопросов или «довериться шляпе» (случайный факультет).
 * Потом шляпа раздумывает вслух и объявляет вердикт.
 */
export class SortingHatModal extends Modal {
  private cancelled = false;
  private text!: HTMLElement;
  private progress!: HTMLElement;
  private choices!: HTMLElement;

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
    this.progress = this.contentEl.createDiv({ cls: 'hp-hat-progress' });
    this.text = this.contentEl.createEl('p', { cls: 'hp-hat-text' });
    this.text.setAttribute('aria-live', 'assertive');
    this.choices = this.contentEl.createDiv({ cls: 'hp-hat-choices' });
    this.intro();
  }

  onClose(): void {
    this.cancelled = true;
    this.contentEl.empty();
  }

  private intro(): void {
    const { t } = this;
    this.text.setText(t('hatIntro'));
    this.choices.empty();
    const quiz = this.choices.createEl('button', { cls: 'mod-cta hp-hat-quiz', text: t('hatQuiz'), attr: { type: 'button' } });
    quiz.addEventListener('click', () => this.ask(0, []));
    this.choices.createEl('button', { cls: 'hp-hat-trust', text: t('hatTrust'), attr: { type: 'button' } })
      .addEventListener('click', () => void this.verdict(null));
    window.setTimeout(() => quiz.focus(), 0);
  }

  private ask(index: number, answers: HouseId[]): void {
    const { t } = this;
    if (index === QUIZ_QUESTIONS.length) {
      void this.verdict(sortByAnswers(answers));
      return;
    }
    const question = QUIZ_QUESTIONS[index];
    this.progress.setText(t('hatProgress', index + 1, QUIZ_QUESTIONS.length));
    this.text.setText(t(`quiz_${question}`));
    this.choices.empty();
    this.choices.addClass('is-quiz');
    const buttons = shuffled(HOUSE_IDS).map((house) => {
      const btn = this.choices.createEl('button', {
        cls: 'hp-hat-answer', text: t(`quiz_${question}_${house}`), attr: { type: 'button', 'data-house': house }
      });
      btn.addEventListener('click', () => this.ask(index + 1, [...answers, house]));
      return btn;
    });
    window.setTimeout(() => buttons[0]?.focus(), 0);
  }

  // При «уменьшении движения» анимации отключает CSS, а паузы остаются: фразы нужно успеть прочитать.
  private sleep(ms: number): Promise<void> {
    return new Promise((r) => window.setTimeout(r, ms));
  }

  /** house — итог испытания; null — шляпа решает сама. */
  private async verdict(chosen: HouseId | null): Promise<void> {
    const { text } = this;
    this.choices.empty();
    this.choices.removeClass('is-quiz');
    this.progress.setText('');
    // После испытания шляпа раздумывает недолго: она уже многое узнала
    const phrases = shuffled(['hat1', 'hat2', 'hat3', 'hat4'] as const).slice(0, chosen ? 2 : 3);
    for (const key of phrases) {
      text.setText(this.t(key));
      await this.sleep(1100);
      if (this.cancelled) return;
    }
    const house = chosen ?? HOUSE_IDS[Math.floor(Math.random() * HOUSE_IDS.length)];
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
  /** Включён ли курсор-палочка: переключатель есть прямо в лавке, а выбор палочки его включает. */
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
  private cursorToggle: ToggleComponent | null = null;
  private cursorOn: boolean;

  constructor(app: App, private readonly t: Translate, private readonly options: WandShopOptions) {
    super(app);
    this.wand = { ...options.wand };
    this.cursorOn = options.cursor;
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
      .addToggle((tg) => {
        this.cursorToggle = tg;
        tg.setValue(this.cursorOn).onChange((value) => this.setCursor(value));
      })
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

  private setCursor(on: boolean): void {
    if (on === this.cursorOn) return;
    this.cursorOn = on;
    this.cursorToggle?.setValue(on);
    this.options.onCursor(on);
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
    // Выбрали палочку — значит, хотят её видеть
    this.setCursor(true);
  }

  private update(patch: Partial<WandSpec>): void {
    this.wand = { ...this.wand, ...patch };
    this.refresh();
    this.options.onChange({ ...this.wand });
    // Выбрали палочку — значит, хотят её видеть
    this.setCursor(true);
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

/** Выбор одной из нескольких заметок (Маховик времени: в тот день их было несколько). */
export class NoteSuggestModal extends FuzzySuggestModal<string> {
  constructor(app: App, placeholder: string, private readonly paths: string[], private readonly onChoose: (path: string) => void) {
    super(app);
    this.setPlaceholder(placeholder);
  }

  getItems(): string[] {
    return this.paths;
  }

  getItemText(path: string): string {
    return path.replace(/\.md$/, '');
  }

  onChooseItem(path: string): void {
    this.onChoose(path);
  }
}

/** «Точно?» перед тем, что не отменить (сброс очков). */
export class ConfirmModal extends Modal {
  constructor(app: App, private readonly options: { title: string; text: string; confirm: string; cancel: string; onConfirm(): void }) {
    super(app);
  }

  onOpen(): void {
    const { title, text, confirm, cancel, onConfirm } = this.options;
    this.titleEl.setText(title);
    this.contentEl.createEl('p', { text });
    new Setting(this.contentEl)
      .addButton((b) => b.setButtonText(cancel).onClick(() => this.close()))
      .addButton((b) => b.setButtonText(confirm).setWarning().onClick(() => {
        this.close();
        onConfirm();
      }));
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
