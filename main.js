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
  settingWandCursorDesc: "Your wand instead of the mouse pointer. The editor and text fields keep the text cursor, links keep the hand.",
  settingWand: "Wand",
  buttonWandShop: "Visit Ollivanders",
  settingGestures: "Spells by wand movement",
  settingGesturesDesc: "Hold the right mouse button, draw a figure and let go. Works when Magic is on.",
  spellbookTitle: "The Standard Book of Spells (spoilers!)",
  spell_lumos: "Lumos",
  spell_nox: "Nox",
  spell_wingardiumLeviosa: "Wingardium Leviosa",
  spell_accioSnitch: "Accio Snitch",
  spell_solemnlySwear: "I solemnly swear that I am up to no good",
  spell_mischiefManaged: "Mischief managed",
  gesture_lumos: "Raise the wand: a stroke upwards",
  gesture_nox: "Lower the wand: a stroke downwards",
  gesture_wingardiumLeviosa: "Swish and flick! Lifts whatever the wand points at",
  gesture_accioSnitch: "A circle \u2014 the Snitch is round",
  gesture_solemnlySwear: "The letter M, for Moony and friends",
  gesture_mischiefManaged: "Wipe the map clean: back and forth",
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
  commandWandShop: "Ollivanders: choose your wand",
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
  wandHintGestures: "Say the incantation and press Enter \u2014 or draw it with the right mouse button",
  wandFail: "Nothing happens. Perhaps it was the wrong wand movement?",
  wandOff: "Magic is switched off in the plugin settings.",
  shopTitle: "Ollivanders",
  shopQuote: "\u201CThe wand chooses the wizard.\u201D",
  shopCanon: "Famous wands",
  shopCustom: "Make your own",
  shopWood: "Wood",
  shopCore: "Core",
  shopLength: "Length",
  shopFlex: "Flexibility",
  shopHandle: "Handle",
  shopRandom: "Let the wand choose",
  shopCustomWand: "A wand of your very own",
  wandDescription: "{0}, {1}, {2}, {3}",
  lengthWhole: "{0} inches",
  lengthFraction: "{0} inches",
  wood_holly: "Holly",
  wood_vine: "Vine",
  wood_willow: "Willow",
  wood_elder: "Elder",
  wood_yew: "Yew",
  wood_hawthorn: "Hawthorn",
  wood_cherry: "Cherry",
  wood_ash: "Ash",
  wood_walnut: "Walnut",
  wood_hornbeam: "Hornbeam",
  wood_rosewood: "Rosewood",
  wood_cypress: "Cypress",
  wood_oak: "Oak",
  wood_ebony: "Ebony",
  wood_mahogany: "Mahogany",
  core_phoenix: "phoenix feather",
  core_dragon: "dragon heartstring",
  core_unicorn: "unicorn hair",
  core_thestral: "Thestral tail hair",
  core_veela: "Veela hair",
  flex_unyielding: "unyielding",
  flex_rigid: "rigid",
  flex_springy: "springy",
  flex_supple: "supple",
  flex_pliable: "pliable",
  flex_swishy: "swishy",
  handle_smooth: "Smooth",
  handle_ringed: "Ringed",
  handle_spiral: "Carved vine",
  handle_knotted: "Knotted",
  handle_claw: "Bone claw",
  handle_bulb: "Ball pommel",
  preset_harry: "Harry Potter",
  preset_hermione: "Hermione Granger",
  preset_ron: "Ron Weasley",
  preset_dumbledore: "Albus Dumbledore",
  preset_voldemort: "Lord Voldemort",
  preset_draco: "Draco Malfoy",
  preset_neville: "Neville Longbottom",
  preset_bellatrix: "Bellatrix Lestrange",
  preset_cedric: "Cedric Diggory",
  preset_lupin: "Remus Lupin",
  preset_fleur: "Fleur Delacour",
  preset_krum: "Viktor Krum",
  presetWand_harry: "Harry Potter's wand",
  presetWand_hermione: "Hermione Granger's wand",
  presetWand_ron: "Ron Weasley's wand",
  presetWand_dumbledore: "The Elder Wand, a Deathly Hallow",
  presetWand_voldemort: "Lord Voldemort's wand",
  presetWand_draco: "Draco Malfoy's wand",
  presetWand_neville: "Neville Longbottom's wand",
  presetWand_bellatrix: "Bellatrix Lestrange's wand",
  presetWand_cedric: "Cedric Diggory's wand",
  presetWand_lupin: "Remus Lupin's wand",
  presetWand_fleur: "Fleur Delacour's wand",
  presetWand_krum: "Viktor Krum's wand",
  eggLumos: "Lumos! Let there be light.",
  eggLeviosa: "Wingardium Leviosa! It's Levi-O-sa, not Levio-SA.",
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
  settingWandCursorDesc: "\u0412\u0430\u0448\u0430 \u043F\u0430\u043B\u043E\u0447\u043A\u0430 \u0432\u043C\u0435\u0441\u0442\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044F \u043C\u044B\u0448\u0438. \u0412 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0435 \u0438 \u043F\u043E\u043B\u044F\u0445 \u0432\u0432\u043E\u0434\u0430 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u043A\u0443\u0440\u0441\u043E\u0440, \u043D\u0430\u0434 \u0441\u0441\u044B\u043B\u043A\u0430\u043C\u0438 \u2014 \xAB\u0440\u0443\u043A\u0430\xBB.",
  settingWand: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430",
  buttonWandShop: "\u0412 \u043B\u0430\u0432\u043A\u0443 \u041E\u043B\u043B\u0438\u0432\u0430\u043D\u0434\u0435\u0440\u0430",
  settingGestures: "\u0417\u0430\u043A\u043B\u0438\u043D\u0430\u043D\u0438\u044F \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F\u043C\u0438 \u043F\u0430\u043B\u043E\u0447\u043A\u0438",
  settingGesturesDesc: "\u0417\u0430\u0436\u043C\u0438\u0442\u0435 \u043F\u0440\u0430\u0432\u0443\u044E \u043A\u043D\u043E\u043F\u043A\u0443 \u043C\u044B\u0448\u0438, \u043D\u0430\u0440\u0438\u0441\u0443\u0439\u0442\u0435 \u0444\u0438\u0433\u0443\u0440\u0443 \u0438 \u043E\u0442\u043F\u0443\u0441\u0442\u0438\u0442\u0435. \u0420\u0430\u0431\u043E\u0442\u0430\u0435\u0442, \u043A\u043E\u0433\u0434\u0430 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0430 \u043C\u0430\u0433\u0438\u044F.",
  spellbookTitle: "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u0430\u044F \u043A\u043D\u0438\u0433\u0430 \u0437\u0430\u043A\u043B\u0438\u043D\u0430\u043D\u0438\u0439 (\u0441\u043F\u043E\u0439\u043B\u0435\u0440\u044B!)",
  spell_lumos: "\u041B\u044E\u043C\u043E\u0441",
  spell_nox: "\u041D\u043E\u043A\u0441",
  spell_wingardiumLeviosa: "\u0412\u0438\u043D\u0433\u0430\u0440\u0434\u0438\u0443\u043C \u041B\u0435\u0432\u0438\u043E\u0441\u0430",
  spell_accioSnitch: "\u0410\u043A\u0446\u0438\u043E \u0441\u043D\u0438\u0442\u0447",
  spell_solemnlySwear: "\u041A\u043B\u044F\u043D\u0443\u0441\u044C, \u0447\u0442\u043E \u0437\u0430\u043C\u044B\u0448\u043B\u044F\u044E \u0442\u043E\u043B\u044C\u043A\u043E \u0448\u0430\u043B\u043E\u0441\u0442\u044C",
  spell_mischiefManaged: "\u0428\u0430\u043B\u043E\u0441\u0442\u044C \u0443\u0434\u0430\u043B\u0430\u0441\u044C",
  gesture_lumos: "\u041F\u043E\u0434\u043D\u044F\u0442\u044C \u043F\u0430\u043B\u043E\u0447\u043A\u0443: \u0448\u0442\u0440\u0438\u0445 \u0432\u0432\u0435\u0440\u0445",
  gesture_nox: "\u041E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043F\u0430\u043B\u043E\u0447\u043A\u0443: \u0448\u0442\u0440\u0438\u0445 \u0432\u043D\u0438\u0437",
  gesture_wingardiumLeviosa: "\u0412\u0437\u043C\u0430\u0445 \u0438 \u0449\u0435\u043B\u0447\u043E\u043A! \u041F\u043E\u0434\u043D\u0438\u043C\u0430\u0435\u0442 \u0442\u043E, \u043D\u0430 \u0447\u0442\u043E \u0443\u043A\u0430\u0437\u0430\u043B\u0430 \u043F\u0430\u043B\u043E\u0447\u043A\u0430",
  gesture_accioSnitch: "\u041A\u0440\u0443\u0433 \u2014 \u0441\u043D\u0438\u0442\u0447 \u0432\u0435\u0434\u044C \u043A\u0440\u0443\u0433\u043B\u044B\u0439",
  gesture_solemnlySwear: "\u0411\u0443\u043A\u0432\u0430 M \u2014 \u041C\u0430\u0440\u043E\u0434\u0451\u0440\u044B",
  gesture_mischiefManaged: "\u0421\u0442\u0435\u0440\u0435\u0442\u044C \u043A\u0430\u0440\u0442\u0443: \u0442\u0443\u0434\u0430-\u043E\u0431\u0440\u0430\u0442\u043D\u043E",
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
  commandWandShop: "\u041B\u0430\u0432\u043A\u0430 \u041E\u043B\u043B\u0438\u0432\u0430\u043D\u0434\u0435\u0440\u0430: \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u043F\u0430\u043B\u043E\u0447\u043A\u0443",
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
  wandHintGestures: "\u041F\u0440\u043E\u0438\u0437\u043D\u0435\u0441\u0438\u0442\u0435 \u0437\u0430\u043A\u043B\u0438\u043D\u0430\u043D\u0438\u0435 \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 Enter \u2014 \u0438\u043B\u0438 \u043D\u0430\u0440\u0438\u0441\u0443\u0439\u0442\u0435 \u0435\u0433\u043E \u043F\u0440\u0430\u0432\u043E\u0439 \u043A\u043D\u043E\u043F\u043A\u043E\u0439 \u043C\u044B\u0448\u0438",
  wandFail: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u043E. \u041C\u043E\u0436\u0435\u0442, \u043F\u0430\u043B\u043E\u0447\u043A\u043E\u0439 \u0432\u0437\u043C\u0430\u0445\u043D\u0443\u043B\u0438 \u043D\u0435 \u0442\u0430\u043A?",
  wandOff: "\u041C\u0430\u0433\u0438\u044F \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0430 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u043F\u043B\u0430\u0433\u0438\u043D\u0430.",
  shopTitle: "\u041B\u0430\u0432\u043A\u0430 \u041E\u043B\u043B\u0438\u0432\u0430\u043D\u0434\u0435\u0440\u0430",
  shopQuote: "\xAB\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u0432\u043E\u043B\u0448\u0435\u0431\u043D\u0438\u043A\u0430\xBB.",
  shopCanon: "\u0417\u043D\u0430\u043C\u0435\u043D\u0438\u0442\u044B\u0435 \u043F\u0430\u043B\u043E\u0447\u043A\u0438",
  shopCustom: "\u0421\u0432\u043E\u044F \u043F\u0430\u043B\u043E\u0447\u043A\u0430",
  shopWood: "\u0414\u0440\u0435\u0432\u0435\u0441\u0438\u043D\u0430",
  shopCore: "\u0421\u0435\u0440\u0434\u0446\u0435\u0432\u0438\u043D\u0430",
  shopLength: "\u0414\u043B\u0438\u043D\u0430",
  shopFlex: "\u0413\u0438\u0431\u043A\u043E\u0441\u0442\u044C",
  shopHandle: "\u0420\u0443\u043A\u043E\u044F\u0442\u044C",
  shopRandom: "\u041F\u0443\u0441\u0442\u044C \u043F\u0430\u043B\u043E\u0447\u043A\u0430 \u0432\u044B\u0431\u0435\u0440\u0435\u0442 \u0441\u0430\u043C\u0430",
  shopCustomWand: "\u0412\u0430\u0448\u0430 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u043F\u0430\u043B\u043E\u0447\u043A\u0430",
  wandDescription: "{0}, {1}, {2}, {3}",
  lengthWhole: "{0} \u0434\u044E\u0439\u043C\u043E\u0432",
  lengthFraction: "{0} \u0434\u044E\u0439\u043C\u0430",
  wood_holly: "\u041E\u0441\u0442\u0440\u043E\u043B\u0438\u0441\u0442",
  wood_vine: "\u0412\u0438\u043D\u043E\u0433\u0440\u0430\u0434\u043D\u0430\u044F \u043B\u043E\u0437\u0430",
  wood_willow: "\u0418\u0432\u0430",
  wood_elder: "\u0411\u0443\u0437\u0438\u043D\u0430",
  wood_yew: "\u0422\u0438\u0441",
  wood_hawthorn: "\u0411\u043E\u044F\u0440\u044B\u0448\u043D\u0438\u043A",
  wood_cherry: "\u0412\u0438\u0448\u043D\u044F",
  wood_ash: "\u042F\u0441\u0435\u043D\u044C",
  wood_walnut: "\u0413\u0440\u0435\u0446\u043A\u0438\u0439 \u043E\u0440\u0435\u0445",
  wood_hornbeam: "\u0413\u0440\u0430\u0431",
  wood_rosewood: "\u0420\u043E\u0437\u043E\u0432\u043E\u0435 \u0434\u0435\u0440\u0435\u0432\u043E",
  wood_cypress: "\u041A\u0438\u043F\u0430\u0440\u0438\u0441",
  wood_oak: "\u0414\u0443\u0431",
  wood_ebony: "\u0427\u0451\u0440\u043D\u043E\u0435 \u0434\u0435\u0440\u0435\u0432\u043E",
  wood_mahogany: "\u041A\u0440\u0430\u0441\u043D\u043E\u0435 \u0434\u0435\u0440\u0435\u0432\u043E",
  core_phoenix: "\u043F\u0435\u0440\u043E \u0444\u0435\u043D\u0438\u043A\u0441\u0430",
  core_dragon: "\u0441\u0435\u0440\u0434\u0435\u0447\u043D\u0430\u044F \u0436\u0438\u043B\u0430 \u0434\u0440\u0430\u043A\u043E\u043D\u0430",
  core_unicorn: "\u0432\u043E\u043B\u043E\u0441 \u0435\u0434\u0438\u043D\u043E\u0440\u043E\u0433\u0430",
  core_thestral: "\u0432\u043E\u043B\u043E\u0441 \u0438\u0437 \u0445\u0432\u043E\u0441\u0442\u0430 \u0444\u0435\u0441\u0442\u0440\u0430\u043B\u0430",
  core_veela: "\u0432\u043E\u043B\u043E\u0441 \u0432\u0435\u0439\u043B\u044B",
  flex_unyielding: "\u043D\u0435\u0441\u0433\u0438\u0431\u0430\u0435\u043C\u0430\u044F",
  flex_rigid: "\u0436\u0451\u0441\u0442\u043A\u0430\u044F",
  flex_springy: "\u0443\u043F\u0440\u0443\u0433\u0430\u044F",
  flex_supple: "\u0433\u0438\u0431\u043A\u0430\u044F",
  flex_pliable: "\u043F\u043E\u0434\u0430\u0442\u043B\u0438\u0432\u0430\u044F",
  flex_swishy: "\u0445\u043B\u0451\u0441\u0442\u043A\u0430\u044F",
  handle_smooth: "\u0413\u043B\u0430\u0434\u043A\u0430\u044F",
  handle_ringed: "\u0421 \u043A\u043E\u043B\u044C\u0446\u0430\u043C\u0438",
  handle_spiral: "\u0420\u0435\u0437\u043D\u0430\u044F \u043B\u043E\u0437\u0430",
  handle_knotted: "\u0423\u0437\u043B\u043E\u0432\u0430\u0442\u0430\u044F",
  handle_claw: "\u041A\u043E\u0441\u0442\u044F\u043D\u043E\u0439 \u043A\u043E\u0433\u043E\u0442\u044C",
  handle_bulb: "\u041D\u0430\u0432\u0435\u0440\u0448\u0438\u0435-\u0448\u0430\u0440",
  preset_harry: "\u0413\u0430\u0440\u0440\u0438 \u041F\u043E\u0442\u0442\u0435\u0440",
  preset_hermione: "\u0413\u0435\u0440\u043C\u0438\u043E\u043D\u0430 \u0413\u0440\u0435\u0439\u043D\u0434\u0436\u0435\u0440",
  preset_ron: "\u0420\u043E\u043D \u0423\u0438\u0437\u043B\u0438",
  preset_dumbledore: "\u0410\u043B\u044C\u0431\u0443\u0441 \u0414\u0430\u043C\u0431\u043B\u0434\u043E\u0440",
  preset_voldemort: "\u0412\u043E\u043B\u0430\u043D-\u0434\u0435-\u041C\u043E\u0440\u0442",
  preset_draco: "\u0414\u0440\u0430\u043A\u043E \u041C\u0430\u043B\u0444\u043E\u0439",
  preset_neville: "\u041D\u0435\u0432\u0438\u043B\u043B \u0414\u043E\u043B\u0433\u043E\u043F\u0443\u043F\u0441",
  preset_bellatrix: "\u0411\u0435\u043B\u043B\u0430\u0442\u0440\u0438\u0441\u0430 \u041B\u0435\u0441\u0442\u0440\u0435\u0439\u043D\u0434\u0436",
  preset_cedric: "\u0421\u0435\u0434\u0440\u0438\u043A \u0414\u0438\u0433\u0433\u043E\u0440\u0438",
  preset_lupin: "\u0420\u0438\u043C\u0443\u0441 \u041B\u044E\u043F\u0438\u043D",
  preset_fleur: "\u0424\u043B\u0451\u0440 \u0414\u0435\u043B\u0430\u043A\u0443\u0440",
  preset_krum: "\u0412\u0438\u043A\u0442\u043E\u0440 \u041A\u0440\u0430\u043C",
  presetWand_harry: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0413\u0430\u0440\u0440\u0438 \u041F\u043E\u0442\u0442\u0435\u0440\u0430",
  presetWand_hermione: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0413\u0435\u0440\u043C\u0438\u043E\u043D\u044B \u0413\u0440\u0435\u0439\u043D\u0434\u0436\u0435\u0440",
  presetWand_ron: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0420\u043E\u043D\u0430 \u0423\u0438\u0437\u043B\u0438",
  presetWand_dumbledore: "\u0411\u0443\u0437\u0438\u043D\u043D\u0430\u044F \u043F\u0430\u043B\u043E\u0447\u043A\u0430, \u0414\u0430\u0440 \u0421\u043C\u0435\u0440\u0442\u0438",
  presetWand_voldemort: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0412\u043E\u043B\u0430\u043D-\u0434\u0435-\u041C\u043E\u0440\u0442\u0430",
  presetWand_draco: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0414\u0440\u0430\u043A\u043E \u041C\u0430\u043B\u0444\u043E\u044F",
  presetWand_neville: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u041D\u0435\u0432\u0438\u043B\u043B\u0430 \u0414\u043E\u043B\u0433\u043E\u043F\u0443\u043F\u0441\u0430",
  presetWand_bellatrix: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0411\u0435\u043B\u043B\u0430\u0442\u0440\u0438\u0441\u044B \u041B\u0435\u0441\u0442\u0440\u0435\u0439\u043D\u0434\u0436",
  presetWand_cedric: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0421\u0435\u0434\u0440\u0438\u043A\u0430 \u0414\u0438\u0433\u0433\u043E\u0440\u0438",
  presetWand_lupin: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0420\u0438\u043C\u0443\u0441\u0430 \u041B\u044E\u043F\u0438\u043D\u0430",
  presetWand_fleur: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0424\u043B\u0451\u0440 \u0414\u0435\u043B\u0430\u043A\u0443\u0440",
  presetWand_krum: "\u041F\u0430\u043B\u043E\u0447\u043A\u0430 \u0412\u0438\u043A\u0442\u043E\u0440\u0430 \u041A\u0440\u0430\u043C\u0430",
  eggLumos: "Lumos! \u0414\u0430 \u0431\u0443\u0434\u0435\u0442 \u0441\u0432\u0435\u0442.",
  eggLeviosa: "\u0412\u0438\u043D\u0433\u0430\u0440\u0434\u0438\u0443\u043C \u041B\u0435\u0432\u0438\u043E\u0441\u0430! \u041B\u0435\u0432\u0438-\u041E-\u0441\u0430, \u0430 \u043D\u0435 \u041B\u0435\u0432\u0438\u043E-\u0421\u0410.",
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
  { id: "wingardiumLeviosa", words: ["wingardium leviosa", "\u0432\u0438\u043D\u0433\u0430\u0440\u0434\u0438\u0443\u043C \u043B\u0435\u0432\u0438\u043E\u0441\u0430"] },
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
var SVG_NS = "http://www.w3.org/2000/svg";
var rand = (min, max) => min + Math.random() * (max - min);
var LEVITATE_TARGETS = ".nav-file-title, .nav-folder-title, .tree-item-self, .workspace-tab-header, .side-dock-ribbon-action, .status-bar-item, .callout, .cm-line, .inline-title, p, li, h1, h2, h3, h4, h5, h6, blockquote, pre, img, table, .setting-item";
var Effects = class {
  constructor(reducedMotion) {
    this.reducedMotion = reducedMotion;
    this.layer = null;
    this.snitch = null;
    this.timers = /* @__PURE__ */ new Set();
    this.pointer = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
  }
  get pointerPosition() {
    return { ...this.pointer };
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
  // ---------- След палочки и Вингардиум Левиоса ----------
  trail(colors, x, y) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "hp-trail");
    svg.style.setProperty("--hp-trail-glow", colors.glow);
    svg.style.setProperty("--hp-trail-ink", colors.ink);
    const lines = ["hp-trail-glow", "hp-trail-core"].map((cls) => {
      const line = svg.appendChild(document.createElementNS(SVG_NS, "polyline"));
      line.setAttribute("class", cls);
      return line;
    });
    this.getLayer().appendChild(svg);
    let points = `${x},${y}`;
    let last = { x, y };
    const draw = () => lines.forEach((l) => l.setAttribute("points", points));
    draw();
    return {
      add: (px, py) => {
        last = { x: px, y: py };
        points += ` ${Math.round(px)},${Math.round(py)}`;
        draw();
      },
      finish: (success) => {
        if (success) this.sparkle(last.x, last.y, colors);
        else svg.classList.add("is-fizzled");
        this.removeAfter(svg.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: this.reducedMotion() ? 200 : success ? 700 : 450, easing: "ease-out", fill: "forwards" }
        ), svg);
      },
      cancel: () => svg.remove()
    };
  }
  levitate(x, y) {
    const hit = document.elementFromPoint(x, y);
    const target = hit?.closest(LEVITATE_TARGETS) ?? document.querySelector(".workspace-leaf.mod-active .view-content") ?? document.querySelector(".workspace");
    if (!target) return;
    const lift = this.reducedMotion() ? -4 : -16;
    const frames = this.reducedMotion() ? [{ transform: "translateY(0)" }, { transform: `translateY(${lift}px)`, offset: 0.3 }, { transform: `translateY(${lift}px)`, offset: 0.7 }, { transform: "translateY(0)" }] : [
      { transform: "translateY(0) rotate(0)" },
      { transform: `translateY(${lift}px) rotate(-1deg)`, offset: 0.2 },
      { transform: `translateY(${lift + 6}px) rotate(1deg)`, offset: 0.4 },
      { transform: `translateY(${lift}px) rotate(-1deg)`, offset: 0.6 },
      { transform: `translateY(${lift + 6}px) rotate(.5deg)`, offset: 0.8 },
      { transform: "translateY(0) rotate(0)" }
    ];
    target.animate(frames, { duration: this.reducedMotion() ? 1200 : 3200, easing: "ease-in-out", composite: "add" });
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
  sparkle(x, y, colors) {
    const dark = document.body.classList.contains("theme-dark");
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * Math.PI * 2;
      const r = rand(40, 80);
      const dot = this.add("div", "hp-spark");
      dot.style.left = `${x - 3}px`;
      dot.style.top = `${y - 3}px`;
      if (colors) {
        const c = i % 2 && !dark ? colors.ink : colors.glow;
        dot.style.background = c;
        dot.style.boxShadow = `0 0 8px ${c}`;
      } else if (i % 2) {
        dot.style.background = "var(--hp-accent, #c9a227)";
      }
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

// src/dom.ts
function isEditable(el) {
  if (!el || el.nodeType !== 1) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag === "INPUT") return !/^(button|checkbox|radio|range|color|submit|reset|file|image)$/i.test(el.type);
  return !!el.closest('.cm-editor, [contenteditable="true"]');
}

// src/gestures.ts
var N = 48;
var MIN_GESTURE_SIZE = 50;
var MATCH_THRESHOLD = 0.17;
var P = (x, y) => ({ x, y });
function circle(clockwise) {
  const out = [];
  for (let i = 0; i <= 32; i++) {
    const a = -Math.PI / 2 + (clockwise ? 1 : -1) * (i / 32) * Math.PI * 2;
    out.push(P(Math.cos(a), Math.sin(a)));
  }
  return out;
}
function quad(a, c, b, steps = 16) {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    out.push(P((1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y));
  }
  return out;
}
function wipe(passes, fromLeft) {
  const out = [];
  for (let i = 0; i <= passes; i++) out.push(P(i % 2 === 0 === fromLeft ? 0 : 1, i * 0.06));
  return out;
}
var GESTURES = [
  // Поднять палочку — свет, опустить — тьма. Прямую легко нарисовать случайно, поэтому допуск строже.
  { spell: "lumos", variants: [[P(0, 1), P(0, 0)]], threshold: 0.11 },
  { spell: "nox", variants: [[P(0, 0), P(0, 1)]], threshold: 0.11 },
  // «Взмах и щелчок»: плавная дуга и короткий резкий взмах вниз
  { spell: "wingardiumLeviosa", variants: [[...quad(P(0, 0), P(0.35, 0.95), P(0.8, 0.05)), P(0.7, 0.42)]] },
  // Снитч круглый — круг в любую сторону
  { spell: "accioSnitch", variants: [circle(true), circle(false)], anyRotation: true },
  // «M» — Мародёры (Moony, Wormtail, Padfoot, Prongs)
  { spell: "solemnlySwear", variants: [[P(0, 1), P(0, 0), P(0.5, 0.65), P(1, 0), P(1, 1)]] },
  // Стереть карту: туда-обратно
  { spell: "mischiefManaged", variants: [wipe(3, true), wipe(3, false), wipe(4, true), wipe(4, false), wipe(5, true), wipe(5, false)] }
];
function pathLength(points) {
  let d = 0;
  for (let i = 1; i < points.length; i++) d += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  return d;
}
function resample(points, n = N) {
  const step = pathLength(points) / (n - 1);
  if (step === 0) return Array.from({ length: n }, () => ({ ...points[0] }));
  const src = points.map((p) => ({ ...p }));
  const out = [{ ...src[0] }];
  let acc = 0;
  for (let i = 1; i < src.length; i++) {
    const a = src[i - 1];
    const b = src[i];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (acc + d >= step && d > 0) {
      const t = (step - acc) / d;
      const q = P(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y));
      out.push(q);
      src.splice(i, 0, q);
      acc = 0;
    } else {
      acc += d;
    }
  }
  while (out.length < n) out.push({ ...src[src.length - 1] });
  return out.slice(0, n);
}
function bounds(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { minX, minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
}
function normalize2(points) {
  const pts = resample(points);
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const { w, h } = bounds(pts);
  const k = 1 / (Math.max(w, h) || 1);
  return pts.map((p) => P((p.x - cx) * k, (p.y - cy) * k));
}
function alignStart(points) {
  const a = -Math.atan2(points[0].y, points[0].x);
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return points.map((p) => P(p.x * cos - p.y * sin, p.x * sin + p.y * cos));
}
function distance(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) d += Math.hypot(a[i].x - b[i].x, a[i].y - b[i].y);
  return d / a.length;
}
var TEMPLATES = GESTURES.flatMap((g) => g.variants.map((v) => {
  const points = normalize2(v);
  return {
    spell: g.spell,
    anyRotation: !!g.anyRotation,
    threshold: g.threshold ?? MATCH_THRESHOLD,
    points: g.anyRotation ? alignStart(points) : points
  };
}));
function recognize(stroke) {
  if (stroke.length < 5) return null;
  const box = bounds(stroke);
  if (Math.max(box.w, box.h) < MIN_GESTURE_SIZE) return null;
  const points = normalize2(stroke);
  const aligned = alignStart(points);
  let best = null;
  for (const t of TEMPLATES) {
    const score = distance(t.anyRotation ? aligned : points, t.points);
    if (!best || score < best.score) best = { spell: t.spell, score, threshold: t.threshold };
  }
  return best && best.score <= best.threshold ? { spell: best.spell, score: best.score } : null;
}
function gestureSvg(spell, size = 56) {
  const g = GESTURES.find((x) => x.spell === spell);
  if (!g) return "";
  const pts = g.variants[0];
  const { minX, minY, w, h } = bounds(pts);
  const pad = 8;
  const k = (size - pad * 2) / (Math.max(w, h) || 1);
  const ox = pad + (size - pad * 2 - w * k) / 2;
  const oy = pad + (size - pad * 2 - h * k) / 2;
  const map = (p) => P(ox + (p.x - minX) * k, oy + (p.y - minY) * k);
  const screen = pts.map(map);
  const f = (v) => String(Math.round(v * 10) / 10);
  const d = "M" + screen.map((p) => `${f(p.x)} ${f(p.y)}`).join("L");
  const end = screen[screen.length - 1];
  const prev = resample(screen, 24)[21];
  const ang = Math.atan2(end.y - prev.y, end.x - prev.x);
  const arrow = [ang + 2.6, ang - 2.6].map((a) => `${f(end.x + Math.cos(a) * 7)} ${f(end.y + Math.sin(a) * 7)}`);
  const start = screen[0];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M${arrow[0]}L${f(end.x)} ${f(end.y)}L${arrow[1]}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${f(start.x)}" cy="${f(start.y)}" r="3.6" style="fill: var(--hp-accent, currentColor)"/></svg>`;
}

// src/gesture-input.ts
var MOVE_THRESHOLD = 10;
var MAX_POINTS = 2e3;
var GestureInput = class {
  constructor(host, effects) {
    this.host = host;
    this.effects = effects;
    this.stroke = null;
    this.suppressMenuUntil = 0;
    this.replaying = false;
  }
  pointerDown(e) {
    if (e.button !== 2 || e.pointerType !== "mouse") return;
    this.suppressMenuUntil = 0;
    if (!this.host.enabled()) return;
    this.cancel();
    this.stroke = { points: [{ x: e.clientX, y: e.clientY }], moved: false, trail: null, pointerId: e.pointerId, menu: null };
  }
  pointerMove(e) {
    const s = this.stroke;
    if (!s || e.pointerId !== s.pointerId) return;
    if (!(e.buttons & 2)) {
      this.end(false);
      return;
    }
    const events = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
    for (const ev of events.length ? events : [e]) {
      if (s.points.length < MAX_POINTS) s.points.push({ x: ev.clientX, y: ev.clientY });
    }
    const start = s.points[0];
    if (!s.moved && Math.hypot(e.clientX - start.x, e.clientY - start.y) > MOVE_THRESHOLD) {
      s.moved = true;
      s.trail = this.effects.trail(this.host.colors(), start.x, start.y);
      for (const p of s.points.slice(1)) s.trail.add(p.x, p.y);
      try {
        e.target.setPointerCapture?.(e.pointerId);
      } catch {
      }
    } else if (s.trail) {
      for (const p of s.points.slice(-Math.max(1, events.length))) s.trail.add(p.x, p.y);
    }
  }
  pointerUp(e) {
    if (e.button !== 2 || !this.stroke || e.pointerId !== this.stroke.pointerId) return;
    this.end(true);
  }
  contextMenu(e) {
    if (this.replaying) return;
    const s = this.stroke;
    if (s) {
      if (isEditable(e.target)) {
        this.cancel();
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      s.menu = {
        target: e.target,
        init: {
          bubbles: true,
          cancelable: true,
          composed: true,
          view: e.view,
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          button: 2,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
          metaKey: e.metaKey
        }
      };
      return;
    }
    if (Date.now() < this.suppressMenuUntil && !(e.buttons & 2)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }
  cancel() {
    this.stroke?.trail?.cancel();
    this.stroke = null;
  }
  end(released) {
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
      this.replaying = true;
      try {
        s.menu.target.dispatchEvent(new MouseEvent("contextmenu", s.menu.init));
      } finally {
        this.replaying = false;
      }
    }
  }
};

// src/modals.ts
var import_obsidian = require("obsidian");

// src/wands.ts
var WOODS = {
  holly: { base: "#a8784a", light: "#d2a877", dark: "#5e3d21" },
  vine: { base: "#8a6a48", light: "#b89470", dark: "#4a3522" },
  willow: { base: "#b48a5a", light: "#dcb88a", dark: "#6e4f2e" },
  elder: { base: "#8f8576", light: "#bdb3a3", dark: "#4f463b" },
  yew: { base: "#d8cdb4", light: "#f3ecdc", dark: "#8e7f63" },
  hawthorn: { base: "#4e3527", light: "#7d5a45", dark: "#24170f" },
  cherry: { base: "#8c3f2b", light: "#b8674b", dark: "#4c1d12" },
  ash: { base: "#cdb48c", light: "#ecdcbc", dark: "#85704e" },
  walnut: { base: "#4a3021", light: "#765340", dark: "#22150d" },
  hornbeam: { base: "#b39b77", light: "#d8c4a2", dark: "#6b5a40" },
  rosewood: { base: "#7d3a2e", light: "#a8604f", dark: "#3f1813" },
  cypress: { base: "#a57348", light: "#cf9d70", dark: "#5c3c22" },
  oak: { base: "#8a6436", light: "#b48c5a", dark: "#4c3519" },
  ebony: { base: "#2b2320", light: "#554740", dark: "#110c0a" },
  mahogany: { base: "#6e2e1e", light: "#9a5240", dark: "#34120a" }
};
var CORES = {
  phoenix: { glow: "#ffb347", ink: "#b85f00" },
  dragon: { glow: "#ff6b4a", ink: "#b8321a" },
  unicorn: { glow: "#e6eeff", ink: "#5f6f9a" },
  thestral: { glow: "#9fb4d9", ink: "#475d8a" },
  veela: { glow: "#ffc4e1", ink: "#b04880" }
};
var WOOD_IDS = Object.keys(WOODS);
var CORE_IDS = Object.keys(CORES);
var FLEX_IDS = ["unyielding", "rigid", "springy", "supple", "pliable", "swishy"];
var HANDLE_IDS = ["smooth", "ringed", "spiral", "knotted", "claw", "bulb"];
var LENGTH_MIN = 8;
var LENGTH_MAX = 16;
var LENGTH_STEP = 0.25;
var WAND_PRESETS = [
  { id: "harry", wand: { wood: "holly", core: "phoenix", length: 11, flex: "supple", handle: "ringed" } },
  { id: "hermione", wand: { wood: "vine", core: "dragon", length: 10.75, flex: "supple", handle: "spiral" } },
  { id: "ron", wand: { wood: "willow", core: "unicorn", length: 14, flex: "springy", handle: "bulb" } },
  { id: "dumbledore", wand: { wood: "elder", core: "thestral", length: 15, flex: "unyielding", handle: "knotted" } },
  { id: "voldemort", wand: { wood: "yew", core: "phoenix", length: 13.5, flex: "rigid", handle: "claw" } },
  { id: "draco", wand: { wood: "hawthorn", core: "unicorn", length: 10, flex: "springy", handle: "smooth" } },
  { id: "neville", wand: { wood: "cherry", core: "unicorn", length: 13, flex: "supple", handle: "ringed" } },
  { id: "bellatrix", wand: { wood: "walnut", core: "dragon", length: 12.75, flex: "unyielding", handle: "claw" } },
  { id: "cedric", wand: { wood: "ash", core: "unicorn", length: 12.25, flex: "springy", handle: "smooth" } },
  { id: "lupin", wand: { wood: "cypress", core: "unicorn", length: 10.25, flex: "pliable", handle: "ringed" } },
  { id: "fleur", wand: { wood: "rosewood", core: "veela", length: 9.5, flex: "rigid", handle: "smooth" } },
  { id: "krum", wand: { wood: "hornbeam", core: "dragon", length: 10.25, flex: "rigid", handle: "bulb" } }
];
var DEFAULT_WAND = { ...WAND_PRESETS[0].wand };
function sameWand(a, b) {
  return a.wood === b.wood && a.core === b.core && a.length === b.length && a.flex === b.flex && a.handle === b.handle;
}
function presetOf(spec) {
  return WAND_PRESETS.find((p) => sameWand(p.wand, spec))?.id ?? null;
}
function clampLength(value) {
  if (!Number.isFinite(value)) return DEFAULT_WAND.length;
  const stepped = Math.round(value / LENGTH_STEP) * LENGTH_STEP;
  return Math.min(LENGTH_MAX, Math.max(LENGTH_MIN, stepped));
}
function sanitizeWand(data) {
  const raw = data && typeof data === "object" ? data : {};
  const pick = (value, ids, fallback) => ids.includes(value) ? value : fallback;
  return {
    wood: pick(raw.wood, WOOD_IDS, DEFAULT_WAND.wood),
    core: pick(raw.core, CORE_IDS, DEFAULT_WAND.core),
    length: typeof raw.length === "number" ? clampLength(raw.length) : DEFAULT_WAND.length,
    flex: pick(raw.flex, FLEX_IDS, DEFAULT_WAND.flex),
    handle: pick(raw.handle, HANDLE_IDS, DEFAULT_WAND.handle)
  };
}
function randomWand(rnd = Math.random) {
  const one = (list) => list[Math.floor(rnd() * list.length) % list.length];
  return {
    wood: one(WOOD_IDS),
    core: one(CORE_IDS),
    length: clampLength(9 + rnd() * 5),
    flex: one(FLEX_IDS),
    handle: one(HANDLE_IDS)
  };
}
var FRACTIONS = { "0.25": "\xBC", "0.5": "\xBD", "0.75": "\xBE" };
function formatLength(length) {
  const whole = Math.floor(length);
  const frac = String(Math.round((length - whole) * 100) / 100);
  return `${whole}${FRACTIONS[frac] ?? ""}`;
}
var HANDLE_LEN = 34;
var TIP_R = 0.9;
var JOIN_R = 2.5;
var bump = (x, center, width) => {
  const d = (x - center) / width;
  return d * d < 1 ? (1 - d * d) ** 2 : 0;
};
var smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
function knots(len) {
  const out = [];
  const step = (len - 16) / 7;
  for (let x = 6; x < len - 9; x += step) out.push(x);
  return out;
}
function radiusAt(handle, x, len) {
  const h = HANDLE_LEN;
  const t = 1 - x / h;
  let grip;
  let cap = 2.2;
  switch (handle) {
    case "ringed":
      grip = 2.95 + 0.2 * t + 0.9 * bump(x, 2.8, 3);
      for (const c of [8, 13.5, 19, 24.5, 30]) grip += 0.5 * bump(x, c, 1.7);
      cap = 2;
      break;
    case "spiral":
      grip = 3 + 0.15 * t + 0.18 * Math.max(0, Math.sin(x * 2.2));
      break;
    case "knotted":
      grip = 2.8 + 0.25 * t;
      break;
    case "claw":
      grip = 2.7 + 0.5 * bump(x, 11, 2.2) + 0.5 * bump(x, 21, 2.2);
      cap = 0;
      break;
    case "bulb":
      grip = 2.8 + 1.9 * bump(x, 4.2, 4.4);
      cap = 1.4;
      break;
    default:
      grip = 2.9 + 0.35 * t;
  }
  const shaft = TIP_R + (JOIN_R - TIP_R) * Math.pow(Math.max(0, (len - x) / (len - h)), 0.85);
  const blend = smoothstep(h - 1.5, h + 1.5, x);
  let r = grip * (1 - blend) + shaft * blend + 0.45 * bump(x, h, 1.4);
  if (handle === "knotted") {
    for (const c of knots(len)) r += (0.85 - 0.4 * (c / len)) * bump(x, c, 1.6);
  }
  if (cap > 0 && x < cap) r *= Math.sqrt(1 - ((cap - x) / cap) ** 2);
  if (handle === "claw" && x < 7) r *= Math.pow(x / 7, 0.75);
  if (x > len - 1) r *= Math.sqrt(Math.max(0, 1 - (x - (len - 1)) ** 2));
  return r;
}
function axisAt(handle, x) {
  if (handle !== "claw" || x >= HANDLE_LEN) return 0;
  return 6.5 * Math.pow((HANDLE_LEN - x) / HANDLE_LEN, 2.4);
}
function simplify(points, eps) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const d = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / len;
    if (d > worst) {
      worst = d;
      index = i;
    }
  }
  if (worst <= eps) return [points[0], points[points.length - 1]];
  return simplify(points.slice(0, index + 1), eps).slice(0, -1).concat(simplify(points.slice(index), eps));
}
var num = (v) => String(Math.round(v * 100) / 100);
var pt = ([x, y]) => `${num(x)} ${num(y)}`;
function wandOutline(spec, thickness = 1, bend = 1) {
  const len = spec.length * 10;
  const top = [];
  const bottom = [];
  const dx = 0.4;
  for (let x = 0; x <= len + 1e-9; x += dx) {
    const r = radiusAt(spec.handle, x, len) * thickness;
    const y = axisAt(spec.handle, x) * bend;
    const slope = (axisAt(spec.handle, x + 0.01) - axisAt(spec.handle, x - 0.01)) * bend / 0.02;
    const n = Math.hypot(slope, 1);
    top.push([x + slope / n * r, y - r / n]);
    bottom.push([x - slope / n * r, y + r / n]);
  }
  const outline = simplify(top, 0.03).concat(simplify(bottom, 0.03).reverse());
  return "M" + outline.map(pt).join("L") + "Z";
}
function wandLayers(spec, id, { detail, thickness, bend, outline: stroke, halo }) {
  const wood = WOODS[spec.wood];
  const len = spec.length * 10;
  const outline = wandOutline(spec, thickness, bend);
  const h = HANDLE_LEN;
  const grad = `${id}-wood`;
  const clip = `${id}-clip`;
  const ext = 4 * thickness;
  const span = 6 * thickness;
  let defs = `<linearGradient id="${grad}" gradientUnits="userSpaceOnUse" x1="0" y1="${num(-ext)}" x2="0" y2="${num(ext)}"><stop offset="0" stop-color="${wood.light}"/><stop offset=".45" stop-color="${wood.base}"/><stop offset="1" stop-color="${wood.dark}"/></linearGradient>`;
  let body = "";
  if (halo > 0) body += `<path d="${outline}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${num(halo)}" stroke-linejoin="round"/>`;
  body += `<path d="${outline}" fill="url(#${grad})"/>`;
  const marks = [];
  const dark = wood.dark;
  if (spec.handle !== "claw") marks.push(`<rect x="-1" y="${num(-2 * span)}" width="${h + 1}" height="${num(4 * span)}" fill="${dark}" opacity=".16"/>`);
  if (spec.handle === "spiral") {
    for (let x = 1; x < h + 16; x += 2.6) {
      const fade = x > h ? 0.5 * (1 - (x - h) / 16) : 0.55;
      marks.push(`<path d="M${num(x)} ${num(-span)}L${num(x + 2.4 * thickness)} ${num(span)}" stroke="${dark}" stroke-width="${num(0.55 * thickness)}" opacity="${num(fade)}"/>`);
    }
  }
  if (spec.handle === "ringed" && detail) {
    for (const x of [10.75, 16.25, 21.75, 27.25]) marks.push(`<path d="M${x} -6V6" stroke="${dark}" stroke-width=".4" opacity=".55"/>`);
  }
  if (detail) {
    marks.push(`<path d="M${h} -6V6" stroke="${dark}" stroke-width=".45" opacity=".6"/>`);
    marks.push(`<path d="M${h + 3} -.7L${num(len - 6)} -.35M${h + 6} .8L${num(len - 12)} .4" stroke="${dark}" stroke-width=".22" opacity=".25" fill="none"/>`);
  }
  if (marks.length) {
    defs += `<clipPath id="${clip}"><path d="${outline}"/></clipPath>`;
    body += `<g clip-path="url(#${clip})">${marks.join("")}</g>`;
  }
  body += `<path d="${outline}" fill="none" stroke="${dark}" stroke-width="${num(stroke)}" stroke-linejoin="round" opacity=".8"/>`;
  return { defs, body };
}
function glowSvg(id, color, cx, cy, r, core) {
  const grad = `${id}-glow`;
  return {
    defs: `<radialGradient id="${grad}"><stop offset="0" stop-color="${color}" stop-opacity=".95"/><stop offset=".4" stop-color="${color}" stop-opacity=".55"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`,
    body: `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" fill="url(#${grad})"/><circle cx="${num(cx)}" cy="${num(cy)}" r="${num(core)}" fill="#fffdf0"/>`
  };
}
function wandSideSvg(spec, width = 340, id = "hp-wand") {
  const len = spec.length * 10;
  const vb = { x: -3, y: -11, w: LENGTH_MAX * 10 + 12, h: 22 };
  const wand = wandLayers(spec, id, { detail: true, thickness: 1, bend: 1, outline: 0.35, halo: 0 });
  const glow = glowSvg(id, CORES[spec.core].glow, len, 0, 5.5, 0.9);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${num(width * vb.h / vb.w)}" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" aria-hidden="true"><defs>${wand.defs}${glow.defs}</defs>${wand.body}${glow.body}</svg>`;
}
var CURSOR_SIZE = 32;
function wandCursorSvg(spec, scale = 1, id = "c") {
  const len = spec.length * 10;
  const end = 29.5;
  const diag = 30 + (spec.length - LENGTH_MIN) / (LENGTH_MAX - LENGTH_MIN) * 8.5;
  const s = diag / len;
  const tip = end - diag / Math.SQRT2;
  const thickness = 2.1;
  const wand = wandLayers(spec, id, { detail: false, thickness, bend: 1.5, outline: 0.5 / s, halo: 1.6 / s });
  const glow = glowSvg(id, CORES[spec.core].glow, tip, tip, 3.2, 1.1);
  const size = CURSOR_SIZE * scale;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${CURSOR_SIZE} ${CURSOR_SIZE}"><defs>${wand.defs}${glow.defs}</defs><g transform="translate(${end} ${end}) rotate(225) scale(${s.toFixed(4)} ${(-s).toFixed(4)})">${wand.body}</g>${glow.body}</svg>`;
  return { svg, hotspot: [Math.round(tip), Math.round(tip)] };
}
var dataUri = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
function wandCursorCss(spec) {
  const one = wandCursorSvg(spec, 1);
  const two = wandCursorSvg(spec, 2);
  const [x, y] = one.hotspot;
  return `image-set(${dataUri(one.svg)} 1x, ${dataUri(two.svg)} 2x) ${x} ${y}, auto`;
}

// src/modals.ts
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
function describeWand(t, wand) {
  const length = t(wand.length % 1 ? "lengthFraction" : "lengthWhole", formatLength(wand.length));
  return t("wandDescription", t(`wood_${wand.wood}`), t(`core_${wand.core}`), length, t(`flex_${wand.flex}`));
}
function wandName(t, wand) {
  const preset = presetOf(wand);
  return preset ? t(`presetWand_${preset}`) : t("shopCustomWand");
}
var WandShopModal = class extends import_obsidian.Modal {
  constructor(app, t, options) {
    super(app);
    this.t = t;
    this.options = options;
    this.cards = /* @__PURE__ */ new Map();
    this.dropdowns = [];
    this.slider = null;
    this.lengthLabel = null;
    this.cursorToggle = null;
    this.wand = { ...options.wand };
    this.cursorOn = options.cursor;
  }
  onOpen() {
    const { t, contentEl } = this;
    this.modalEl.addClass("hp-shop-modal");
    this.titleEl.setText(t("shopTitle"));
    this.titleEl.addClass("hp-display");
    contentEl.createEl("p", { cls: "hp-shop-quote", text: t("shopQuote") });
    const stage = contentEl.createDiv({ cls: "hp-shop-stage" });
    this.stage = {
      preview: stage.createDiv({ cls: "hp-shop-preview" }),
      name: stage.createDiv({ cls: "hp-shop-name" }),
      desc: stage.createDiv({ cls: "hp-shop-desc" })
    };
    new import_obsidian.Setting(contentEl).setName(t("settingWandCursor")).setDesc(t("settingWandCursorDesc")).addToggle((tg) => {
      this.cursorToggle = tg;
      tg.setValue(this.cursorOn).onChange((value) => this.setCursor(value));
    }).settingEl.addClass("hp-shop-cursor");
    contentEl.createDiv({ cls: "hp-shop-heading", text: t("shopCanon") });
    const grid = contentEl.createDiv({ cls: "hp-shop-presets" });
    for (const preset of WAND_PRESETS) {
      const card = grid.createEl("button", { cls: "hp-shop-preset", attr: { type: "button", "data-preset": preset.id } });
      card.appendChild(svgElement(wandSideSvg(preset.wand, 150, `hp-shop-${preset.id}`)));
      card.createSpan({ text: t(`preset_${preset.id}`) });
      card.addEventListener("click", () => this.set(preset.wand));
      this.cards.set(preset.id, card);
    }
    contentEl.createDiv({ cls: "hp-shop-heading", text: t("shopCustom") });
    const form = contentEl.createDiv({ cls: "hp-shop-form" });
    this.dropdown(form, "wood", t("shopWood"), WOOD_IDS.map((id) => [id, t(`wood_${id}`)]));
    this.dropdown(form, "core", t("shopCore"), CORE_IDS.map((id) => [id, t(`core_${id}`)]));
    this.dropdown(form, "handle", t("shopHandle"), HANDLE_IDS.map((id) => [id, t(`handle_${id}`)]));
    this.dropdown(form, "flex", t("shopFlex"), FLEX_IDS.map((id) => [id, t(`flex_${id}`)]));
    const length = new import_obsidian.Setting(form).setName(t("shopLength"));
    this.lengthLabel = length.nameEl.createSpan({ cls: "hp-shop-length" });
    length.addSlider((s) => {
      this.slider = s;
      s.setLimits(LENGTH_MIN, LENGTH_MAX, LENGTH_STEP).setValue(this.wand.length).onChange((value) => this.update({ length: value }));
    });
    new import_obsidian.Setting(form).addButton((b) => b.setButtonText(t("shopRandom")).onClick(() => this.set(randomWand())));
    this.refresh();
  }
  onClose() {
    this.contentEl.empty();
    this.cards.clear();
    this.dropdowns = [];
    this.options.onClosed?.();
  }
  setCursor(on) {
    if (on === this.cursorOn) return;
    this.cursorOn = on;
    this.cursorToggle?.setValue(on);
    this.options.onCursor(on);
  }
  dropdown(container, key, name, options) {
    new import_obsidian.Setting(container).setName(name).addDropdown((d) => {
      for (const [value, text] of options) d.addOption(value, text);
      d.setValue(this.wand[key]).onChange((value) => this.update({ [key]: value }));
      this.dropdowns.push({ key, control: d });
    });
  }
  /** Выбрана целая палочка (знаменитая или случайная): обновить и поля конструктора. */
  set(wand) {
    this.wand = { ...wand };
    for (const { key, control } of this.dropdowns) control.setValue(this.wand[key]);
    this.slider?.setValue(this.wand.length);
    this.refresh();
    this.options.onChange({ ...this.wand });
    this.setCursor(true);
  }
  update(patch) {
    this.wand = { ...this.wand, ...patch };
    this.refresh();
    this.options.onChange({ ...this.wand });
    this.setCursor(true);
  }
  refresh() {
    const { t, wand, stage } = this;
    stage.preview.empty();
    stage.preview.appendChild(svgElement(wandSideSvg(wand, 480, "hp-shop-main")));
    stage.name.setText(wandName(t, wand));
    stage.desc.setText(describeWand(t, wand));
    const preset = presetOf(wand);
    for (const [id, card] of this.cards) {
      card.toggleClass("is-selected", id === preset);
      card.setAttribute("aria-pressed", String(id === preset));
    }
    this.lengthLabel?.setText(` \xB7 ${formatLength(wand.length)}\u2033`);
  }
};
var WandModal = class extends import_obsidian.Modal {
  constructor(app, t, gestures, onCast) {
    super(app);
    this.t = t;
    this.gestures = gestures;
    this.onCast = onCast;
  }
  onOpen() {
    this.titleEl.setText(this.t("wandTitle"));
    this.titleEl.addClass("hp-display");
    const input = this.contentEl.createEl("input", {
      cls: "hp-wand-input",
      attr: { type: "text", placeholder: this.t("wandPlaceholder"), "aria-label": this.t("wandPlaceholder") }
    });
    this.contentEl.createEl("p", { cls: "hp-wand-hint", text: this.t(this.gestures ? "wandHintGestures" : "wandHint") });
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
  wandCursor: true,
  wand: { ...DEFAULT_WAND },
  gestures: true,
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
  settings.wand = sanitizeWand(raw.wand);
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
    const wand = new import_obsidian2.Setting(containerEl).setName(t("settingWand")).setDesc(`${wandName(t, settings.wand)}: ${describeWand(t, settings.wand).toLowerCase()}`).addButton((b) => b.setButtonText(t("buttonWandShop")).onClick(() => this.plugin.openWandShop(() => this.display())));
    wand.settingEl.addClass("hp-wand-setting");
    wand.infoEl.createDiv({ cls: "hp-wand-current" }).appendChild(svgElement(wandSideSvg(settings.wand, 260, "hp-settings-wand")));
    this.toggle("wandCursor", t("settingWandCursor"), t("settingWandCursorDesc"));
    this.toggle("statusBar", t("settingStatusBar"));
    this.toggle("easterEggs", t("settingEasterEggs"), t("settingEasterEggsDesc"));
    this.toggle("gestures", t("settingGestures"), t("settingGesturesDesc"));
    const book = containerEl.createEl("details", { cls: "hp-spellbook" });
    book.createEl("summary", { text: t("spellbookTitle") });
    const list = book.createDiv({ cls: "hp-spellbook-list" });
    for (const { spell } of GESTURES) {
      const item = list.createDiv({ cls: "hp-spellbook-item", attr: { "data-spell": spell } });
      item.createDiv({ cls: "hp-spellbook-figure" }).appendChild(svgElement(gestureSvg(spell)));
      const text = item.createDiv();
      text.createDiv({ cls: "hp-spellbook-name", text: t(`spell_${spell}`) });
      text.createDiv({ cls: "setting-item-description", text: t(`gesture_${spell}`) });
    }
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
    this.saveTimer = 0;
    this.statusEl = null;
    this.bodies = /* @__PURE__ */ new Set();
    this.spellbook = createSpellbook();
    this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  }
  async onload() {
    this.t = createTranslator(detectLanguage());
    await this.loadSettings();
    this.effects = new Effects(() => this.reducedMotionQuery.matches);
    this.gestures = new GestureInput({
      enabled: () => this.settings.easterEggs && this.settings.gestures,
      colors: () => CORES[this.settings.wand.core],
      cast: (spell, at) => this.cast(spell, at)
    }, this.effects);
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
    this.addCommand({ id: "wand-shop", name: this.t("commandWandShop"), callback: () => this.openWandShop() });
    this.addCommand({
      id: "toggle-theme",
      name: this.t("commandToggle"),
      callback: () => {
        this.paused = !this.paused;
        this.applyTheme();
      }
    });
    this.registerDomEvent(window, "keydown", (e) => this.onKeydown(e), true);
    this.registerDomEvent(window, "pointermove", (e) => {
      this.effects.trackPointer(e);
      this.gestures.pointerMove(e);
    }, { passive: true });
    this.registerDomEvent(window, "pointerdown", (e) => this.gestures.pointerDown(e), true);
    this.registerDomEvent(window, "pointerup", (e) => this.gestures.pointerUp(e), true);
    this.registerDomEvent(window, "pointercancel", () => this.gestures.cancel(), true);
    this.registerDomEvent(window, "contextmenu", (e) => this.gestures.contextMenu(e), true);
    this.applyTheme();
    this.app.workspace.onLayoutReady(() => void this.birthday());
  }
  onunload() {
    if (this.saveTimer) {
      window.clearTimeout(this.saveTimer);
      void this.saveData(this.settings);
    }
    this.gestures?.cancel();
    this.effects?.destroy();
    for (const body of this.bodies) {
      this.setBodyClasses(body, false);
      body.style.removeProperty("--hp-wand-cursor");
    }
  }
  // ---------- Настройки ----------
  async loadSettings() {
    this.settings = migrateSettings(await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.applyTheme();
  }
  /** Палочка меняется сразу, а сохраняется с задержкой: в лавке её крутят ползунком. */
  setWand(wand) {
    this.settings.wand = wand;
    this.applyTheme();
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = 0;
      void this.saveData(this.settings);
    }, 400);
  }
  async setHouse(house) {
    this.settings.house = house;
    await this.saveSettings();
  }
  // ---------- Тема ----------
  applyTheme() {
    const cursor = wandCursorCss(this.settings.wand);
    for (const body of this.bodies) {
      this.setBodyClasses(body, !this.paused);
      if (this.settings.wandCursor && !this.paused) body.style.setProperty("--hp-wand-cursor", cursor);
      else body.style.removeProperty("--hp-wand-cursor");
    }
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
    menu.addItem((item) => item.setTitle(this.t("shopTitle")).setIcon("wand").onClick(() => this.openWandShop()));
    menu.addItem((item) => item.setTitle(this.t("commandSortingHat")).setIcon("graduation-cap").onClick(() => this.openSortingHat()));
    menu.addItem((item) => item.setTitle(this.t("menuSettings")).setIcon("settings").onClick(() => this.openSettings()));
    menu.showAtMouseEvent(evt);
  }
  openSortingHat(after) {
    new SortingHatModal(this.app, this.t, this.isDark(), (house) => {
      void this.setHouse(house).then(() => after?.());
    }).open();
  }
  openWandShop(after) {
    new WandShopModal(this.app, this.t, {
      wand: this.settings.wand,
      cursor: this.settings.wandCursor,
      onChange: (wand) => this.setWand(wand),
      onCursor: (enabled) => {
        this.settings.wandCursor = enabled;
        void this.saveSettings();
      },
      onClosed: after
    }).open();
  }
  openWand() {
    new WandModal(this.app, this.t, this.settings.gestures, (phrase) => {
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
  /** at — где начат жест палочкой (для «Вингардиум Левиосы»), иначе — где курсор. */
  cast(spell, at) {
    if (this.paused && spell !== "solemnlySwear") return;
    switch (spell) {
      case "wingardiumLeviosa": {
        const p = at ?? this.effects.pointerPosition;
        this.effects.levitate(p.x, p.y);
        new import_obsidian3.Notice(this.t("eggLeviosa"));
        break;
      }
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
