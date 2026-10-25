import { FuzzySuggestModal, Modal } from 'obsidian';
import type { App } from 'obsidian';
import { HOUSE_IDS, palette } from './houses.ts';
import type { HouseId } from './houses.ts';
import { HAT_SVG, crestSvg, svgElement } from './crest.ts';
import type { Translate } from './i18n.ts';

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

/** «Взмахнуть палочкой…»: поле для заклинания. */
export class WandModal extends Modal {
  constructor(app: App, private readonly t: Translate, private readonly onCast: (phrase: string) => void) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText(this.t('wandTitle'));
    this.titleEl.addClass('hp-display');
    const input = this.contentEl.createEl('input', {
      cls: 'hp-wand-input',
      attr: { type: 'text', placeholder: this.t('wandPlaceholder'), 'aria-label': this.t('wandPlaceholder') }
    });
    this.contentEl.createEl('p', { cls: 'hp-wand-hint', text: this.t('wandHint') });
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
