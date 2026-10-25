import { HOUSES } from './houses.ts';
import type { HouseId } from './houses.ts';

const SHIELD = 'M50 4L92 16V52C92 78 72 94 50 100C28 94 8 78 8 52V16Z';

/** Счётчик для id маски: одинаковые гербы в одном документе не должны делить один clipPath. */
let crestSeq = 0;

/** Герб факультета: щит, перевязь и кайма в цвете металла, инициал. */
export function crestSvg(id: HouseId, size = 40): string {
  const c = HOUSES[id].crest;
  const clip = `hp-clip-${id}-${++crestSeq}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.04)}" viewBox="0 0 100 104" aria-hidden="true">` +
    `<defs><clipPath id="${clip}"><path d="${SHIELD}"/></clipPath></defs>` +
    `<path d="${SHIELD}" fill="${c.field}"/>` +
    `<path d="M8 22L92 92" stroke="${c.metal}" stroke-width="12" opacity=".45" clip-path="url(#${clip})"/>` +
    `<path d="${SHIELD}" fill="none" stroke="${c.metal}" stroke-width="6"/>` +
    `<text x="50" y="67" text-anchor="middle" font-family="'HP Forum', Georgia, serif" font-size="48" fill="${c.ink}">${c.letter}</text>` +
    '</svg>';
}

/** SVG-строка (только константы плагина) → DOM-узел без innerHTML. */
export function svgElement(markup: string): SVGElement {
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
  return document.importNode(doc.documentElement, true) as unknown as SVGElement;
}

export const HAT_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="110" viewBox="0 0 90 82" aria-hidden="true">' +
  '<path d="M44 4c6 0 9 10 12 22 3 14 10 26 20 32H12c10-8 16-20 20-34 3-12 6-20 12-20z" fill="#6b4a2b"/>' +
  '<path d="M8 62c10-6 64-6 74 0-2 6-72 6-74 0z" fill="#4e3520"/>' +
  '<path d="M34 40c3 3 8 3 11 0M50 38c2 2 5 2 7 0" stroke="#2a1a0e" stroke-width="2" fill="none"/>' +
  '<path class="hp-hat-mouth" d="M36 50c6 3 14 3 20 0" stroke="#2a1a0e" stroke-width="2.2" fill="none"/></svg>';

export const SNITCH_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="34" viewBox="0 0 64 34" aria-hidden="true">' +
  '<g class="hp-wing hp-wing-l"><path d="M26 16C17 3 5 2 1 6c7 1 15 6 24 13z" fill="#fffdf5" stroke="#8a7440" stroke-width="1.1"/>' +
  '<path d="M24 13c-6-5-12-6-17-6M24 15c-5-3-10-4-15-3" stroke="#8a7440" stroke-width=".8" fill="none"/></g>' +
  '<g class="hp-wing hp-wing-r"><path d="M38 16C47 3 59 2 63 6c-7 1-15 6-24 13z" fill="#fffdf5" stroke="#8a7440" stroke-width="1.1"/>' +
  '<path d="M40 13c6-5 12-6 17-6M40 15c5-3 10-4 15-3" stroke="#8a7440" stroke-width=".8" fill="none"/></g>' +
  '<defs><radialGradient id="hp-snitch-gold" cx=".35" cy=".35"><stop offset="0" stop-color="#fff3b0"/>' +
  '<stop offset=".5" stop-color="#e8b923"/><stop offset="1" stop-color="#9a6f0c"/></radialGradient></defs>' +
  '<circle cx="32" cy="19" r="9" fill="url(#hp-snitch-gold)"/><path d="M24 18c5 3 11 3 16 0" stroke="#8a620a" stroke-width=".9" fill="none"/></svg>';

export const FOOT_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="26" viewBox="0 0 16 26" aria-hidden="true">' +
  '<path d="M8 25c-3.6 0-5-3-4.6-7 .4-3.6.2-6.2-1-9C1.3 6.2 3 3 6.4 3c3.8 0 5.6 3 5.4 7-.2 3 .9 5.2 1.6 8 .9 3.8-1.4 7-5.4 7z" fill="currentColor"/>' +
  '<circle cx="4" cy="1.6" r="1.4" fill="currentColor"/><circle cx="7.4" cy="1" r="1.3" fill="currentColor"/>' +
  '<circle cx="10.6" cy="1.6" r="1.2" fill="currentColor"/></svg>';
