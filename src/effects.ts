/*
 * Визуальные эффекты пасхалок. Статичные стили — в styles.css (.hp-overlay и ниже),
 * координаты и анимации — здесь, через Web Animations API.
 */
import { FOOT_SVG, SNITCH_SVG, svgElement } from './crest.ts';

const SVG_NS = 'http://www.w3.org/2000/svg';

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const viewOf = (doc: Document): Window => doc.defaultView ?? window;

export interface TrailColors {
  /** Цвет свечения в тёмной теме и цвет «чернил» в светлой. */
  glow: string;
  ink: string;
}

/** След палочки, пока рисуется жест. */
export interface Trail {
  add(x: number, y: number): void;
  /** Жест закончен: успех — вспышка искр, неудача — след гаснет дымком. */
  finish(success: boolean): void;
  cancel(): void;
}

// Что можно поднять «Вингардиум Левиосой»: блоки текста, файлы, вкладки, коллауты…
const LEVITATE_TARGETS = '.nav-file-title, .nav-folder-title, .tree-item-self, .workspace-tab-header, .side-dock-ribbon-action, ' +
  '.status-bar-item, .callout, .cm-line, .inline-title, p, li, h1, h2, h3, h4, h5, h6, blockquote, pre, img, table, .setting-item';

export interface SnitchCallbacks {
  label: string;
  onCatch(): void;
}

/**
 * Эффекты рисуются в документе того окна, где произнесено заклинание: у Obsidian бывают
 * отдельные окна (popout), и у каждого свой document со своим слоем эффектов.
 */
export class Effects {
  private layers = new Map<Document, HTMLElement>();
  private snitch: HTMLElement | null = null;
  private timers = new Set<number>();
  private pointer: { x: number; y: number; doc: Document | null } = { x: 0, y: 0, doc: null };

  constructor(private readonly reducedMotion: () => boolean) {}

  /** Где курсор в этом документе; если он в другом окне — середина окна, чуть выше центра. */
  pointerIn(doc: Document): { x: number; y: number } {
    if (this.pointer.doc === doc) return { x: this.pointer.x, y: this.pointer.y };
    const view = viewOf(doc);
    return { x: view.innerWidth / 2, y: view.innerHeight / 3 };
  }

  trackPointer(e: PointerEvent): void {
    this.pointer = { x: e.clientX, y: e.clientY, doc: e.view?.document ?? (e.target as Node | null)?.ownerDocument ?? null };
  }

  /** Окно закрыли: его слой больше не нужен. */
  forget(doc: Document): void {
    this.layers.get(doc)?.remove();
    this.layers.delete(doc);
    if (this.pointer.doc === doc) this.pointer.doc = null;
    if (this.snitch?.ownerDocument === doc) this.snitch = null;
  }

  destroy(): void {
    for (const id of this.timers) window.clearTimeout(id);
    this.timers.clear();
    for (const layer of this.layers.values()) layer.remove();
    this.layers.clear();
    this.snitch = null;
  }

  get snitchActive(): boolean {
    return this.snitch !== null;
  }

  // ---------- Lumos / Nox ----------

  lumos(doc: Document): void {
    const size = 80;
    const at = this.pointerIn(doc);
    const view = viewOf(doc);
    const glow = this.add(doc, 'div', 'hp-glow');
    glow.style.left = `${at.x - size / 2}px`;
    glow.style.top = `${at.y - size / 2}px`;
    const scale = (Math.hypot(view.innerWidth, view.innerHeight) / size) * 2.2;
    this.removeAfter(glow.animate([
      { transform: 'scale(.2)', opacity: 1 },
      { transform: `scale(${scale})`, opacity: 0.85, offset: 0.55 },
      { transform: `scale(${scale})`, opacity: 0 }
    ], { duration: this.reducedMotion() ? 400 : 1100, easing: 'ease-out' }), glow);
  }

  nox(doc: Document): void {
    const at = this.pointerIn(doc);
    const shade = this.add(doc, 'div', 'hp-shade');
    shade.style.background =
      `radial-gradient(circle at ${at.x}px ${at.y}px, rgba(0,0,0,0) 0, rgba(0,0,0,.92) 220px)`;
    this.removeAfter(shade.animate([
      { opacity: 0 }, { opacity: 1, offset: 0.45 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }
    ], { duration: this.reducedMotion() ? 500 : 1400, easing: 'ease-in-out' }), shade);
  }

  /** Момент, когда экран темнее всего — в этот момент удобно переключить тему. */
  get noxSwitchDelay(): number {
    return this.reducedMotion() ? 200 : 600;
  }

  // ---------- След палочки и Вингардиум Левиоса ----------

  trail(doc: Document, colors: TrailColors, x: number, y: number): Trail {
    const svg = doc.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'hp-trail');
    svg.style.setProperty('--hp-trail-glow', colors.glow);
    svg.style.setProperty('--hp-trail-ink', colors.ink);
    const lines = ['hp-trail-glow', 'hp-trail-core'].map((cls) => {
      const line = svg.appendChild(doc.createElementNS(SVG_NS, 'polyline'));
      line.setAttribute('class', cls);
      return line;
    });
    this.getLayer(doc).appendChild(svg);
    let points = `${x},${y}`;
    let last = { x, y };
    const draw = () => lines.forEach((l) => l.setAttribute('points', points));
    draw();
    return {
      add: (px, py) => {
        last = { x: px, y: py };
        points += ` ${Math.round(px)},${Math.round(py)}`;
        draw();
      },
      finish: (success) => {
        if (success) this.sparkle(doc, last.x, last.y, colors);
        else svg.classList.add('is-fizzled');
        this.removeAfter(svg.animate([{ opacity: 1 }, { opacity: 0 }],
          { duration: this.reducedMotion() ? 200 : success ? 700 : 450, easing: 'ease-out', fill: 'forwards' }), svg);
      },
      cancel: () => svg.remove()
    };
  }

  levitate(doc: Document, x: number, y: number): void {
    const hit = doc.elementFromPoint(x, y);
    const target = hit?.closest<HTMLElement>(LEVITATE_TARGETS)
      ?? doc.querySelector<HTMLElement>('.workspace-leaf.mod-active .view-content')
      ?? doc.querySelector<HTMLElement>('.workspace');
    if (!target) return;
    const lift = this.reducedMotion() ? -4 : -16;
    const frames = this.reducedMotion()
      ? [{ transform: 'translateY(0)' }, { transform: `translateY(${lift}px)`, offset: 0.3 }, { transform: `translateY(${lift}px)`, offset: 0.7 }, { transform: 'translateY(0)' }]
      : [
        { transform: 'translateY(0) rotate(0)' },
        { transform: `translateY(${lift}px) rotate(-1deg)`, offset: 0.2 },
        { transform: `translateY(${lift + 6}px) rotate(1deg)`, offset: 0.4 },
        { transform: `translateY(${lift}px) rotate(-1deg)`, offset: 0.6 },
        { transform: `translateY(${lift + 6}px) rotate(.5deg)`, offset: 0.8 },
        { transform: 'translateY(0) rotate(0)' }
      ];
    target.animate(frames, { duration: this.reducedMotion() ? 1200 : 3200, easing: 'ease-in-out', composite: 'add' });
  }

  // ---------- Карта Мародёров ----------

  marauders(doc: Document, lines: [string, string, string]): void {
    const card = this.add(doc, 'div', 'hp-map-card');
    for (const line of lines.slice(0, 2)) card.appendChild(doc.createElement('div')).textContent = line;
    const title = card.appendChild(doc.createElement('div'));
    title.className = 'hp-map-title';
    title.textContent = lines[2];
    this.removeAfter(card.animate([
      { opacity: 0, filter: 'blur(6px)' },
      { opacity: 1, filter: 'blur(0)', offset: 0.18 },
      { opacity: 1, filter: 'blur(0)', offset: 0.8 },
      { opacity: 0, filter: 'blur(4px)' }
    ], { duration: 5200, easing: 'ease-in-out' }), card);

    if (this.reducedMotion()) return;

    // Следы идут по кривой Безье от одного края окна к другому
    const w = viewOf(doc).innerWidth;
    const h = viewOf(doc).innerHeight;
    const fromLeft = Math.random() < 0.5;
    const p0 = { x: fromLeft ? -20 : w + 20, y: rand(h * 0.55, h * 0.95) };
    const p1 = { x: rand(w * 0.2, w * 0.8), y: rand(0, h) };
    const p2 = { x: fromLeft ? w + 20 : -20, y: rand(h * 0.05, h * 0.45) };
    const steps = Math.max(14, Math.round(w / 70));
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      const x = (1 - s) ** 2 * p0.x + 2 * (1 - s) * s * p1.x + s * s * p2.x;
      const y = (1 - s) ** 2 * p0.y + 2 * (1 - s) * s * p1.y + s * s * p2.y;
      const dx = 2 * (1 - s) * (p1.x - p0.x) + 2 * s * (p2.x - p1.x);
      const dy = 2 * (1 - s) * (p1.y - p0.y) + 2 * s * (p2.y - p1.y);
      const len = Math.hypot(dx, dy) || 1;
      const side = i % 2 ? 9 : -9;
      const foot = this.add(doc, 'div', 'hp-footprint');
      foot.appendChild(svgElement(FOOT_SVG));
      foot.style.left = `${x - (dy / len) * side - 8}px`;
      foot.style.top = `${y + (dx / len) * side - 13}px`;
      foot.style.transform = `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI + 90}deg)`;
      this.removeAfter(foot.animate([
        { opacity: 0 }, { opacity: 0.85, offset: 0.08 }, { opacity: 0.85, offset: 0.55 }, { opacity: 0 }
      ], { duration: 3000, delay: i * 230, easing: 'ease-out', fill: 'both' }), foot);
    }
  }

  /** Лёгкое «чернильное» затемнение для «Шалость удалась». */
  inkFade(doc: Document): void {
    const ink = this.add(doc, 'div', 'hp-shade');
    ink.style.background = 'radial-gradient(circle, rgba(74,46,20,0) 30%, rgba(74,46,20,.35))';
    this.removeAfter(ink.animate([{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 1200 }), ink);
  }

  // ---------- Золотой снитч ----------

  releaseSnitch(doc: Document, { label, onCatch }: SnitchCallbacks): void {
    if (this.snitch?.isConnected) return;
    const view = viewOf(doc);
    const btn = this.add(doc, 'button', 'hp-snitch');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', label);
    btn.dataset.hpSnitch = '';
    btn.appendChild(svgElement(SNITCH_SVG));
    this.snitch = btn;

    const slow = this.reducedMotion() ? 2.5 : 1;
    if (!this.reducedMotion()) {
      for (const wing of Array.from(btn.querySelectorAll<SVGGElement>('.hp-wing'))) {
        wing.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(-.6)' }, { transform: 'scaleY(1)' }],
          { duration: 90, iterations: Infinity });
      }
    }

    let pos = { x: -70, y: rand(40, view.innerHeight - 80) };
    let current: Animation | null = null;
    let caught = false;
    const deadline = Date.now() + 25000;

    const fly = () => {
      if (caught || !btn.isConnected) return;
      const leaving = Date.now() > deadline;
      const next = leaving
        ? { x: view.innerWidth + 90, y: rand(-60, view.innerHeight / 2) }
        : { x: rand(10, view.innerWidth - 80), y: rand(40, view.innerHeight - 60) };
      // Иногда снитч зависает на месте — шанс его поймать
      const hover = !leaving && Math.random() < 0.3 ? rand(350, 900) : 0;
      current = btn.animate([
        { transform: `translate(${pos.x}px, ${pos.y}px)` },
        { transform: `translate(${next.x}px, ${next.y}px)` }
      ], {
        duration: Math.max(260, Math.hypot(next.x - pos.x, next.y - pos.y) * 1.3) * slow,
        delay: hover,
        easing: 'cubic-bezier(.45,.05,.35,1)',
        fill: 'forwards'
      });
      pos = next;
      current.onfinish = () => {
        if (!leaving) return fly();
        btn.remove();
        this.snitch = null;
      };
    };

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (caught) return;
      caught = true;
      current?.pause();
      const box = btn.getBoundingClientRect();
      this.sparkle(doc, box.left + box.width / 2, box.top + box.height / 2);
      this.removeAfter(btn.animate([{ opacity: 1 }, { opacity: 0, transform: `translate(${box.left}px, ${box.top}px) scale(.3)` }],
        { duration: 400, fill: 'forwards' }), btn);
      this.snitch = null;
      onCatch();
    });

    fly();
  }

  // ---------- Очки факультету ----------

  /** «+10» всплывает над элементом (счётчиком очков в статус-баре) и тает. */
  floatText(anchor: HTMLElement, text: string): void {
    const doc = anchor.ownerDocument;
    const box = anchor.getBoundingClientRect();
    const el = this.add(doc, 'div', 'hp-float-points');
    el.textContent = text;
    el.style.left = `${box.left + box.width / 2}px`;
    el.style.top = `${box.top}px`;
    const rise = this.reducedMotion() ? 0 : -28;
    this.removeAfter(el.animate([
      { transform: 'translate(-50%, 0)', opacity: 0 },
      { transform: `translate(-50%, ${rise / 3}px)`, opacity: 1, offset: 0.2 },
      { transform: `translate(-50%, ${rise}px)`, opacity: 0 }
    ], { duration: 1400, easing: 'ease-out' }), el);
  }

  private sparkle(doc: Document, x: number, y: number, colors?: TrailColors): void {
    const dark = doc.body.classList.contains('theme-dark');
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const r = rand(40, 80);
      const dot = this.add(doc, 'div', 'hp-spark');
      dot.style.left = `${x - 3}px`;
      dot.style.top = `${y - 3}px`;
      if (colors) {
        const c = i % 2 && !dark ? colors.ink : colors.glow;
        dot.style.background = c;
        dot.style.boxShadow = `0 0 8px ${c}`;
      } else if (i % 2) {
        dot.style.background = 'var(--hp-accent, #c9a227)';
      }
      this.removeAfter(dot.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px) scale(.2)`, opacity: 0 }
      ], { duration: 700, easing: 'ease-out' }), dot);
    }
  }

  // ---------- Служебное ----------

  private getLayer(doc: Document): HTMLElement {
    let layer = this.layers.get(doc);
    if (layer?.isConnected) return layer;
    layer = doc.createElement('div');
    layer.className = 'hp-overlay';
    doc.body.appendChild(layer);
    this.layers.set(doc, layer);
    return layer;
  }

  private add<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, cls: string): HTMLElementTagNameMap[K] {
    const el = doc.createElement(tag);
    el.className = cls;
    this.getLayer(doc).appendChild(el);
    return el;
  }

  private removeAfter(animation: Animation, el: Element): void {
    animation.onfinish = () => el.remove();
  }

  later(fn: () => void, ms: number): void {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);
    this.timers.add(id);
  }
}
