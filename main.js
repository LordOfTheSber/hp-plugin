/* HP Theme для Obsidian. Сгенерировано из src/ — см. репозиторий. */
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => HpThemePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");
var obsidian = __toESM(require("obsidian"), 1);

// src/houses.ts
var HOUSES = {
  gryffindor: {
    id: "gryffindor",
    crest: { field: "#7f0909", metal: "#d3a625", letter: "G", ink: "#fff4d6" },
    palettes: {
      parchment: {
        bg: "#f6ecd6",
        surface: "#fbf5e6",
        text: "#2b1a12",
        muted: "#5e4636",
        primary: "#7f0909",
        onPrimary: "#fff4d6",
        accent: "#c9a227",
        link: "#8b1010",
        border: "#d9c39a"
      },
      common: {
        bg: "#1f0d0d",
        surface: "#2c1414",
        text: "#f3e6cf",
        muted: "#cbb79c",
        primary: "#e0b44a",
        onPrimary: "#2a0a0a",
        accent: "#b22222",
        link: "#f2c75c",
        border: "#5a2a22"
      }
    }
  },
  slytherin: {
    id: "slytherin",
    crest: { field: "#1a472a", metal: "#aab3b5", letter: "S", ink: "#eef3ef" },
    palettes: {
      parchment: {
        bg: "#eef1ea",
        surface: "#f8faf6",
        text: "#14241a",
        muted: "#46574b",
        primary: "#1a472a",
        onPrimary: "#eef3ef",
        accent: "#8a9597",
        link: "#1f5b35",
        border: "#c5cec6"
      },
      common: {
        bg: "#0d1a12",
        surface: "#14271b",
        text: "#e3e8e4",
        muted: "#a9b5ad",
        primary: "#c0c7c9",
        onPrimary: "#0d1a12",
        accent: "#2a7a4a",
        link: "#7fd09d",
        border: "#2c4636"
      }
    }
  },
  ravenclaw: {
    id: "ravenclaw",
    crest: { field: "#0e1a40", metal: "#946b2d", letter: "R", ink: "#f1e3c8" },
    palettes: {
      parchment: {
        bg: "#eef0f6",
        surface: "#f8f9fc",
        text: "#121a33",
        muted: "#45506e",
        primary: "#0e1a40",
        onPrimary: "#f1e3c8",
        accent: "#946b2d",
        link: "#1d3a8a",
        border: "#c9cfe0"
      },
      common: {
        bg: "#0b1026",
        surface: "#131b3a",
        text: "#e6e9f3",
        muted: "#a9b1cc",
        primary: "#cd9a52",
        onPrimary: "#0b1026",
        accent: "#5a74c4",
        link: "#9db4ff",
        border: "#2a3560"
      }
    }
  },
  hufflepuff: {
    id: "hufflepuff",
    crest: { field: "#372e29", metal: "#ecb939", letter: "H", ink: "#ecb939" },
    palettes: {
      parchment: {
        bg: "#fbf3d9",
        surface: "#fffaea",
        text: "#241d14",
        muted: "#5b4b33",
        primary: "#372e29",
        onPrimary: "#f5d26a",
        accent: "#ecb939",
        link: "#6e4900",
        border: "#e3cf8f"
      },
      common: {
        bg: "#17140f",
        surface: "#231e15",
        text: "#f4ead2",
        muted: "#c4b28a",
        primary: "#f0c75e",
        onPrimary: "#1b160d",
        accent: "#ecb939",
        link: "#f5cf63",
        border: "#4a3d22"
      }
    }
  }
};
var HOUSE_IDS = Object.keys(HOUSES);
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}
function mix(a, b, t) {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t));
}
function derive(p) {
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
function palette(house, mode) {
  return derive(HOUSES[house].palettes[mode]);
}

// src/crest.ts
var SHIELD = "M50 4L92 16V52C92 78 72 94 50 100C28 94 8 78 8 52V16Z";
function crestSvg(id, size = 40) {
  const c = HOUSES[id].crest;
  const clip = `hp-clip-${id}-${size}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.04)}" viewBox="0 0 100 104" aria-hidden="true"><defs><clipPath id="${clip}"><path d="${SHIELD}"/></clipPath></defs><path d="${SHIELD}" fill="${c.field}"/><path d="M8 22L92 92" stroke="${c.metal}" stroke-width="12" opacity=".45" clip-path="url(#${clip})"/><path d="${SHIELD}" fill="none" stroke="${c.metal}" stroke-width="6"/><text x="50" y="67" text-anchor="middle" font-family="'HP Forum', Georgia, serif" font-size="48" fill="${c.ink}">${c.letter}</text></svg>`;
}
function svgElement(markup) {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  return document.importNode(doc.documentElement, true);
}
var HAT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="110" viewBox="0 0 90 82" aria-hidden="true"><path d="M44 4c6 0 9 10 12 22 3 14 10 26 20 32H12c10-8 16-20 20-34 3-12 6-20 12-20z" fill="#6b4a2b"/><path d="M8 62c10-6 64-6 74 0-2 6-72 6-74 0z" fill="#4e3520"/><path d="M34 40c3 3 8 3 11 0M50 38c2 2 5 2 7 0" stroke="#2a1a0e" stroke-width="2" fill="none"/><path class="hp-hat-mouth" d="M36 50c6 3 14 3 20 0" stroke="#2a1a0e" stroke-width="2.2" fill="none"/></svg>';
var SNITCH_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="34" viewBox="0 0 64 34" aria-hidden="true"><g class="hp-wing hp-wing-l"><path d="M26 16C17 3 5 2 1 6c7 1 15 6 24 13z" fill="#fffdf5" stroke="#8a7440" stroke-width="1.1"/><path d="M24 13c-6-5-12-6-17-6M24 15c-5-3-10-4-15-3" stroke="#8a7440" stroke-width=".8" fill="none"/></g><g class="hp-wing hp-wing-r"><path d="M38 16C47 3 59 2 63 6c-7 1-15 6-24 13z" fill="#fffdf5" stroke="#8a7440" stroke-width="1.1"/><path d="M40 13c6-5 12-6 17-6M40 15c5-3 10-4 15-3" stroke="#8a7440" stroke-width=".8" fill="none"/></g><defs><radialGradient id="hp-snitch-gold" cx=".35" cy=".35"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#e8b923"/><stop offset="1" stop-color="#9a6f0c"/></radialGradient></defs><circle cx="32" cy="19" r="9" fill="url(#hp-snitch-gold)"/><path d="M24 18c5 3 11 3 16 0" stroke="#8a620a" stroke-width=".9" fill="none"/></svg>';
var FOOT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="26" viewBox="0 0 16 26" aria-hidden="true"><path d="M8 25c-3.6 0-5-3-4.6-7 .4-3.6.2-6.2-1-9C1.3 6.2 3 3 6.4 3c3.8 0 5.6 3 5.4 7-.2 3 .9 5.2 1.6 8 .9 3.8-1.4 7-5.4 7z" fill="currentColor"/><circle cx="4" cy="1.6" r="1.4" fill="currentColor"/><circle cx="7.4" cy="1" r="1.3" fill="currentColor"/><circle cx="10.6" cy="1.6" r="1.2" fill="currentColor"/></svg>';

// src/i18n.ts
var en = {
  pluginName: "HP Theme",
  house_gryffindor: "Gryffindor",
  house_slytherin: "Slytherin",
  house_ravenclaw: "Ravenclaw",
  house_hufflepuff: "Hufflepuff",
  houseShout_gryffindor: "GRYFFINDOR!",
  houseShout_slytherin: "SLYTHERIN!",
  houseShout_ravenclaw: "RAVENCLAW!",
  houseShout_hufflepuff: "HUFFLEPUFF!",
  settingsIntro: "Parchment is used with the light base theme, the common room with the dark one (Settings \u2192 Appearance).",
  settingReadableFont: "Literata for notes",
  settingReadableFontDesc: "A typeface designed for reading on screens, with Cyrillic. Your own font from Appearance settings still wins.",
  settingHeadingFont: "Forum for headings",
  settingHeadingFontDesc: "A classical roman for headings and the note title.",
  settingOrnaments: "Ornaments",
  settingOrnamentsDesc: "Golden thread under the note title, \u2726 dividers, accents on the active tab and file.",
  settingWandCursor: "Magic wand cursor",
  settingWandCursorDesc: "Outside the note text, which keeps the usual text cursor.",
  settingStatusBar: "House and points in the status bar",
  settingEasterEggs: "Magic",
  settingEasterEggsDesc: "Words have power\u2026",
  settingSortingHat: "Sorting Hat",
  settingPoints: "{0} points: {1}",
  buttonSortingHat: "Put on the Hat",
  motto: "Draco dormiens nunquam titillandus",
  mottoTranslation: "Never tickle a sleeping dragon",
  commandChooseHouse: "Choose house",
  commandSortingHat: "Sorting Hat",
  commandWand: "Wave your wand\u2026",
  commandToggle: "Toggle Hogwarts theme",
  ribbonTitle: "Hogwarts houses",
  menuSettings: "Theme settings",
  statusTitle: "Snitches caught: {0}",
  hat1: "Hmm. Difficult. Very difficult\u2026",
  hat2: "Plenty of courage, I see. Not a bad mind either\u2026",
  hat3: "There's talent, oh yes, and a thirst to prove yourself\u2026",
  hat4: "So where shall I put you?..",
  wandTitle: "Wave your wand",
  wandPlaceholder: "Say the incantation",
  wandHint: "Say the incantation and press Enter",
  wandFail: "Nothing happens. Perhaps it was the wrong wand movement?",
  wandOff: "Magic is switched off in the plugin settings.",
  eggLumos: "Lumos! Let there be light.",
  eggNox: "Nox. Welcome to the common room.",
  eggMap1: "Messrs Moony, Wormtail, Padfoot and Prongs",
  eggMap2: "are proud to present",
  eggMapTitle: "The Marauder's Map",
  eggMischief: "Mischief managed. The theme returns after a solemn oath \u2014 or a restart.",
  eggSnitch: "+{0} points to {1}! The Snitch is caught.",
  eggSnitchLabel: "The Golden Snitch \u2014 catch it!",
  eggBirthday: "July 31st \u2014 happy birthday, Harry! Hagrid is bringing a (slightly squashed) cake."
};
var ru = {
  pluginName: "HP Theme",
  house_gryffindor: "\u0413\u0440\u0438\u0444\u0444\u0438\u043D\u0434\u043E\u0440",
  house_slytherin: "\u0421\u043B\u0438\u0437\u0435\u0440\u0438\u043D",
  house_ravenclaw: "\u041A\u043E\u0433\u0442\u0435\u0432\u0440\u0430\u043D",
  house_hufflepuff: "\u041F\u0443\u0444\u0444\u0435\u043D\u0434\u0443\u0439",
  houseShout_gryffindor: "\u0413\u0420\u0418\u0424\u0424\u0418\u041D\u0414\u041E\u0420!",
  houseShout_slytherin: "\u0421\u041B\u0418\u0417\u0415\u0420\u0418\u041D!",
  houseShout_ravenclaw: "\u041A\u041E\u0413\u0422\u0415\u0412\u0420\u0410\u041D!",
  houseShout_hufflepuff: "\u041F\u0423\u0424\u0424\u0415\u041D\u0414\u0423\u0419!",
  settingsIntro: "\u041F\u0435\u0440\u0433\u0430\u043C\u0435\u043D\u0442 \u2014 \u0441\u043E \u0441\u0432\u0435\u0442\u043B\u043E\u0439 \u0431\u0430\u0437\u043E\u0432\u043E\u0439 \u0442\u0435\u043C\u043E\u0439, \u0433\u043E\u0441\u0442\u0438\u043D\u0430\u044F \u2014 \u0441 \u0442\u0451\u043C\u043D\u043E\u0439 (\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u2192 \u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435).",
  settingReadableFont: "\u0428\u0440\u0438\u0444\u0442 \u0437\u0430\u043C\u0435\u0442\u043E\u043A Literata",
  settingReadableFontDesc: "\u0428\u0440\u0438\u0444\u0442 \u0434\u043B\u044F \u0447\u0442\u0435\u043D\u0438\u044F \u0441 \u044D\u043A\u0440\u0430\u043D\u0430, \u0441 \u043A\u0438\u0440\u0438\u043B\u043B\u0438\u0446\u0435\u0439. \u0421\u0432\u043E\u0439 \u0448\u0440\u0438\u0444\u0442 \u0438\u0437 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F \u043F\u043E-\u043F\u0440\u0435\u0436\u043D\u0435\u043C\u0443 \u0432\u0430\u0436\u043D\u0435\u0435.",
  settingHeadingFont: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438 Forum",
  settingHeadingFontDesc: "\u041A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0430\u043D\u0442\u0438\u043A\u0432\u0430 \u0434\u043B\u044F \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u0432 \u0438 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F \u0437\u0430\u043C\u0435\u0442\u043A\u0438.",
  settingOrnaments: "\u041E\u0440\u043D\u0430\u043C\u0435\u043D\u0442\u044B",
  settingOrnamentsDesc: "\u0417\u043E\u043B\u043E\u0442\u0430\u044F \u043D\u0438\u0442\u044C \u043F\u043E\u0434 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C \u0437\u0430\u043C\u0435\u0442\u043A\u0438, \u0440\u0430\u0437\u0434\u0435\u043B\u0438\u0442\u0435\u043B\u0438 \u2726, \u0430\u043A\u0446\u0435\u043D\u0442\u044B \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u0432\u043A\u043B\u0430\u0434\u043A\u0438 \u0438 \u0444\u0430\u0439\u043B\u0430.",
  settingWandCursor: "\u041A\u0443\u0440\u0441\u043E\u0440 \u2014 \u0432\u043E\u043B\u0448\u0435\u0431\u043D\u0430\u044F \u043F\u0430\u043B\u043E\u0447\u043A\u0430",
  settingWandCursorDesc: "\u0412\u043D\u0435 \u0442\u0435\u043A\u0441\u0442\u0430 \u0437\u0430\u043C\u0435\u0442\u043A\u0438: \u0442\u0430\u043C \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u043A\u0443\u0440\u0441\u043E\u0440.",
  settingStatusBar: "\u0424\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442 \u0438 \u043E\u0447\u043A\u0438 \u0432 \u0441\u0442\u0430\u0442\u0443\u0441-\u0431\u0430\u0440\u0435",
  settingEasterEggs: "\u041C\u0430\u0433\u0438\u044F",
  settingEasterEggsDesc: "\u0421\u043B\u043E\u0432\u0430 \u0438\u043C\u0435\u044E\u0442 \u0441\u0438\u043B\u0443\u2026",
  settingSortingHat: "\u0420\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u044E\u0449\u0430\u044F \u0448\u043B\u044F\u043F\u0430",
  settingPoints: "\u041E\u0447\u043A\u0438 \u0444\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442\u0430 {0}: {1}",
  buttonSortingHat: "\u041D\u0430\u0434\u0435\u0442\u044C \u0448\u043B\u044F\u043F\u0443",
  motto: "Draco dormiens nunquam titillandus",
  mottoTranslation: "\u041D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u0449\u0435\u043A\u043E\u0447\u0438 \u0441\u043F\u044F\u0449\u0435\u0433\u043E \u0434\u0440\u0430\u043A\u043E\u043D\u0430",
  commandChooseHouse: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0444\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442",
  commandSortingHat: "\u0420\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u044E\u0449\u0430\u044F \u0448\u043B\u044F\u043F\u0430",
  commandWand: "\u0412\u0437\u043C\u0430\u0445\u043D\u0443\u0442\u044C \u043F\u0430\u043B\u043E\u0447\u043A\u043E\u0439\u2026",
  commandToggle: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C/\u0432\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0442\u0435\u043C\u0443 \u0425\u043E\u0433\u0432\u0430\u0440\u0442\u0441\u0430",
  ribbonTitle: "\u0424\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442\u044B \u0425\u043E\u0433\u0432\u0430\u0440\u0442\u0441\u0430",
  menuSettings: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0442\u0435\u043C\u044B",
  statusTitle: "\u041F\u043E\u0439\u043C\u0430\u043D\u043E \u0441\u043D\u0438\u0442\u0447\u0435\u0439: {0}",
  hat1: "\u0425\u043C\u2026 \u043D\u0435\u043F\u0440\u043E\u0441\u0442\u043E. \u041E\u0447\u0435\u043D\u044C \u043D\u0435\u043F\u0440\u043E\u0441\u0442\u043E\u2026",
  hat2: "\u0412\u0438\u0436\u0443 \u043D\u0435\u043C\u0430\u043B\u043E \u0441\u043C\u0435\u043B\u043E\u0441\u0442\u0438. \u0418 \u0443\u043C \u043D\u0435\u043F\u043B\u043E\u0445\u2026",
  hat3: "\u0415\u0441\u0442\u044C \u0442\u0430\u043B\u0430\u043D\u0442, \u043E \u0434\u0430, \u0438 \u0436\u0430\u0436\u0434\u0430 \u043F\u0440\u043E\u044F\u0432\u0438\u0442\u044C \u0441\u0435\u0431\u044F\u2026",
  hat4: "\u0422\u0430\u043A \u043A\u0443\u0434\u0430 \u0436\u0435 \u043C\u043D\u0435 \u0442\u0435\u0431\u044F \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C?..",
  wandTitle: "\u0412\u0437\u043C\u0430\u0445\u043D\u0443\u0442\u044C \u043F\u0430\u043B\u043E\u0447\u043A\u043E\u0439",
  wandPlaceholder: "\u041F\u0440\u043E\u0438\u0437\u043D\u0435\u0441\u0438\u0442\u0435 \u0437\u0430\u043A\u043B\u0438\u043D\u0430\u043D\u0438\u0435",
  wandHint: "\u041F\u0440\u043E\u0438\u0437\u043D\u0435\u0441\u0438\u0442\u0435 \u0437\u0430\u043A\u043B\u0438\u043D\u0430\u043D\u0438\u0435 \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 Enter",
  wandFail: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u043E. \u041C\u043E\u0436\u0435\u0442, \u043F\u0430\u043B\u043E\u0447\u043A\u043E\u0439 \u0432\u0437\u043C\u0430\u0445\u043D\u0443\u043B\u0438 \u043D\u0435 \u0442\u0430\u043A?",
  wandOff: "\u041C\u0430\u0433\u0438\u044F \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0430 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u043F\u043B\u0430\u0433\u0438\u043D\u0430.",
  eggLumos: "Lumos! \u0414\u0430 \u0431\u0443\u0434\u0435\u0442 \u0441\u0432\u0435\u0442.",
  eggNox: "Nox. \u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432 \u0433\u043E\u0441\u0442\u0438\u043D\u0443\u044E.",
  eggMap1: "\u0413\u043E\u0441\u043F\u043E\u0434\u0430 \u041B\u0443\u043D\u0430\u0442\u0438\u043A, \u0425\u0432\u043E\u0441\u0442, \u0411\u0440\u043E\u0434\u044F\u0433\u0430 \u0438 \u0421\u043E\u0445\u0430\u0442\u044B\u0439",
  eggMap2: "\u0441 \u0433\u043E\u0440\u0434\u043E\u0441\u0442\u044C\u044E \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u044F\u044E\u0442",
  eggMapTitle: "\u041A\u0430\u0440\u0442\u0443 \u041C\u0430\u0440\u043E\u0434\u0451\u0440\u043E\u0432",
  eggMischief: "\u0428\u0430\u043B\u043E\u0441\u0442\u044C \u0443\u0434\u0430\u043B\u0430\u0441\u044C. \u0422\u0435\u043C\u0430 \u0432\u0435\u0440\u043D\u0451\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043A\u043B\u044F\u0442\u0432\u044B \u2014 \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u043A\u0430.",
  eggSnitch: "+{0} \u043E\u0447\u043A\u043E\u0432 \u0444\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442\u0443 {1}! \u0421\u043D\u0438\u0442\u0447 \u043F\u043E\u0439\u043C\u0430\u043D.",
  eggSnitchLabel: "\u0417\u043E\u043B\u043E\u0442\u043E\u0439 \u0441\u043D\u0438\u0442\u0447 \u2014 \u043F\u043E\u0439\u043C\u0430\u0439 \u0435\u0433\u043E!",
  eggBirthday: "31 \u0438\u044E\u043B\u044F \u2014 \u0441 \u0434\u043D\u0451\u043C \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F, \u0413\u0430\u0440\u0440\u0438! \u0425\u0430\u0433\u0440\u0438\u0434 \u0443\u0436\u0435 \u043D\u0435\u0441\u0451\u0442 \u0442\u043E\u0440\u0442 (\u0441\u043B\u0435\u0433\u043A\u0430 \u043F\u043E\u043C\u044F\u0442\u044B\u0439)."
};
function createTranslator(language) {
  const dict = language.toLowerCase().startsWith("ru") ? ru : en;
  return (key, ...args) => dict[key].replace(/\{(\d+)\}/g, (m, i) => String(args[Number(i)] ?? m));
}

// src/spells.ts
var SPELLS = [
  { id: "solemnlySwear", words: ["i solemnly swear that i am up to no good", "solemnly swear", "\u043A\u043B\u044F\u043D\u0443\u0441\u044C \u0447\u0442\u043E \u0437\u0430\u043C\u044B\u0448\u043B\u044F\u044E \u0442\u043E\u043B\u044C\u043A\u043E \u0448\u0430\u043B\u043E\u0441\u0442\u044C"] },
  { id: "mischiefManaged", words: ["mischief managed", "\u0448\u0430\u043B\u043E\u0441\u0442\u044C \u0443\u0434\u0430\u043B\u0430\u0441\u044C"] },
  { id: "accioSnitch", words: ["accio snitch", "\u0430\u043A\u0446\u0438\u043E \u0441\u043D\u0438\u0442\u0447"] },
  { id: "lumos", words: ["lumos", "\u043B\u044E\u043C\u043E\u0441"] },
  { id: "nox", words: ["nox", "\u043D\u043E\u043A\u0441"] }
];
var KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
var KONAMI_ALIASES = { "\u0438": "b", "\u0444": "a" };
var MAX_BUFFER = 48;
function normalize(phrase) {
  return phrase.toLowerCase().replace(/ё/g, "\u0435").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
function parseIncantation(phrase) {
  const text = normalize(phrase);
  for (const spell of SPELLS) {
    if (spell.words.includes(text)) return spell.id;
  }
  return null;
}
function createSpellbook() {
  let text = "";
  let keys = [];
  return {
    push(key) {
      if (typeof key !== "string") return null;
      const k = key.toLowerCase();
      keys.push(KONAMI_ALIASES[k] ?? k);
      if (keys.length > KONAMI.length) keys.shift();
      if (keys.length === KONAMI.length && keys.every((x, i) => x === KONAMI[i])) {
        keys = [];
        text = "";
        return "accioSnitch";
      }
      if ([...k].length !== 1) return null;
      const ch = /[\p{L}\p{N}]/u.test(k) ? k === "\u0451" ? "\u0435" : k : " ";
      if (ch === " " && (text === "" || text.endsWith(" "))) return null;
      text = (text + ch).slice(-MAX_BUFFER);
      for (const spell of SPELLS) {
        for (const w of spell.words) {
          if (text.endsWith(w) && isWordStart(text, w)) {
            text = "";
            return spell.id;
          }
        }
      }
      return null;
    },
    reset() {
      text = "";
      keys = [];
    }
  };
}
function isWordStart(text, word) {
  const before = text.length - word.length - 1;
  return before < 0 || text[before] === " ";
}

// src/effects.ts
var rand = (min, max) => min + Math.random() * (max - min);
var Effects = class {
  constructor(reducedMotion) {
    this.reducedMotion = reducedMotion;
    this.layer = null;
    this.snitch = null;
    this.timers = /* @__PURE__ */ new Set();
    this.pointer = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
  }
  trackPointer(e) {
    this.pointer = { x: e.clientX, y: e.clientY };
  }
  destroy() {
    for (const id of this.timers) window.clearTimeout(id);
    this.timers.clear();
    this.layer?.remove();
    this.layer = null;
    this.snitch = null;
  }
  get snitchActive() {
    return this.snitch !== null;
  }
  // ---------- Lumos / Nox ----------
  lumos() {
    const size = 80;
    const glow = this.add("div", "hp-glow");
    glow.style.left = `${this.pointer.x - size / 2}px`;
    glow.style.top = `${this.pointer.y - size / 2}px`;
    const scale = Math.hypot(window.innerWidth, window.innerHeight) / size * 2.2;
    this.removeAfter(glow.animate([
      { transform: "scale(.2)", opacity: 1 },
      { transform: `scale(${scale})`, opacity: 0.85, offset: 0.55 },
      { transform: `scale(${scale})`, opacity: 0 }
    ], { duration: this.reducedMotion() ? 400 : 1100, easing: "ease-out" }), glow);
  }
  nox() {
    const shade = this.add("div", "hp-shade");
    shade.style.background = `radial-gradient(circle at ${this.pointer.x}px ${this.pointer.y}px, rgba(0,0,0,0) 0, rgba(0,0,0,.92) 220px)`;
    this.removeAfter(shade.animate([
      { opacity: 0 },
      { opacity: 1, offset: 0.45 },
      { opacity: 1, offset: 0.6 },
      { opacity: 0 }
    ], { duration: this.reducedMotion() ? 500 : 1400, easing: "ease-in-out" }), shade);
  }
  /** Момент, когда экран темнее всего — в этот момент удобно переключить тему. */
  get noxSwitchDelay() {
    return this.reducedMotion() ? 200 : 600;
  }
  // ---------- Карта Мародёров ----------
  marauders(lines) {
    const card = this.add("div", "hp-map-card");
    for (const line of lines.slice(0, 2)) card.appendChild(document.createElement("div")).textContent = line;
    const title = card.appendChild(document.createElement("div"));
    title.className = "hp-map-title";
    title.textContent = lines[2];
    this.removeAfter(card.animate([
      { opacity: 0, filter: "blur(6px)" },
      { opacity: 1, filter: "blur(0)", offset: 0.18 },
      { opacity: 1, filter: "blur(0)", offset: 0.8 },
      { opacity: 0, filter: "blur(4px)" }
    ], { duration: 5200, easing: "ease-in-out" }), card);
    if (this.reducedMotion()) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
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
      const foot = this.add("div", "hp-footprint");
      foot.appendChild(svgElement(FOOT_SVG));
      foot.style.left = `${x - dy / len * side - 8}px`;
      foot.style.top = `${y + dx / len * side - 13}px`;
      foot.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI + 90}deg)`;
      this.removeAfter(foot.animate([
        { opacity: 0 },
        { opacity: 0.85, offset: 0.08 },
        { opacity: 0.85, offset: 0.55 },
        { opacity: 0 }
      ], { duration: 3e3, delay: i * 230, easing: "ease-out", fill: "both" }), foot);
    }
  }
  /** Лёгкое «чернильное» затемнение для «Шалость удалась». */
  inkFade() {
    const ink = this.add("div", "hp-shade");
    ink.style.background = "radial-gradient(circle, rgba(74,46,20,0) 30%, rgba(74,46,20,.35))";
    this.removeAfter(ink.animate([{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 1200 }), ink);
  }
  // ---------- Золотой снитч ----------
  releaseSnitch({ label, onCatch }) {
    if (this.snitch) return;
    const btn = this.add("button", "hp-snitch");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-label", label);
    btn.dataset.hpSnitch = "";
    btn.appendChild(svgElement(SNITCH_SVG));
    this.snitch = btn;
    const slow = this.reducedMotion() ? 2.5 : 1;
    if (!this.reducedMotion()) {
      for (const wing of Array.from(btn.querySelectorAll(".hp-wing"))) {
        wing.animate(
          [{ transform: "scaleY(1)" }, { transform: "scaleY(-.6)" }, { transform: "scaleY(1)" }],
          { duration: 90, iterations: Infinity }
        );
      }
    }
    let pos = { x: -70, y: rand(40, window.innerHeight - 80) };
    let current = null;
    let caught = false;
    const deadline = Date.now() + 25e3;
    const fly = () => {
      if (caught || !btn.isConnected) return;
      const leaving = Date.now() > deadline;
      const next = leaving ? { x: window.innerWidth + 90, y: rand(-60, window.innerHeight / 2) } : { x: rand(10, window.innerWidth - 80), y: rand(40, window.innerHeight - 60) };
      const hover = !leaving && Math.random() < 0.3 ? rand(350, 900) : 0;
      current = btn.animate([
        { transform: `translate(${pos.x}px, ${pos.y}px)` },
        { transform: `translate(${next.x}px, ${next.y}px)` }
      ], {
        duration: Math.max(260, Math.hypot(next.x - pos.x, next.y - pos.y) * 1.3) * slow,
        delay: hover,
        easing: "cubic-bezier(.45,.05,.35,1)",
        fill: "forwards"
      });
      pos = next;
      current.onfinish = () => {
        if (!leaving) return fly();
        btn.remove();
        this.snitch = null;
      };
    };
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (caught) return;
      caught = true;
      current?.pause();
      const box = btn.getBoundingClientRect();
      this.sparkle(box.left + box.width / 2, box.top + box.height / 2);
      this.removeAfter(btn.animate(
        [{ opacity: 1 }, { opacity: 0, transform: `translate(${box.left}px, ${box.top}px) scale(.3)` }],
        { duration: 400, fill: "forwards" }
      ), btn);
      this.snitch = null;
      onCatch();
    });
    fly();
  }
  sparkle(x, y) {
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * Math.PI * 2;
      const r = rand(40, 80);
      const dot = this.add("div", "hp-spark");
      dot.style.left = `${x - 3}px`;
      dot.style.top = `${y - 3}px`;
      if (i % 2) dot.style.background = "var(--hp-accent, #c9a227)";
      this.removeAfter(dot.animate([
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px) scale(.2)`, opacity: 0 }
      ], { duration: 700, easing: "ease-out" }), dot);
    }
  }
  // ---------- Служебное ----------
  getLayer() {
    if (this.layer?.isConnected) return this.layer;
    this.layer = document.createElement("div");
    this.layer.className = "hp-overlay";
    document.body.appendChild(this.layer);
    return this.layer;
  }
  add(tag, cls) {
    const el = document.createElement(tag);
    el.className = cls;
    this.getLayer().appendChild(el);
    return el;
  }
  removeAfter(animation, el) {
    animation.onfinish = () => el.remove();
  }
  later(fn, ms) {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);
    this.timers.add(id);
  }
};

// src/modals.ts
var import_obsidian = require("obsidian");
var SortingHatModal = class extends import_obsidian.Modal {
  constructor(app, t, isDark, onSorted) {
    super(app);
    this.t = t;
    this.isDark = isDark;
    this.onSorted = onSorted;
    this.cancelled = false;
  }
  onOpen() {
    this.modalEl.addClass("hp-hat-modal");
    const hat = this.contentEl.appendChild(svgElement(HAT_SVG));
    hat.classList.add("hp-hat-img");
    const text = this.contentEl.createEl("p", { cls: "hp-hat-text" });
    text.setAttribute("aria-live", "assertive");
    void this.run(text);
  }
  onClose() {
    this.cancelled = true;
    this.contentEl.empty();
  }
  // При «уменьшении движения» анимации отключает CSS, а паузы остаются: фразы нужно успеть прочитать.
  sleep(ms) {
    return new Promise((r) => window.setTimeout(r, ms));
  }
  async run(text) {
    const phrases = ["hat1", "hat2", "hat3", "hat4"].slice().sort(() => Math.random() - 0.5).slice(0, 3);
    for (const key of phrases) {
      text.setText(this.t(key));
      await this.sleep(1100);
      if (this.cancelled) return;
    }
    const house = HOUSE_IDS[Math.floor(Math.random() * HOUSE_IDS.length)];
    text.addClass("hp-verdict");
    text.style.setProperty("--hp-verdict-color", palette(house, this.isDark ? "common" : "parchment").primary);
    text.setText(this.t(`houseShout_${house}`));
    this.onSorted(house);
    await this.sleep(1600);
    if (!this.cancelled) this.close();
  }
};
var WandModal = class extends import_obsidian.Modal {
  constructor(app, t, onCast) {
    super(app);
    this.t = t;
    this.onCast = onCast;
  }
  onOpen() {
    this.titleEl.setText(this.t("wandTitle"));
    this.titleEl.addClass("hp-display");
    const input = this.contentEl.createEl("input", {
      cls: "hp-wand-input",
      attr: { type: "text", placeholder: this.t("wandPlaceholder"), "aria-label": this.t("wandPlaceholder") }
    });
    this.contentEl.createEl("p", { cls: "hp-wand-hint", text: this.t("wandHint") });
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || e.isComposing) return;
      e.preventDefault();
      const phrase = input.value;
      this.close();
      this.onCast(phrase);
    });
    window.setTimeout(() => input.focus(), 0);
  }
  onClose() {
    this.contentEl.empty();
  }
};
var HouseSuggestModal = class extends import_obsidian.FuzzySuggestModal {
  constructor(app, t, onChoose) {
    super(app);
    this.t = t;
    this.onChoose = onChoose;
    this.setPlaceholder(t("commandChooseHouse"));
  }
  getItems() {
    return HOUSE_IDS;
  }
  getItemText(house) {
    return this.t(`house_${house}`);
  }
  renderSuggestion(match, el) {
    el.addClass("hp-house-suggestion");
    const icon = el.createSpan({ cls: "hp-menu-crest" });
    icon.appendChild(svgElement(crestSvg(match.item, 18)));
    el.createSpan({ text: " " + this.getItemText(match.item) });
  }
  onChooseItem(house) {
    this.onChoose(house);
  }
};

// src/settings.ts
var import_obsidian2 = require("obsidian");

// src/settings-data.ts
var DEFAULT_SETTINGS = {
  house: "gryffindor",
  readableFont: true,
  headingFont: true,
  ornaments: true,
  wandCursor: false,
  statusBar: true,
  easterEggs: true,
  points: { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 },
  snitches: 0,
  birthdayShown: ""
};
function migrateSettings(data) {
  const raw = data && typeof data === "object" ? data : {};
  const settings = { ...DEFAULT_SETTINGS, ...raw, points: { ...DEFAULT_SETTINGS.points, ...raw.points ?? {} } };
  if (!HOUSE_IDS.includes(settings.house)) settings.house = DEFAULT_SETTINGS.house;
  return settings;
}

// src/settings.ts
var HpSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.clicks = [];
  }
  display() {
    const { containerEl } = this;
    const { t, settings } = this.plugin;
    containerEl.empty();
    const header = containerEl.createDiv({ cls: "hp-settings-header" });
    const crest = header.createDiv({ cls: "hp-crest" });
    crest.appendChild(svgElement(crestSvg(settings.house, 44)));
    header.createDiv({ cls: "hp-settings-title", text: t("pluginName") });
    const motto = containerEl.createDiv({ cls: "hp-motto" });
    motto.hide();
    motto.createDiv({ cls: "hp-motto-latin", text: t("motto") });
    motto.createDiv({ cls: "hp-motto-translation", text: t("mottoTranslation") });
    crest.addEventListener("click", () => {
      const now = Date.now();
      this.clicks = this.clicks.filter((x) => now - x < 700).concat(now);
      if (this.clicks.length < 3) return;
      this.clicks = [];
      motto.toggle(!motto.isShown());
    });
    const houses = containerEl.createDiv({ cls: "hp-houses", attr: { role: "radiogroup" } });
    for (const id of HOUSE_IDS) {
      const card = houses.createEl("button", {
        cls: "hp-house-card" + (id === settings.house ? " is-selected" : ""),
        attr: { type: "button", role: "radio", "aria-checked": String(id === settings.house), "data-house": id }
      });
      card.appendChild(svgElement(crestSvg(id, 36)));
      card.createSpan({ text: t(`house_${id}`) });
      card.addEventListener("click", async () => {
        await this.plugin.setHouse(id);
        this.display();
      });
    }
    containerEl.createEl("p", { cls: "setting-item-description", text: t("settingsIntro") });
    this.toggle("readableFont", t("settingReadableFont"), t("settingReadableFontDesc"));
    this.toggle("headingFont", t("settingHeadingFont"), t("settingHeadingFontDesc"));
    this.toggle("ornaments", t("settingOrnaments"), t("settingOrnamentsDesc"));
    this.toggle("wandCursor", t("settingWandCursor"), t("settingWandCursorDesc"));
    this.toggle("statusBar", t("settingStatusBar"));
    this.toggle("easterEggs", t("settingEasterEggs"), t("settingEasterEggsDesc"));
    new import_obsidian2.Setting(containerEl).setName(t("settingSortingHat")).setDesc(t("settingPoints", t(`house_${settings.house}`), settings.points[settings.house] ?? 0)).addButton((b) => b.setButtonText(t("buttonSortingHat")).setCta().onClick(() => this.plugin.openSortingHat(() => this.display())));
  }
  toggle(key, name, desc) {
    const setting = new import_obsidian2.Setting(this.containerEl).setName(name);
    if (desc) setting.setDesc(desc);
    setting.addToggle((tg) => tg.setValue(this.plugin.settings[key]).onChange(async (value) => {
      this.plugin.settings[key] = value;
      await this.plugin.saveSettings();
    }));
  }
};

// src/main.ts
var SNITCH_POINTS = 150;
var LIGHT_THEME = "moonstone";
var DARK_THEME = "obsidian";
function detectLanguage() {
  const getLanguage2 = obsidian.getLanguage;
  if (typeof getLanguage2 === "function") return getLanguage2();
  return window.localStorage.getItem("language") || "en";
}
var HpThemePlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.t = createTranslator("en");
    /** «Шалость удалась»: тема выключена до клятвы или перезапуска. */
    this.paused = false;
    this.statusEl = null;
    this.bodies = /* @__PURE__ */ new Set();
    this.spellbook = createSpellbook();
    this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  }
  async onload() {
    this.t = createTranslator(detectLanguage());
    await this.loadSettings();
    this.effects = new Effects(() => this.reducedMotionQuery.matches);
    this.bodies.add(document.body);
    this.registerEvent(this.app.workspace.on("window-open", (win) => {
      this.bodies.add(win.doc.body);
      this.applyTheme();
    }));
    this.registerEvent(this.app.workspace.on("window-close", (win) => {
      this.bodies.delete(win.doc.body);
    }));
    this.addSettingTab(new HpSettingTab(this.app, this));
    this.addRibbonIcon("wand", this.t("ribbonTitle"), (evt) => this.openHouseMenu(evt));
    this.statusEl = this.addStatusBarItem();
    this.statusEl.addClass("hp-status", "mod-clickable");
    this.registerDomEvent(this.statusEl, "click", (evt) => this.openHouseMenu(evt));
    this.addCommand({
      id: "choose-house",
      name: this.t("commandChooseHouse"),
      callback: () => new HouseSuggestModal(this.app, this.t, (h) => void this.setHouse(h)).open()
    });
    this.addCommand({ id: "sorting-hat", name: this.t("commandSortingHat"), callback: () => this.openSortingHat() });
    this.addCommand({ id: "wave-wand", name: this.t("commandWand"), callback: () => this.openWand() });
    this.addCommand({
      id: "toggle-theme",
      name: this.t("commandToggle"),
      callback: () => {
        this.paused = !this.paused;
        this.applyTheme();
      }
    });
    this.registerDomEvent(window, "keydown", (e) => this.onKeydown(e), true);
    this.registerDomEvent(window, "pointermove", (e) => this.effects.trackPointer(e), { passive: true });
    this.applyTheme();
    this.app.workspace.onLayoutReady(() => void this.birthday());
  }
  onunload() {
    this.effects?.destroy();
    for (const body of this.bodies) this.setBodyClasses(body, false);
  }
  // ---------- Настройки ----------
  async loadSettings() {
    this.settings = migrateSettings(await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.applyTheme();
  }
  async setHouse(house) {
    this.settings.house = house;
    await this.saveSettings();
  }
  // ---------- Тема ----------
  applyTheme() {
    for (const body of this.bodies) this.setBodyClasses(body, !this.paused);
    this.updateStatus();
  }
  setBodyClasses(body, on) {
    const s = this.settings;
    body.classList.toggle("hp-theme", on);
    for (const id of HOUSE_IDS) body.classList.toggle(`hp-house-${id}`, on && s.house === id);
    body.classList.toggle("hp-font-text", on && s.readableFont);
    body.classList.toggle("hp-font-headings", on && s.headingFont);
    body.classList.toggle("hp-ornaments", on && s.ornaments);
    body.classList.toggle("hp-wand", on && s.wandCursor);
  }
  updateStatus() {
    const el = this.statusEl;
    if (!el) return;
    const s = this.settings;
    el.toggle(s.statusBar && !this.paused);
    el.setText(`\u26A1 ${this.t(`house_${s.house}`)} \xB7 ${s.points[s.house] ?? 0}`);
    el.setAttribute("aria-label", this.t("statusTitle", s.snitches));
  }
  isDark() {
    return document.body.classList.contains("theme-dark");
  }
  /** Переключает базовую тему Obsidian (светлая/тёмная). API не публичное, поэтому с запасными путями. */
  setBaseTheme(theme) {
    const app = this.app;
    if (typeof app.setTheme === "function") {
      app.setTheme(theme);
      app.vault.setConfig?.("theme", theme);
    } else if (typeof app.changeTheme === "function") {
      app.changeTheme(theme);
    } else {
      for (const body of this.bodies) {
        body.classList.toggle("theme-dark", theme === DARK_THEME);
        body.classList.toggle("theme-light", theme === LIGHT_THEME);
      }
      this.app.workspace.trigger("css-change");
    }
  }
  // ---------- Меню, Шляпа, палочка ----------
  openHouseMenu(evt) {
    const menu = new import_obsidian3.Menu();
    for (const id of HOUSE_IDS) {
      menu.addItem((item) => {
        item.setTitle(this.t(`house_${id}`)).setIcon("shield").setChecked(id === this.settings.house).onClick(() => void this.setHouse(id));
        const dom = item.iconEl;
        if (dom) {
          dom.empty();
          dom.appendChild(svgElement(crestSvg(id, 16)));
        }
      });
    }
    menu.addSeparator();
    menu.addItem((item) => item.setTitle(this.t("commandSortingHat")).setIcon("graduation-cap").onClick(() => this.openSortingHat()));
    menu.addItem((item) => item.setTitle(this.t("menuSettings")).setIcon("settings").onClick(() => this.openSettings()));
    menu.showAtMouseEvent(evt);
  }
  openSortingHat(after) {
    new SortingHatModal(this.app, this.t, this.isDark(), (house) => {
      void this.setHouse(house).then(() => after?.());
    }).open();
  }
  openWand() {
    new WandModal(this.app, this.t, (phrase) => {
      if (!this.settings.easterEggs) {
        new import_obsidian3.Notice(this.t("wandOff"));
        return;
      }
      const spell = parseIncantation(phrase);
      if (spell) this.cast(spell);
      else new import_obsidian3.Notice(this.t("wandFail"));
    }).open();
  }
  openSettings() {
    const setting = this.app.setting;
    setting?.open();
    setting?.openTabById(this.manifest.id);
  }
  // ---------- Пасхалки ----------
  onKeydown(e) {
    if (!this.settings.easterEggs || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const target = e.composedPath()[0] ?? e.target;
    if (isEditable(target)) return;
    const spell = this.spellbook.push(e.key);
    if (spell) this.cast(spell);
  }
  cast(spell) {
    if (this.paused && spell !== "solemnlySwear") return;
    switch (spell) {
      case "lumos":
        this.effects.lumos();
        this.setBaseTheme(LIGHT_THEME);
        new import_obsidian3.Notice(this.t("eggLumos"));
        break;
      case "nox":
        this.effects.nox();
        this.effects.later(() => this.setBaseTheme(DARK_THEME), this.effects.noxSwitchDelay);
        new import_obsidian3.Notice(this.t("eggNox"));
        break;
      case "solemnlySwear":
        if (this.paused) {
          this.paused = false;
          this.applyTheme();
        }
        this.effects.marauders([this.t("eggMap1"), this.t("eggMap2"), this.t("eggMapTitle")]);
        break;
      case "mischiefManaged":
        this.effects.inkFade();
        new import_obsidian3.Notice(this.t("eggMischief"));
        this.effects.later(() => {
          this.paused = true;
          this.applyTheme();
        }, 500);
        break;
      case "accioSnitch":
        this.effects.releaseSnitch({ label: this.t("eggSnitchLabel"), onCatch: () => void this.awardSnitch() });
        break;
    }
  }
  async awardSnitch() {
    const house = this.settings.house;
    this.settings.points[house] = (this.settings.points[house] ?? 0) + SNITCH_POINTS;
    this.settings.snitches += 1;
    await this.saveSettings();
    new import_obsidian3.Notice(this.t("eggSnitch", SNITCH_POINTS, this.t(`house_${house}`)));
  }
  async birthday() {
    const now = /* @__PURE__ */ new Date();
    if (!this.settings.easterEggs || now.getMonth() !== 6 || now.getDate() !== 31) return;
    const year = String(now.getFullYear());
    if (this.settings.birthdayShown === year) return;
    this.settings.birthdayShown = year;
    await this.saveData(this.settings);
    new import_obsidian3.Notice(this.t("eggBirthday"), 1e4);
  }
};
function isEditable(el) {
  if (!el || el.nodeType !== 1) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag === "INPUT") return !/^(button|checkbox|radio|range|color|submit|reset|file|image)$/i.test(el.type);
  return !!el.closest('.cm-editor, [contenteditable="true"]');
}
