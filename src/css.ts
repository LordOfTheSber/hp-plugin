/*
 * Генерация CSS-переменных из токенов (src/houses.ts).
 * Результат вставляется в styles.css при сборке (scripts/build.mjs).
 */
import { HOUSE_IDS, MODES, palette, mix, hexToRgb } from './houses.ts';
import type { DerivedPalette, HouseId, Mode } from './houses.ts';

const OBSIDIAN_MODE: Record<Mode, string> = { parchment: 'theme-light', common: 'theme-dark' };

// Шкала --color-base-* Obsidian: от фона (00) к тексту (100).
const BASE_STEPS: [string, number][] = [
  ['00', 0], ['05', 0.015], ['10', 0.03], ['20', 0.05], ['25', 0.1], ['30', 0.14],
  ['35', 0.19], ['40', 0.28], ['50', 0.42], ['60', 0.58], ['70', 0.72], ['100', 1]
];

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export function houseVariables(p: DerivedPalette): Record<string, string> {
  const [h, s, l] = hexToHsl(p.primary);
  const vars: Record<string, string> = {
    '--hp-bg': p.bg,
    '--hp-surface': p.surface,
    '--hp-sidebar': p.sidebar,
    '--hp-sidebar-alt': p.sidebarAlt,
    '--hp-text': p.text,
    '--hp-muted': p.muted,
    '--hp-faint': p.faint,
    '--hp-primary': p.primary,
    '--hp-primary-hover': p.primaryHover,
    '--hp-on-primary': p.onPrimary,
    '--hp-accent': p.accent,
    '--hp-link': p.link,
    '--hp-border': p.border,
    '--hp-hover': p.hover,
    '--hp-active': p.active,
    '--hp-selection': p.selection,
    '--hp-highlight': p.highlight,
    '--hp-primary-rgb': hexToRgb(p.primary).join(', '),
    '--hp-accent-rgb': hexToRgb(p.accent).join(', '),
    '--accent-h': String(h),
    '--accent-s': `${s}%`,
    '--accent-l': `${l}%`
  };
  for (const [step, t] of BASE_STEPS) vars[`--color-base-${step}`] = step === '20' ? p.sidebar : mix(p.bg, p.text, t);
  return vars;
}

export function selectorFor(house: HouseId, mode: Mode): string {
  return `body.hp-theme.hp-house-${house}.${OBSIDIAN_MODE[mode]}`;
}

export function generateHouseCss(): string {
  const blocks: string[] = [];
  for (const house of HOUSE_IDS) {
    for (const mode of MODES) {
      const vars = houseVariables(palette(house, mode));
      const body = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
      blocks.push(`${selectorFor(house, mode)} {\n${body}\n}`);
    }
  }
  return blocks.join('\n\n');
}

/**
 * Свои названия «Запретной секции»: те же правила, что для встроенных в theme.css,
 * но селекторы зависят от настроек, поэтому CSS собирается на лету.
 */
export function restrictedCss(names: string[]): string {
  if (!names.length) return '';
  const quote = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ')}"`;
  const match = names.map((n) => `[data-path=${quote(n)}], [data-path$=${quote('/' + n)}]`).join(', ');
  const title = `body.hp-theme :is(.nav-folder-title, .tree-item-self):is(${match})`;
  const folder = (hover: string) => `body.hp-theme .nav-folder:has(> .nav-folder-title:is(${match}))${hover} > .nav-folder-children, ` +
    `body.hp-theme .tree-item:has(> .tree-item-self:is(${match}))${hover} > .tree-item-children`;
  return [
    `${title} { font-style: italic; color: var(--text-faint); }`,
    `${title} :is(.nav-folder-title-content, .tree-item-inner)::after { content: ' 🔒'; font-style: normal; }`,
    `${folder('')} { filter: blur(2.5px); opacity: 0.7; transition: filter 0.3s, opacity 0.3s; }`,
    `${folder(':hover')} { filter: none; opacity: 1; }`
  ].join('\n');
}
