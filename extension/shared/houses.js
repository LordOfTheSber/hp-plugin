/*
 * Единый источник палитр факультетов.
 * Подключается и как обычный скрипт (content script / popup), и из Node (тесты).
 *
 * Каждая палитра имеет два режима:
 *   parchment — светлый «пергамент»;
 *   common    — тёмная «гостиная факультета».
 * Пары text/bg, muted/bg, link/bg, onPrimary/primary проверяются тестом на WCAG AA+.
 */
(function (root) {
  const HOUSES = {
    gryffindor: {
      id: 'gryffindor',
      animal: 'lion',
      element: 'fire',
      founder: 'Godric Gryffindor',
      motto: 'Their daring, nerve and chivalry set Gryffindors apart',
      palettes: {
        parchment: {
          bg: '#f6ecd6', surface: '#fbf5e6', text: '#2b1a12', muted: '#5e4636',
          primary: '#7f0909', onPrimary: '#fff4d6', accent: '#c9a227',
          link: '#8b1010', border: '#d9c39a'
        },
        common: {
          bg: '#1f0d0d', surface: '#2c1414', text: '#f3e6cf', muted: '#cbb79c',
          primary: '#e0b44a', onPrimary: '#2a0a0a', accent: '#b22222',
          link: '#f2c75c', border: '#5a2a22'
        }
      }
    },
    slytherin: {
      id: 'slytherin',
      animal: 'serpent',
      element: 'water',
      founder: 'Salazar Slytherin',
      motto: 'Those cunning folk use any means to achieve their ends',
      palettes: {
        parchment: {
          bg: '#eef1ea', surface: '#f8faf6', text: '#14241a', muted: '#46574b',
          primary: '#1a472a', onPrimary: '#eef3ef', accent: '#8a9597',
          link: '#1f5b35', border: '#c5cec6'
        },
        common: {
          bg: '#0d1a12', surface: '#14271b', text: '#e3e8e4', muted: '#a9b5ad',
          primary: '#c0c7c9', onPrimary: '#0d1a12', accent: '#2a7a4a',
          link: '#7fd09d', border: '#2c4636'
        }
      }
    },
    ravenclaw: {
      id: 'ravenclaw',
      animal: 'eagle',
      element: 'air',
      founder: 'Rowena Ravenclaw',
      motto: "Wit beyond measure is man's greatest treasure",
      palettes: {
        parchment: {
          bg: '#eef0f6', surface: '#f8f9fc', text: '#121a33', muted: '#45506e',
          primary: '#0e1a40', onPrimary: '#f1e3c8', accent: '#946b2d',
          link: '#1d3a8a', border: '#c9cfe0'
        },
        common: {
          bg: '#0b1026', surface: '#131b3a', text: '#e6e9f3', muted: '#a9b1cc',
          primary: '#cd9a52', onPrimary: '#0b1026', accent: '#5a74c4',
          link: '#9db4ff', border: '#2a3560'
        }
      }
    },
    hufflepuff: {
      id: 'hufflepuff',
      animal: 'badger',
      element: 'earth',
      founder: 'Helga Hufflepuff',
      motto: 'Hufflepuffs are true and unafraid of toil',
      palettes: {
        parchment: {
          bg: '#fbf3d9', surface: '#fffaea', text: '#241d14', muted: '#5b4b33',
          primary: '#372e29', onPrimary: '#f5d26a', accent: '#ecb939',
          link: '#7a5200', border: '#e3cf8f'
        },
        common: {
          bg: '#17140f', surface: '#231e15', text: '#f4ead2', muted: '#c4b28a',
          primary: '#f0c75e', onPrimary: '#1b160d', accent: '#ecb939',
          link: '#f5cf63', border: '#4a3d22'
        }
      }
    }
  };

  const HOUSE_IDS = Object.keys(HOUSES);

  const DEFAULT_SETTINGS = {
    enabled: true,
    house: 'gryffindor',
    mode: 'auto',          // 'parchment' | 'common' | 'auto' (по системной теме)
    intensity: 'full',     // 'accents' | 'full'
    readableFont: true,    // Literata для основного текста
    wandCursor: true,      // курсор-палочка (только в режиме full)
    disabledHosts: [],
    points: { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 },
    snitches: 0
  };

  // --- WCAG 2.x ---
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function relativeLuminance(rgb) {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrastRatio(a, b) {
    const la = relativeLuminance(typeof a === 'string' ? hexToRgb(a) : a);
    const lb = relativeLuminance(typeof b === 'string' ? hexToRgb(b) : b);
    const [hi, lo] = la > lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
  }

  const api = { HOUSES, HOUSE_IDS, DEFAULT_SETTINGS, hexToRgb, relativeLuminance, contrastRatio };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HP = Object.assign(root.HP || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this);
