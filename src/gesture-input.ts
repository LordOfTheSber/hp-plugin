/*
 * Жесты палочкой: зажать правую кнопку мыши, нарисовать фигуру, отпустить.
 * Контекстное меню при этом не должно мешать: на Windows оно приходит после отпускания кнопки
 * (его гасим, если был жест), на macOS и Linux — сразу при нажатии (его откладываем и показываем
 * при отпускании, если жеста не было). В полях ввода и редакторе на macOS и Linux меню не трогаем:
 * там оно нужно сразу, с проверкой орфографии.
 */
import { isEditable } from './dom.ts';
import { recognize } from './gestures.ts';
import type { Point } from './gestures.ts';
import type { Effects, Trail, TrailColors } from './effects.ts';
import type { SpellId } from './spells.ts';

/** Сдвиг, после которого нажатие правой кнопки считается началом жеста, а не кликом. */
const MOVE_THRESHOLD = 10;
const MAX_POINTS = 2000;

export interface GestureHost {
  enabled(): boolean;
  colors(): TrailColors;
  cast(spell: SpellId, at: Point): void;
}

interface Stroke {
  points: Point[];
  moved: boolean;
  trail: Trail | null;
  pointerId: number;
  /** Отложенное контекстное меню (macOS, Linux). */
  menu: { target: EventTarget; init: MouseEventInit } | null;
}

export class GestureInput {
  private stroke: Stroke | null = null;
  private suppressMenuUntil = 0;
  private replaying = false;

  constructor(private readonly host: GestureHost, private readonly effects: Effects) {}

  pointerDown(e: PointerEvent): void {
    if (e.button !== 2 || e.pointerType !== 'mouse') return;
    this.suppressMenuUntil = 0;
    if (!this.host.enabled()) return;
    this.cancel();
    this.stroke = { points: [{ x: e.clientX, y: e.clientY }], moved: false, trail: null, pointerId: e.pointerId, menu: null };
  }

  pointerMove(e: PointerEvent): void {
    const s = this.stroke;
    if (!s || e.pointerId !== s.pointerId) return;
    if (!(e.buttons & 2)) {
      // Кнопку отпустили за пределами окна
      this.end(false);
      return;
    }
    const events = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
    for (const ev of events.length ? events : [e]) {
      if (s.points.length < MAX_POINTS) s.points.push({ x: ev.clientX, y: ev.clientY });
    }
    const start = s.points[0];
    if (!s.moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) > MOVE_THRESHOLD) {
      s.moved = true;
      s.trail = this.effects.trail(this.host.colors(), start.x, start.y);
      for (const p of s.points.slice(1)) s.trail.add(p.x, p.y);
      try {
        (e.target as Element).setPointerCapture?.(e.pointerId);
      } catch {
        // без захвата жест тоже работает, просто может прерваться над iframe
      }
    } else if (s.trail) {
      for (const p of s.points.slice(-Math.max(1, events.length))) s.trail.add(p.x, p.y);
    }
  }

  pointerUp(e: PointerEvent): void {
    if (e.button !== 2 || !this.stroke || e.pointerId !== this.stroke.pointerId) return;
    this.end(true);
  }

  contextMenu(e: MouseEvent): void {
    if (this.replaying) return;
    const s = this.stroke;
    if (s) {
      // Кнопка ещё зажата — значит, это macOS или Linux
      if (isEditable(e.target as Element)) {
        this.cancel();
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      s.menu = {
        target: e.target as EventTarget,
        init: {
          bubbles: true, cancelable: true, composed: true, view: e.view,
          clientX: e.clientX, clientY: e.clientY, screenX: e.screenX, screenY: e.screenY,
          button: 2, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: e.metaKey
        }
      };
      return;
    }
    // Меню после отпускания кнопки (Windows). Новое нажатие правой кнопки (buttons & 2) не трогаем.
    if (Date.now() < this.suppressMenuUntil && !(e.buttons & 2)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  cancel(): void {
    this.stroke?.trail?.cancel();
    this.stroke = null;
  }

  private end(released: boolean): void {
    const s = this.stroke;
    this.stroke = null;
    if (!s) return;
    if (s.moved) {
      this.suppressMenuUntil = Date.now() + 500;
      const result = released ? recognize(s.points) : null;
      s.trail?.finish(!!result);
      if (result) this.host.cast(result.spell, s.points[0]);
      return;
    }
    if (released && s.menu) {
      // Жеста не было — показываем отложенное меню
      this.replaying = true;
      try {
        s.menu.target.dispatchEvent(new MouseEvent('contextmenu', s.menu.init));
      } finally {
        this.replaying = false;
      }
    }
  }
}
