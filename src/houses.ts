/*
 * Единый источник цветов факультетов.
 *
 * У каждого факультета две палитры:
 *   parchment — для светлой темы Obsidian («Пергамент»);
 *   common    — для тёмной темы Obsidian («Гостиная факультета»).
 *
 * Базовые токены задаются руками, производные (фон боковых панелей и т.п.)
 * вычисляются смешиванием. Контраст всех пар «текст/фон» проверяет tests/houses.test.ts.
 */

export type HouseId = 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff';
export type Mode = 'parchment' | 'common';

export interface Palette {
  bg: string;        // фон заметки
  surface: string;   // карточки, поля, код
  text: string;
  muted: string;
  primary: string;   // заголовки, кнопки, акцент интерфейса
  onPrimary: string; // текст на primary
  accent: string;    // металл факультета — только линии и орнаменты, не текст
  link: string;
  border: string;
}

export interface DerivedPalette extends Palette {
  sidebar: string;     // боковые панели, заголовок окна, статус-бар
  sidebarAlt: string;  // лента (ribbon), активные элементы
  faint: string;       // самый бледный текст (плейсхолдеры, счётчики)
  hover: string;       // подсветка при наведении
  active: string;      // выбранный файл/пункт
  selection: string;   // выделение текста (поверх фона)
  highlight: string;   // ==маркер==
  primaryHover: string;
}

export interface House {
  id: HouseId;
  crest: { field: string; metal: string; letter: string; ink: string };
  palettes: Record<Mode, Palette>;
}

export const HOUSES: Record<HouseId, House> = {
  gryffindor: {
    id: 'gryffindor',
    crest: { field: '#7f0909', metal: '#d3a625', letter: 'G', ink: '#fff4d6' },
    palettes: {
      parchment: {
        bg: '#f6ecd6', surface: '#fbf5e6', text: '#2b1a12', muted: '#5e4636',
        primary: '#7f0909', onPrimary: '#fff4d6', accent: '#c9a227', link: '#8b1010', border: '#d9c39a'
      },
      common: {
        bg: '#1f0d0d', surface: '#2c1414', text: '#f3e6cf', muted: '#cbb79c',
        primary: '#e0b44a', onPrimary: '#2a0a0a', accent: '#b22222', link: '#f2c75c', border: '#5a2a22'
      }
    }
  },
  slytherin: {
    id: 'slytherin',
    crest: { field: '#1a472a', metal: '#aab3b5', letter: 'S', ink: '#eef3ef' },
    palettes: {
      parchment: {
        bg: '#eef1ea', surface: '#f8faf6', text: '#14241a', muted: '#46574b',
        primary: '#1a472a', onPrimary: '#eef3ef', accent: '#8a9597', link: '#1f5b35', border: '#c5cec6'
      },
      common: {
        bg: '#0d1a12', surface: '#14271b', text: '#e3e8e4', muted: '#a9b5ad',
        primary: '#c0c7c9', onPrimary: '#0d1a12', accent: '#2a7a4a', link: '#7fd09d', border: '#2c4636'
      }
    }
  },
  ravenclaw: {
    id: 'ravenclaw',
    crest: { field: '#0e1a40', metal: '#946b2d', letter: 'R', ink: '#f1e3c8' },
    palettes: {
      parchment: {
        bg: '#eef0f6', surface: '#f8f9fc', text: '#121a33', muted: '#45506e',
        primary: '#0e1a40', onPrimary: '#f1e3c8', accent: '#946b2d', link: '#1d3a8a', border: '#c9cfe0'
      },
      common: {
        bg: '#0b1026', surface: '#131b3a', text: '#e6e9f3', muted: '#a9b1cc',
        primary: '#cd9a52', onPrimary: '#0b1026', accent: '#5a74c4', link: '#9db4ff', border: '#2a3560'
      }
    }
  },
  hufflepuff: {
    id: 'hufflepuff',
    crest: { field: '#372e29', metal: '#ecb939', letter: 'H', ink: '#ecb939' },
    palettes: {
      parchment: {
        bg: '#fbf3d9', surface: '#fffaea', text: '#241d14', muted: '#5b4b33',
        primary: '#372e29', onPrimary: '#f5d26a', accent: '#ecb939', link: '#6e4900', border: '#e3cf8f'
      },
      common: {
        bg: '#17140f', surface: '#231e15', text: '#f4ead2', muted: '#c4b28a',
        primary: '#f0c75e', onPrimary: '#1b160d', accent: '#ecb939', link: '#f5cf63', border: '#4a3d22'
      }
    }
  }
};

export const HOUSE_IDS = Object.keys(HOUSES) as HouseId[];
export const MODES: Mode[] = ['parchment', 'common'];

// ---------- Цветовая арифметика ----------

export type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: Rgb): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

/** Смешивание в sRGB, как color-mix(in srgb, a (1-t), b t). */
export function mix(a: string, b: string, t: number): string {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t) as Rgb);
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function derive(p: Palette): DerivedPalette {
  return {
    ...p,
    sidebar: mix(p.bg, p.primary, 0.07),
    sidebarAlt: mix(p.bg, p.primary, 0.13),
    faint: mix(p.muted, p.bg, 0.2),
    hover: mix(p.bg, p.text, 0.08),
    active: mix(p.bg, p.primary, 0.18),
    selection: mix(p.bg, p.primary, 0.28),
    highlight: mix(p.bg, p.accent, 0.45),
    primaryHover: mix(p.primary, p.text, 0.18)
  };
}

export function palette(house: HouseId, mode: Mode): DerivedPalette {
  return derive(HOUSES[house].palettes[mode]);
}
