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
var import_obsidian4 = require("obsidian");
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
var crestSeq = 0;
function crestSvg(id, size = 40) {
  const c = HOUSES[id].crest;
  const clip = `hp-clip-${id}-${++crestSeq}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.04)}" viewBox="0 0 100 104" aria-hidden="true"><defs><clipPath id="${clip}"><path d="${SHIELD}"/></clipPath></defs><path d="${SHIELD}" fill="${c.field}"/><path d="M8 22L92 92" stroke="${c.metal}" stroke-width="12" opacity=".45" clip-path="url(#${clip})"/><path d="${SHIELD}" fill="none" stroke="${c.metal}" stroke-width="6"/><text x="50" y="67" text-anchor="middle" font-family="'HP Forum', Georgia, serif" font-size="48" fill="${c.ink}">${c.letter}</text></svg>`;
}
function svgElement(markup) {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  return document.importNode(doc.documentElement, true);
}
var HAT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="110" viewBox="0 0 90 82" aria-hidden="true"><path d="M44 4c6 0 9 10 12 22 3 14 10 26 20 32H12c10-8 16-20 20-34 3-12 6-20 12-20z" fill="#6b4a2b"/><path d="M8 62c10-6 64-6 74 0-2 6-72 6-74 0z" fill="#4e3520"/><path d="M34 40c3 3 8 3 11 0M50 38c2 2 5 2 7 0" stroke="#2a1a0e" stroke-width="2" fill="none"/><path class="hp-hat-mouth" d="M36 50c6 3 14 3 20 0" stroke="#2a1a0e" stroke-width="2.2" fill="none"/></svg>';
var SNITCH_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="34" viewBox="0 0 64 34" aria-hidden="true"><g class="hp-wing hp-wing-l"><path d="M26 16C17 3 5 2 1 6c7 1 15 6 24 13z" fill="#fffdf5" stroke="#8a7440" stroke-width="1.1"/><path d="M24 13c-6-5-12-6-17-6M24 15c-5-3-10-4-15-3" stroke="#8a7440" stroke-width=".8" fill="none"/></g><g class="hp-wing hp-wing-r"><path d="M38 16C47 3 59 2 63 6c-7 1-15 6-24 13z" fill="#fffdf5" stroke="#8a7440" stroke-width="1.1"/><path d="M40 13c6-5 12-6 17-6M40 15c5-3 10-4 15-3" stroke="#8a7440" stroke-width=".8" fill="none"/></g><defs><radialGradient id="hp-snitch-gold" cx=".35" cy=".35"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#e8b923"/><stop offset="1" stop-color="#9a6f0c"/></radialGradient></defs><circle cx="32" cy="19" r="9" fill="url(#hp-snitch-gold)"/><path d="M24 18c5 3 11 3 16 0" stroke="#8a620a" stroke-width=".9" fill="none"/></svg>';
var FOOT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="26" viewBox="0 0 16 26" aria-hidden="true"><path d="M8 25c-3.6 0-5-3-4.6-7 .4-3.6.2-6.2-1-9C1.3 6.2 3 3 6.4 3c3.8 0 5.6 3 5.4 7-.2 3 .9 5.2 1.6 8 .9 3.8-1.4 7-5.4 7z" fill="currentColor"/><circle cx="4" cy="1.6" r="1.4" fill="currentColor"/><circle cx="7.4" cy="1" r="1.3" fill="currentColor"/><circle cx="10.6" cy="1.6" r="1.2" fill="currentColor"/></svg>';

// src/css.ts
function restrictedCss(names) {
  if (!names.length) return "";
  const quote = (s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")}"`;
  const match = names.map((n) => `[data-path=${quote(n)}], [data-path$=${quote("/" + n)}]`).join(", ");
  const title = `body.hp-theme :is(.nav-folder-title, .tree-item-self):is(${match})`;
  const folder = (hover) => `body.hp-theme .nav-folder:has(> .nav-folder-title:is(${match}))${hover} > .nav-folder-children, body.hp-theme .tree-item:has(> .tree-item-self:is(${match}))${hover} > .tree-item-children`;
  return [
    `${title} { font-style: italic; color: var(--text-faint); }`,
    `${title} :is(.nav-folder-title-content, .tree-item-inner)::after { content: ' 🔒'; font-style: normal; }`,
    `${folder("")} { filter: blur(2.5px); opacity: 0.7; transition: filter 0.3s, opacity 0.3s; }`,
    `${folder(":hover")} { filter: none; opacity: 1; }`
  ].join("\n");
}

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
  settingsIntro: "Parchment goes with the light base theme, the common room with the dark one (Settings → Appearance), unless you choose otherwise below.",
  settingReadableFont: "Literata for notes",
  settingReadableFontDesc: "A typeface designed for reading on screens, with Cyrillic. Your own font from Appearance settings still wins.",
  settingHeadingFont: "Forum for headings",
  settingHeadingFontDesc: "A classical roman for headings and the note title.",
  settingOrnaments: "Ornaments",
  settingOrnamentsDesc: "Golden thread under the note title, ✦ dividers, accents on the active tab and file.",
  settingWandCursor: "Magic wand cursor",
  settingWandCursorDesc: "Your wand instead of the mouse pointer. The editor and text fields keep the text cursor, links keep the hand.",
  settingWand: "Wand",
  buttonWandShop: "Visit Ollivanders",
  settingGestures: "Spells by wand movement",
  settingGesturesDesc: "Hold the right mouse button, draw a figure and let go.",
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
  gesture_accioSnitch: "A circle — the Snitch is round",
  gesture_solemnlySwear: "The letter M, for Moony and friends. Opens the map",
  gesture_mischiefManaged: "Wipe the map clean: back and forth",
  settingMapTags: "Tags on the Marauder's Map",
  settingMapTagsDesc: "Notes with a common tag are connected through it: on the map and in routes.",
  settingStatusBar: "House and points in the status bar",
  settingEasterEggs: "Magic",
  settingEasterEggsDesc: "Words have power…",
  settingSortingHat: "Sorting Hat",
  buttonSortingHat: "Put on the Hat",
  motto: "Draco dormiens nunquam titillandus",
  mottoTranslation: "Never tickle a sleeping dragon",
  commandChooseHouse: "Choose house",
  commandSortingHat: "Sorting Hat",
  commandWand: "Wave your wand…",
  commandToggle: "Toggle Hogwarts theme",
  commandWandShop: "Ollivanders: choose your wand",
  ribbonTitle: "Hogwarts houses",
  menuSettings: "Theme settings",
  statusTitle: "Snitches caught: {0}",
  hat1: "Hmm. Difficult. Very difficult…",
  hat2: "Plenty of courage, I see. Not a bad mind either…",
  hat3: "There's talent, oh yes, and a thirst to prove yourself…",
  hat4: "So where shall I put you?..",
  wandTitle: "Wave your wand",
  wandPlaceholder: "Say the incantation",
  wandHint: "Say the incantation and press Enter",
  wandHintGestures: "Say the incantation and press Enter — or draw it with the right mouse button",
  wandFail: "Nothing happens. Perhaps it was the wrong wand movement?",
  wandOff: "Magic is switched off in the plugin settings.",
  shopTitle: "Ollivanders",
  shopQuote: "“The wand chooses the wizard.”",
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
  eggMischief: "Mischief managed. The theme returns after a solemn oath — or a restart.",
  eggSnitch: "+{0} points to {1}! The Snitch is caught.",
  eggSnitchLabel: "The Golden Snitch — catch it!",
  eggBirthday: "July 31st — happy birthday, Harry! Hagrid is bringing a (slightly squashed) cake.",
  mapTitle: "The Marauder's Map",
  commandMapOpen: "Marauder's Map: where am I",
  commandMapRoute: "Marauder's Map: find the way to a note…",
  commandMapNext: "Marauder's Map: next step",
  mapEmpty: "Open a note, and the map will show where you are and where its links lead.",
  mapHere: "you are here",
  mapLonely: "No secret passage leads here: the note has neither links nor backlinks.",
  mapHidden: "and {0} more",
  mapLegendLink: "link",
  mapLegendBacklink: "backlink",
  mapLegendTag: "common tag",
  mapTagHint: "tag, click to find all its notes",
  mapRouteButton: "Find the way…",
  mapRoutePlaceholder: "Where to?",
  mapRouteTitle: "The way to “{0}”",
  mapRouteSteps: "Steps: {0}",
  mapRerouted: "you left the path, here is a new one",
  mapStepLink: "link in the text",
  mapStepBacklink: "backlink: not in the text",
  mapStepTag: "common tag {0}",
  mapNext: "Next step",
  mapClear: "Clear",
  mapLost: "No secret passage leads from here to “{0}”.",
  mapNoPath: "No secret passage leads to “{0}”: the notes are not connected by links.",
  mapNoNote: "Open a note first: the map needs to know where you are.",
  mapArrived: "You have arrived: “{0}”. Mischief managed!",
  mapFootprints: "Your footprints",
  mapRouteChanged: "the links have changed, here is a new way",
  mapLegendGhost: "uncharted room",
  mapGhostHint: "uncharted room: the note does not exist yet, click to create it",
  locale: "en",
  sectionAppearance: "Appearance",
  sectionWand: "Wand",
  sectionMap: "Marauder's Map",
  sectionMagic: "Spells",
  sectionCup: "House Cup",
  settingMode: "Parchment or common room",
  settingModeDesc: "By default the plugin follows the light or dark base theme of Obsidian. You can keep one of them for good instead.",
  mode_auto: "Follow Obsidian",
  mode_parchment: "Always parchment",
  mode_common: "Always common room",
  settingMapUnresolved: "Uncharted rooms",
  settingMapUnresolvedDesc: "Links to notes that do not exist yet are shown on the map. A click creates the note.",
  settingMapDepth: "Map rings",
  settingMapDepthDesc: "Only the neighbours of the note, or their neighbours too.",
  mapDepth_1: "One ring",
  mapDepth_2: "Two rings",
  settingMapExclude: "Folders off the map",
  settingMapExcludeDesc: "One per line or comma-separated: templates, archive… Notes in them are not on the map, in routes, in the Pensieve or the Time-Turner.",
  settingRestricted: "Restricted Section",
  settingRestrictedDesc: "Your own folder names in addition to “Restricted Section” and «Запретная секция». Their contents are blurred until hovered.",
  settingGesturesDisabled: "Switch on Magic first.",
  settingGesturesAlt: "On macOS and Linux, hold Alt to start a gesture in the note text as well.",
  settingWorkPoints: "Points for work",
  settingWorkPointsDesc: "+{0} to your house for every task you complete (- [x]) and +{1} for writing in the daily note.",
  cupPoints: "{0} points",
  cupSnitches: "Snitches caught: {0}",
  buttonResetPoints: "Reset points",
  resetTitle: "Reset the House Cup?",
  resetText: "All houses go back to zero points and the caught Snitches are forgotten.",
  resetConfirm: "Reset",
  cancel: "Cancel",
  hatIntro: "Answer a few questions, and the Hat will see where you belong. Or simply trust it.",
  hatQuiz: "Take the test",
  hatTrust: "Trust the Hat",
  hatProgress: "Question {0} of {1}",
  quiz_noise: "At night you hear a strange noise in a corridor. What do you do?",
  quiz_noise_gryffindor: "Go and see what it is",
  quiz_noise_slytherin: "Find out whether it could be useful to me",
  quiz_noise_ravenclaw: "Work out first what could make such a sound",
  quiz_noise_hufflepuff: "Fetch my friends — it is less scary together",
  quiz_virtue: "Which quality do you value most?",
  quiz_virtue_gryffindor: "Courage",
  quiz_virtue_slytherin: "Ambition",
  quiz_virtue_ravenclaw: "Wit",
  quiz_virtue_hufflepuff: "Loyalty",
  quiz_book: "In the library you come across a book that must not be opened.",
  quiz_book_gryffindor: "Open it: nothing ventured, nothing gained",
  quiz_book_slytherin: "Open it when nobody is looking",
  quiz_book_ravenclaw: "First read everything about why it must not be opened",
  quiz_book_hufflepuff: "Take it to the librarian",
  quiz_subject: "Which lesson are you looking forward to most?",
  quiz_subject_gryffindor: "Defence Against the Dark Arts",
  quiz_subject_slytherin: "Potions",
  quiz_subject_ravenclaw: "Charms",
  quiz_subject_hufflepuff: "Herbology",
  quiz_legacy: "How would you like to be remembered?",
  quiz_legacy_gryffindor: "As the bold",
  quiz_legacy_slytherin: "As the great",
  quiz_legacy_ravenclaw: "As the wise",
  quiz_legacy_hufflepuff: "As the kind",
  quiz_team: "A group project has gone wrong. What do you do?",
  quiz_team_gryffindor: "Take the blame and put things right",
  quiz_team_slytherin: "Take charge myself",
  quiz_team_ravenclaw: "Find the mistake and think up a solution",
  quiz_team_hufflepuff: "Support the others and finish my part",
  commandPensieve: "Pensieve: an old memory",
  commandTimeTurner: "Time-Turner: a year ago today",
  commandCloak: "Invisibility Cloak: hide the selection",
  pensieveTitle: "Pensieve",
  timeTurnerTitle: "Time-Turner",
  pensieveNotice: "A memory from the Pensieve: “{0}”. Days untouched: {1}.",
  pensieveEmpty: "The Pensieve is empty: there are no notes yet.",
  timeTurnerNotice: "Three turns of the Time-Turner: {0}.",
  timeTurnerEmpty: "Nothing was written on {0}.",
  timeTurnerPlaceholder: "Notes from {0}",
  cloakTitle: "Invisibility Cloak",
  pointsDaily: "+{0} points to {1} for the daily note!"
};
var ru = {
  pluginName: "HP Theme",
  house_gryffindor: "Гриффиндор",
  house_slytherin: "Слизерин",
  house_ravenclaw: "Когтевран",
  house_hufflepuff: "Пуффендуй",
  houseShout_gryffindor: "ГРИФФИНДОР!",
  houseShout_slytherin: "СЛИЗЕРИН!",
  houseShout_ravenclaw: "КОГТЕВРАН!",
  houseShout_hufflepuff: "ПУФФЕНДУЙ!",
  settingsIntro: "Пергамент — со светлой базовой темой, гостиная — с тёмной (Настройки → Оформление), если ниже не выбрано иное.",
  settingReadableFont: "Шрифт заметок Literata",
  settingReadableFontDesc: "Шрифт для чтения с экрана, с кириллицей. Свой шрифт из настроек оформления по-прежнему важнее.",
  settingHeadingFont: "Заголовки Forum",
  settingHeadingFontDesc: "Классическая антиква для заголовков и названия заметки.",
  settingOrnaments: "Орнаменты",
  settingOrnamentsDesc: "Золотая нить под названием заметки, разделители ✦, акценты активной вкладки и файла.",
  settingWandCursor: "Курсор — волшебная палочка",
  settingWandCursorDesc: "Ваша палочка вместо указателя мыши. В редакторе и полях ввода остаётся текстовый курсор, над ссылками — «рука».",
  settingWand: "Палочка",
  buttonWandShop: "В лавку Олливандера",
  settingGestures: "Заклинания движениями палочки",
  settingGesturesDesc: "Зажмите правую кнопку мыши, нарисуйте фигуру и отпустите.",
  spellbookTitle: "Стандартная книга заклинаний (спойлеры!)",
  spell_lumos: "Люмос",
  spell_nox: "Нокс",
  spell_wingardiumLeviosa: "Вингардиум Левиоса",
  spell_accioSnitch: "Акцио снитч",
  spell_solemnlySwear: "Клянусь, что замышляю только шалость",
  spell_mischiefManaged: "Шалость удалась",
  gesture_lumos: "Поднять палочку: штрих вверх",
  gesture_nox: "Опустить палочку: штрих вниз",
  gesture_wingardiumLeviosa: "Взмах и щелчок! Поднимает то, на что указала палочка",
  gesture_accioSnitch: "Круг — снитч ведь круглый",
  gesture_solemnlySwear: "Буква M — Мародёры. Открывает карту",
  gesture_mischiefManaged: "Стереть карту: туда-обратно",
  settingMapTags: "Теги на Карте Мародёров",
  settingMapTagsDesc: "Заметки с общим тегом связаны через него: на карте и в маршрутах.",
  settingStatusBar: "Факультет и очки в статус-баре",
  settingEasterEggs: "Магия",
  settingEasterEggsDesc: "Слова имеют силу…",
  settingSortingHat: "Распределяющая шляпа",
  buttonSortingHat: "Надеть шляпу",
  motto: "Draco dormiens nunquam titillandus",
  mottoTranslation: "Никогда не щекочи спящего дракона",
  commandChooseHouse: "Выбрать факультет",
  commandSortingHat: "Распределяющая шляпа",
  commandWand: "Взмахнуть палочкой…",
  commandToggle: "Включить/выключить тему Хогвартса",
  commandWandShop: "Лавка Олливандера: выбрать палочку",
  ribbonTitle: "Факультеты Хогвартса",
  menuSettings: "Настройки темы",
  statusTitle: "Поймано снитчей: {0}",
  hat1: "Хм… непросто. Очень непросто…",
  hat2: "Вижу немало смелости. И ум неплох…",
  hat3: "Есть талант, о да, и жажда проявить себя…",
  hat4: "Так куда же мне тебя определить?..",
  wandTitle: "Взмахнуть палочкой",
  wandPlaceholder: "Произнесите заклинание",
  wandHint: "Произнесите заклинание и нажмите Enter",
  wandHintGestures: "Произнесите заклинание и нажмите Enter — или нарисуйте его правой кнопкой мыши",
  wandFail: "Ничего не произошло. Может, палочкой взмахнули не так?",
  wandOff: "Магия выключена в настройках плагина.",
  shopTitle: "Лавка Олливандера",
  shopQuote: "«Палочка выбирает волшебника».",
  shopCanon: "Знаменитые палочки",
  shopCustom: "Своя палочка",
  shopWood: "Древесина",
  shopCore: "Сердцевина",
  shopLength: "Длина",
  shopFlex: "Гибкость",
  shopHandle: "Рукоять",
  shopRandom: "Пусть палочка выберет сама",
  shopCustomWand: "Ваша собственная палочка",
  wandDescription: "{0}, {1}, {2}, {3}",
  lengthWhole: "{0} дюймов",
  lengthFraction: "{0} дюйма",
  wood_holly: "Остролист",
  wood_vine: "Виноградная лоза",
  wood_willow: "Ива",
  wood_elder: "Бузина",
  wood_yew: "Тис",
  wood_hawthorn: "Боярышник",
  wood_cherry: "Вишня",
  wood_ash: "Ясень",
  wood_walnut: "Грецкий орех",
  wood_hornbeam: "Граб",
  wood_rosewood: "Розовое дерево",
  wood_cypress: "Кипарис",
  wood_oak: "Дуб",
  wood_ebony: "Чёрное дерево",
  wood_mahogany: "Красное дерево",
  core_phoenix: "перо феникса",
  core_dragon: "сердечная жила дракона",
  core_unicorn: "волос единорога",
  core_thestral: "волос из хвоста фестрала",
  core_veela: "волос вейлы",
  flex_unyielding: "несгибаемая",
  flex_rigid: "жёсткая",
  flex_springy: "упругая",
  flex_supple: "гибкая",
  flex_pliable: "податливая",
  flex_swishy: "хлёсткая",
  handle_smooth: "Гладкая",
  handle_ringed: "С кольцами",
  handle_spiral: "Резная лоза",
  handle_knotted: "Узловатая",
  handle_claw: "Костяной коготь",
  handle_bulb: "Навершие-шар",
  preset_harry: "Гарри Поттер",
  preset_hermione: "Гермиона Грейнджер",
  preset_ron: "Рон Уизли",
  preset_dumbledore: "Альбус Дамблдор",
  preset_voldemort: "Волан-де-Морт",
  preset_draco: "Драко Малфой",
  preset_neville: "Невилл Долгопупс",
  preset_bellatrix: "Беллатриса Лестрейндж",
  preset_cedric: "Седрик Диггори",
  preset_lupin: "Римус Люпин",
  preset_fleur: "Флёр Делакур",
  preset_krum: "Виктор Крам",
  presetWand_harry: "Палочка Гарри Поттера",
  presetWand_hermione: "Палочка Гермионы Грейнджер",
  presetWand_ron: "Палочка Рона Уизли",
  presetWand_dumbledore: "Бузинная палочка, Дар Смерти",
  presetWand_voldemort: "Палочка Волан-де-Морта",
  presetWand_draco: "Палочка Драко Малфоя",
  presetWand_neville: "Палочка Невилла Долгопупса",
  presetWand_bellatrix: "Палочка Беллатрисы Лестрейндж",
  presetWand_cedric: "Палочка Седрика Диггори",
  presetWand_lupin: "Палочка Римуса Люпина",
  presetWand_fleur: "Палочка Флёр Делакур",
  presetWand_krum: "Палочка Виктора Крама",
  eggLumos: "Lumos! Да будет свет.",
  eggLeviosa: "Вингардиум Левиоса! Леви-О-са, а не Левио-СА.",
  eggNox: "Nox. Добро пожаловать в гостиную.",
  eggMap1: "Господа Лунатик, Хвост, Бродяга и Сохатый",
  eggMap2: "с гордостью представляют",
  eggMapTitle: "Карту Мародёров",
  eggMischief: "Шалость удалась. Тема вернётся после клятвы — или перезапуска.",
  eggSnitch: "+{0} очков факультету {1}! Снитч пойман.",
  eggSnitchLabel: "Золотой снитч — поймай его!",
  eggBirthday: "31 июля — с днём рождения, Гарри! Хагрид уже несёт торт (слегка помятый).",
  mapTitle: "Карта Мародёров",
  commandMapOpen: "Карта Мародёров: где я",
  commandMapRoute: "Карта Мародёров: проложить путь к заметке…",
  commandMapNext: "Карта Мародёров: следующий шаг",
  mapEmpty: "Откройте заметку — и карта покажет, где вы и куда ведут ссылки.",
  mapHere: "вы здесь",
  mapLonely: "Сюда не ведёт ни один тайный ход: у заметки нет ни ссылок, ни обратных ссылок.",
  mapHidden: "и ещё {0}",
  mapLegendLink: "ссылка",
  mapLegendBacklink: "обратная ссылка",
  mapLegendTag: "общий тег",
  mapTagHint: "тег, клик — все заметки с ним",
  mapRouteButton: "Проложить путь…",
  mapRoutePlaceholder: "Куда идём?",
  mapRouteTitle: "Путь к «{0}»",
  mapRouteSteps: "Шагов: {0}",
  mapRerouted: "вы свернули с пути, вот новый",
  mapStepLink: "ссылка в тексте",
  mapStepBacklink: "обратная ссылка: в тексте её нет",
  mapStepTag: "общий тег {0}",
  mapNext: "Следующий шаг",
  mapClear: "Сбросить",
  mapLost: "Отсюда к «{0}» тайного хода нет.",
  mapNoPath: "К «{0}» тайного хода нет: заметки не связаны ссылками.",
  mapNoNote: "Сначала откройте заметку: карте нужно знать, где вы.",
  mapArrived: "Вы на месте: «{0}». Шалость удалась!",
  mapFootprints: "Ваши следы",
  mapRouteChanged: "ссылки изменились, вот новый путь",
  mapLegendGhost: "неизведанная комната",
  mapGhostHint: "неизведанная комната: заметки ещё нет, клик — создать её",
  locale: "ru",
  sectionAppearance: "Оформление",
  sectionWand: "Палочка",
  sectionMap: "Карта Мародёров",
  sectionMagic: "Заклинания",
  sectionCup: "Кубок школы",
  settingMode: "Пергамент или гостиная",
  settingModeDesc: "Обычно плагин следует светлой или тёмной базовой теме Obsidian. Можно оставить что-то одно насовсем.",
  mode_auto: "Как в Obsidian",
  mode_parchment: "Всегда пергамент",
  mode_common: "Всегда гостиная",
  settingMapUnresolved: "Неизведанные комнаты",
  settingMapUnresolvedDesc: "Ссылки на заметки, которых ещё нет, видны на карте. Клик создаёт заметку.",
  settingMapDepth: "Круги карты",
  settingMapDepthDesc: "Только соседи заметки или и соседи соседей.",
  mapDepth_1: "Один круг",
  mapDepth_2: "Два круга",
  settingMapExclude: "Папки не на карте",
  settingMapExcludeDesc: "По одной на строке или через запятую: шаблоны, архив… Их заметок нет на карте, в маршрутах, в Омуте памяти и в Маховике времени.",
  settingRestricted: "Запретная секция",
  settingRestrictedDesc: "Свои названия папок в дополнение к «Запретная секция» и «Restricted Section». Их содержимое размыто, пока не наведёшь курсор.",
  settingGesturesDisabled: "Сначала включите магию.",
  settingGesturesAlt: "На macOS и Linux зажмите Alt, чтобы начать жест и в тексте заметки.",
  settingWorkPoints: "Очки за работу",
  settingWorkPointsDesc: "+{0} факультету за каждую закрытую задачу (- [x]) и +{1} за запись в ежедневной заметке.",
  cupPoints: "Очков: {0}",
  cupSnitches: "Поймано снитчей: {0}",
  buttonResetPoints: "Сбросить очки",
  resetTitle: "Сбросить Кубок школы?",
  resetText: "У всех факультетов снова будет ноль очков, а пойманные снитчи забудутся.",
  resetConfirm: "Сбросить",
  cancel: "Отмена",
  hatIntro: "Ответьте на несколько вопросов, и шляпа поймёт, где ваше место. Или просто доверьтесь ей.",
  hatQuiz: "Пройти испытание",
  hatTrust: "Довериться шляпе",
  hatProgress: "Вопрос {0} из {1}",
  quiz_noise: "Ночью вы слышите в коридоре странный шум. Что вы сделаете?",
  quiz_noise_gryffindor: "Пойду посмотрю, что там",
  quiz_noise_slytherin: "Узнаю, нельзя ли извлечь из этого пользу",
  quiz_noise_ravenclaw: "Сначала подумаю, что может издавать такой звук",
  quiz_noise_hufflepuff: "Позову друзей — вместе не страшно",
  quiz_virtue: "Какое качество вы цените больше всего?",
  quiz_virtue_gryffindor: "Смелость",
  quiz_virtue_slytherin: "Целеустремлённость",
  quiz_virtue_ravenclaw: "Ум",
  quiz_virtue_hufflepuff: "Верность",
  quiz_book: "В библиотеке вам попалась книга, которую нельзя открывать.",
  quiz_book_gryffindor: "Открою: кто не рискует, тот не узнает",
  quiz_book_slytherin: "Открою, когда никто не видит",
  quiz_book_ravenclaw: "Сначала прочитаю всё о том, почему её нельзя открывать",
  quiz_book_hufflepuff: "Отнесу библиотекарю",
  quiz_subject: "Какого урока вы ждёте больше всего?",
  quiz_subject_gryffindor: "Защита от Тёмных искусств",
  quiz_subject_slytherin: "Зельеварение",
  quiz_subject_ravenclaw: "Заклинания",
  quiz_subject_hufflepuff: "Травология",
  quiz_legacy: "Каким вас должны запомнить?",
  quiz_legacy_gryffindor: "Смелым",
  quiz_legacy_slytherin: "Великим",
  quiz_legacy_ravenclaw: "Мудрым",
  quiz_legacy_hufflepuff: "Добрым",
  quiz_team: "Общий проект пошёл не так. Что вы сделаете?",
  quiz_team_gryffindor: "Возьму вину на себя и всё исправлю",
  quiz_team_slytherin: "Возьму руководство в свои руки",
  quiz_team_ravenclaw: "Найду ошибку и придумаю решение",
  quiz_team_hufflepuff: "Поддержу остальных и доделаю свою часть",
  commandPensieve: "Омут памяти: старое воспоминание",
  commandTimeTurner: "Маховик времени: год назад в этот день",
  commandCloak: "Мантия-невидимка: спрятать выделенное",
  pensieveTitle: "Омут памяти",
  timeTurnerTitle: "Маховик времени",
  pensieveNotice: "Воспоминание из Омута памяти: «{0}». Дней без изменений: {1}.",
  pensieveEmpty: "Омут памяти пуст: заметок пока нет.",
  timeTurnerNotice: "Три оборота Маховика времени: {0}.",
  timeTurnerEmpty: "{0} ничего не записывали.",
  timeTurnerPlaceholder: "Заметки за {0}",
  cloakTitle: "Мантия-невидимка",
  pointsDaily: "+{0} очков факультету {1} за запись в дневнике!"
};
function createTranslator(language) {
  const dict = language.toLowerCase().startsWith("ru") ? ru : en;
  return (key, ...args) => dict[key].replace(/\{(\d+)\}/g, (m, i) => String(args[Number(i)] ?? m));
}

// src/spells.ts
var SPELLS = [
  { id: "solemnlySwear", words: ["i solemnly swear that i am up to no good", "solemnly swear", "клянусь что замышляю только шалость"] },
  { id: "mischiefManaged", words: ["mischief managed", "шалость удалась"] },
  { id: "accioSnitch", words: ["accio snitch", "акцио снитч"] },
  { id: "wingardiumLeviosa", words: ["wingardium leviosa", "вингардиум левиоса"] },
  { id: "lumos", words: ["lumos", "люмос"] },
  { id: "nox", words: ["nox", "нокс"] }
];
var KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
var KONAMI_ALIASES = { "и": "b", "ф": "a" };
var MAX_BUFFER = 48;
var SPELL_TIMEOUT = 3e3;
function normalize(phrase) {
  return phrase.toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
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
  let last = -Infinity;
  return {
    push(key, now = Date.now()) {
      if (typeof key !== "string") return null;
      if (now - last > SPELL_TIMEOUT) {
        text = "";
        keys = [];
      }
      last = now;
      const k = key.toLowerCase();
      keys.push(KONAMI_ALIASES[k] ?? k);
      if (keys.length > KONAMI.length) keys.shift();
      if (keys.length === KONAMI.length && keys.every((x, i) => x === KONAMI[i])) {
        keys = [];
        text = "";
        return "accioSnitch";
      }
      if ([...k].length !== 1) return null;
      const ch = /[\p{L}\p{N}]/u.test(k) ? k === "ё" ? "е" : k : " ";
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
var viewOf = (doc) => doc.defaultView ?? window;
var LEVITATE_TARGETS = ".nav-file-title, .nav-folder-title, .tree-item-self, .workspace-tab-header, .side-dock-ribbon-action, .status-bar-item, .callout, .cm-line, .inline-title, p, li, h1, h2, h3, h4, h5, h6, blockquote, pre, img, table, .setting-item";
var Effects = class {
  constructor(reducedMotion) {
    this.reducedMotion = reducedMotion;
    this.layers = /* @__PURE__ */ new Map();
    this.snitch = null;
    this.timers = /* @__PURE__ */ new Set();
    this.pointer = { x: 0, y: 0, doc: null };
  }
  /** Где курсор в этом документе; если он в другом окне — середина окна, чуть выше центра. */
  pointerIn(doc) {
    if (this.pointer.doc === doc) return { x: this.pointer.x, y: this.pointer.y };
    const view = viewOf(doc);
    return { x: view.innerWidth / 2, y: view.innerHeight / 3 };
  }
  trackPointer(e) {
    this.pointer = { x: e.clientX, y: e.clientY, doc: e.view?.document ?? e.target?.ownerDocument ?? null };
  }
  /** Окно закрыли: его слой больше не нужен. */
  forget(doc) {
    this.layers.get(doc)?.remove();
    this.layers.delete(doc);
    if (this.pointer.doc === doc) this.pointer.doc = null;
    if (this.snitch?.ownerDocument === doc) this.snitch = null;
  }
  destroy() {
    for (const id of this.timers) window.clearTimeout(id);
    this.timers.clear();
    for (const layer of this.layers.values()) layer.remove();
    this.layers.clear();
    this.snitch = null;
  }
  get snitchActive() {
    return this.snitch !== null;
  }
  // ---------- Lumos / Nox ----------
  lumos(doc) {
    const size = 80;
    const at = this.pointerIn(doc);
    const view = viewOf(doc);
    const glow = this.add(doc, "div", "hp-glow");
    glow.style.left = `${at.x - size / 2}px`;
    glow.style.top = `${at.y - size / 2}px`;
    const scale = Math.hypot(view.innerWidth, view.innerHeight) / size * 2.2;
    this.removeAfter(glow.animate([
      { transform: "scale(.2)", opacity: 1 },
      { transform: `scale(${scale})`, opacity: 0.85, offset: 0.55 },
      { transform: `scale(${scale})`, opacity: 0 }
    ], { duration: this.reducedMotion() ? 400 : 1100, easing: "ease-out" }), glow);
  }
  nox(doc) {
    const at = this.pointerIn(doc);
    const shade = this.add(doc, "div", "hp-shade");
    shade.style.background = `radial-gradient(circle at ${at.x}px ${at.y}px, rgba(0,0,0,0) 0, rgba(0,0,0,.92) 220px)`;
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
  trail(doc, colors, x, y) {
    const svg = doc.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "hp-trail");
    svg.style.setProperty("--hp-trail-glow", colors.glow);
    svg.style.setProperty("--hp-trail-ink", colors.ink);
    const lines = ["hp-trail-glow", "hp-trail-core"].map((cls) => {
      const line = svg.appendChild(doc.createElementNS(SVG_NS, "polyline"));
      line.setAttribute("class", cls);
      return line;
    });
    this.getLayer(doc).appendChild(svg);
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
        if (success) this.sparkle(doc, last.x, last.y, colors);
        else svg.classList.add("is-fizzled");
        this.removeAfter(svg.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: this.reducedMotion() ? 200 : success ? 700 : 450, easing: "ease-out", fill: "forwards" }
        ), svg);
      },
      cancel: () => svg.remove()
    };
  }
  levitate(doc, x, y) {
    const hit = doc.elementFromPoint(x, y);
    const target = hit?.closest(LEVITATE_TARGETS) ?? doc.querySelector(".workspace-leaf.mod-active .view-content") ?? doc.querySelector(".workspace");
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
  marauders(doc, lines) {
    const card = this.add(doc, "div", "hp-map-card");
    for (const line of lines.slice(0, 2)) card.appendChild(doc.createElement("div")).textContent = line;
    const title = card.appendChild(doc.createElement("div"));
    title.className = "hp-map-title";
    title.textContent = lines[2];
    this.removeAfter(card.animate([
      { opacity: 0, filter: "blur(6px)" },
      { opacity: 1, filter: "blur(0)", offset: 0.18 },
      { opacity: 1, filter: "blur(0)", offset: 0.8 },
      { opacity: 0, filter: "blur(4px)" }
    ], { duration: 5200, easing: "ease-in-out" }), card);
    if (this.reducedMotion()) return;
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
      const foot = this.add(doc, "div", "hp-footprint");
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
  inkFade(doc) {
    const ink = this.add(doc, "div", "hp-shade");
    ink.style.background = "radial-gradient(circle, rgba(74,46,20,0) 30%, rgba(74,46,20,.35))";
    this.removeAfter(ink.animate([{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 1200 }), ink);
  }
  // ---------- Золотой снитч ----------
  releaseSnitch(doc, { label, onCatch }) {
    if (this.snitch?.isConnected) return;
    const view = viewOf(doc);
    const btn = this.add(doc, "button", "hp-snitch");
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
    let pos = { x: -70, y: rand(40, view.innerHeight - 80) };
    let current = null;
    let caught = false;
    const deadline = Date.now() + 25e3;
    const fly = () => {
      if (caught || !btn.isConnected) return;
      const leaving = Date.now() > deadline;
      const next = leaving ? { x: view.innerWidth + 90, y: rand(-60, view.innerHeight / 2) } : { x: rand(10, view.innerWidth - 80), y: rand(40, view.innerHeight - 60) };
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
      this.sparkle(doc, box.left + box.width / 2, box.top + box.height / 2);
      this.removeAfter(btn.animate(
        [{ opacity: 1 }, { opacity: 0, transform: `translate(${box.left}px, ${box.top}px) scale(.3)` }],
        { duration: 400, fill: "forwards" }
      ), btn);
      this.snitch = null;
      onCatch();
    });
    fly();
  }
  // ---------- Очки факультету ----------
  /** «+10» всплывает над элементом (счётчиком очков в статус-баре) и тает. */
  floatText(anchor, text) {
    const doc = anchor.ownerDocument;
    const box = anchor.getBoundingClientRect();
    const el = this.add(doc, "div", "hp-float-points");
    el.textContent = text;
    el.style.left = `${box.left + box.width / 2}px`;
    el.style.top = `${box.top}px`;
    const rise = this.reducedMotion() ? 0 : -28;
    this.removeAfter(el.animate([
      { transform: "translate(-50%, 0)", opacity: 0 },
      { transform: `translate(-50%, ${rise / 3}px)`, opacity: 1, offset: 0.2 },
      { transform: `translate(-50%, ${rise}px)`, opacity: 0 }
    ], { duration: 1400, easing: "ease-out" }), el);
  }
  sparkle(doc, x, y, colors) {
    const dark = doc.body.classList.contains("theme-dark");
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * Math.PI * 2;
      const r = rand(40, 80);
      const dot = this.add(doc, "div", "hp-spark");
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
  getLayer(doc) {
    let layer = this.layers.get(doc);
    if (layer?.isConnected) return layer;
    layer = doc.createElement("div");
    layer.className = "hp-overlay";
    doc.body.appendChild(layer);
    this.layers.set(doc, layer);
    return layer;
  }
  add(doc, tag, cls) {
    const el = doc.createElement(tag);
    el.className = cls;
    this.getLayer(doc).appendChild(el);
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
function eventDocument(e) {
  const view = e.view;
  if (view?.document) return view.document;
  const target = e.target;
  return target?.ownerDocument ?? target?.defaultView?.document ?? document;
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
    this.stroke = {
      points: [{ x: e.clientX, y: e.clientY }],
      moved: false,
      trail: null,
      pointerId: e.pointerId,
      doc: eventDocument(e),
      alt: e.altKey,
      menu: null
    };
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
      s.trail = this.effects.trail(s.doc, this.host.colors(), start.x, start.y);
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
      if (isEditable(e.target) && !s.alt) {
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
      if (result) this.host.cast(result.spell, s.points[0], s.doc);
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

// src/marauders.ts
var import_obsidian = require("obsidian");

// src/map.ts
var GHOST = "?";
function isGhost(id) {
  return id.startsWith(GHOST);
}
var ghostId = (linktext) => GHOST + linktext;
var ghostLink = (id) => id.slice(GHOST.length);
var isNote = (path) => path.endsWith(".md") && !isGhost(path);
function isTag(id) {
  return id.startsWith("#") && !isNote(id);
}
function noteName(path) {
  if (isTag(path)) return path;
  const name = isGhost(path) ? ghostLink(path) : path;
  return name.slice(name.lastIndexOf("/") + 1).replace(/\.md$/, "");
}
function noteFolder(path) {
  if (isTag(path) || isGhost(path)) return "";
  const i = path.lastIndexOf("/");
  return i < 0 ? "" : path.slice(0, i);
}
function inFolder(path, folders, anyDepth = false) {
  const p = "/" + path;
  return folders.some((f) => path.startsWith(f + "/") || anyDepth && p.includes("/" + f + "/"));
}
var collator = new Intl.Collator();
var byName = (a, b) => collator.compare(noteName(a), noteName(b)) || collator.compare(a, b);
var LinkGraph = class {
  /**
   * Вложения (картинки, PDF) в граф не попадают: через общую картинку заметки не связаны.
   * Теги сравниваются без учёта регистра, как в Obsidian; на карте — написание из первой заметки.
   */
  constructor(links, tags = {}, options = {}) {
    this.out = /* @__PURE__ */ new Map();
    this.in = /* @__PURE__ */ new Map();
    /** Заметка → её теги и тег → его заметки. */
    this.tagged = /* @__PURE__ */ new Map();
    /** Заметка → неизведанные комнаты, на которые она ссылается. */
    this.ghostsOf = /* @__PURE__ */ new Map();
    /** Тег без учёта регистра → написание на карте. */
    this.tagIds = /* @__PURE__ */ new Map();
    /** Отсортированные соседи: поиск пути спрашивает их много раз. */
    this.sorted = /* @__PURE__ */ new Map();
    this.exclude = options.exclude ?? [];
    const unresolved = options.unresolved ?? {};
    const paths = /* @__PURE__ */ new Set([...Object.keys(links), ...Object.keys(tags), ...Object.keys(unresolved)]);
    for (const path of paths) this.addNote(path, links[path], tags[path], unresolved[path]);
  }
  /** Заметку поправили: её ссылки, теги и неизведанные комнаты — заново, остальной граф не трогаем. */
  setNote(path, links, tags, unresolved) {
    this.removeNote(path);
    this.addNote(path, links, tags, unresolved);
    this.sorted.clear();
  }
  excluded(path) {
    return inFolder(path, this.exclude);
  }
  addNote(path, links, tags, unresolved) {
    if (!isNote(path) || this.excluded(path)) return;
    for (const to of Object.keys(links ?? {})) {
      if (to === path || !isNote(to) || this.excluded(to)) continue;
      link(this.out, path, to);
      link(this.in, to, path);
    }
    for (const raw of tags ?? []) {
      const tag = raw.startsWith("#") ? raw : `#${raw}`;
      if (tag.length < 2) continue;
      const key = tag.toLowerCase();
      if (!this.tagIds.has(key)) this.tagIds.set(key, tag);
      const id = this.tagIds.get(key);
      link(this.tagged, path, id);
      link(this.tagged, id, path);
    }
    for (const text of Object.keys(unresolved ?? {})) {
      if (text) link(this.ghostsOf, path, ghostId(text));
    }
  }
  removeNote(path) {
    for (const to of this.out.get(path) ?? []) this.in.get(to)?.delete(path);
    this.out.delete(path);
    for (const tag of this.tagged.get(path) ?? []) {
      const notes = this.tagged.get(tag);
      notes?.delete(path);
      if (notes && !notes.size) {
        this.tagged.delete(tag);
        this.tagIds.delete(tag.toLowerCase());
      }
    }
    this.tagged.delete(path);
    this.ghostsOf.delete(path);
  }
  passage(from, to) {
    if (this.tagged.get(from)?.has(to)) return "tag";
    const forward = this.out.get(from)?.has(to) ?? false;
    const back = this.in.get(from)?.has(to) ?? false;
    return forward && back ? "both" : forward ? "link" : back ? "backlink" : null;
  }
  /**
   * Соседи: сначала куда ведут ссылки из текста, потом откуда ссылаются сюда, потом теги;
   * внутри — по имени. У тега соседи — заметки с этим тегом. Список общий, менять его нельзя.
   */
  neighbors(path) {
    let list = this.sorted.get(path);
    if (!list) {
      const out = [...this.out.get(path) ?? []].sort(byName);
      const back = [...this.in.get(path) ?? []].filter((p) => !this.out.get(path)?.has(p)).sort(byName);
      const tags = [...this.tagged.get(path) ?? []].sort(byName);
      list = [...out, ...back, ...tags].map((p) => ({ path: p, passage: this.passage(path, p) }));
      this.sorted.set(path, list);
    }
    return list;
  }
  /** Неизведанные комнаты: ссылки из заметки на заметки, которых ещё нет. По имени. */
  ghosts(path) {
    return [...this.ghostsOf.get(path) ?? []].sort(byName);
  }
  degree(path) {
    const out = this.out.get(path);
    let n = (out?.size ?? 0) + (this.tagged.get(path)?.size ?? 0);
    for (const p of this.in.get(path) ?? []) if (!out?.has(p)) n++;
    return n;
  }
  /**
   * Кратчайший путь по ссылкам в обе стороны и через теги: обратная ссылка и общий тег — тоже тайные ходы.
   * При равной длине предпочитаются ссылки из текста — по ним проще идти.
   * Возвращает узлы от from до to включительно (теги — как промежуточные) или null, если хода нет.
   */
  route(from, to) {
    if (from === to) return [from];
    const prev = /* @__PURE__ */ new Map([[from, ""]]);
    let layer = [from];
    while (layer.length) {
      const next = [];
      for (const node of layer) {
        for (const { path } of this.neighbors(node)) {
          if (prev.has(path)) continue;
          prev.set(path, node);
          if (path === to) {
            const route = [to];
            for (let p = node; p; p = prev.get(p)) route.unshift(p);
            return route;
          }
          next.push(path);
        }
      }
      layer = next;
    }
    return null;
  }
};
function link(map, from, to) {
  let set = map.get(from);
  if (!set) map.set(from, set = /* @__PURE__ */ new Set());
  set.add(to);
}
function nextNote(steps) {
  return steps.slice(1).find((p) => !isTag(p)) ?? null;
}
function routeSteps(graph, steps) {
  const out = [];
  steps.forEach((path, i) => {
    if (isTag(path)) return;
    const prev = steps[i - 1];
    if (prev === void 0) out.push({ path, passage: null, tag: null });
    else if (isTag(prev)) out.push({ path, passage: "tag", tag: prev });
    else out.push({ path, passage: graph.passage(prev, path), tag: null });
  });
  return out;
}
function followRoute(graph, route, current) {
  if (current === route.target) return { route: null, status: "arrived" };
  const i = route.steps?.indexOf(current) ?? -1;
  if (i >= 0) return { route: { ...route, steps: route.steps.slice(i) }, status: "onRoute" };
  const steps = graph.route(current, route.target);
  return { route: { ...route, steps }, status: steps ? "rerouted" : "lost" };
}
function revalidateRoute(graph, route, current) {
  const steps = route.steps;
  const start = current ?? steps?.[0];
  if (steps && steps.every((p, i) => i === 0 || graph.passage(steps[i - 1], p) !== null) && (!current || steps[0] === current)) {
    return { route, status: null };
  }
  if (!start) return { route, status: null };
  const fresh = graph.route(start, route.target);
  if (!steps) return fresh ? { route: { ...route, steps: fresh }, status: null } : { route, status: null };
  return { route: { ...route, steps: fresh }, status: fresh ? "changed" : "lost" };
}
var FOOTPRINTS_MAX = 12;
function addFootprint(footprints, path, max = FOOTPRINTS_MAX) {
  return [path, ...footprints.filter((p) => p !== path)].slice(0, max);
}
var RESTRICTED_FOLDERS = ["Restricted Section", "Запретная секция"];
function isRestricted(path, extra = []) {
  return inFolder(path, [...RESTRICTED_FOLDERS, ...extra], true);
}
var MAP_RINGS = { ring1: { rx: 70, ry: 98 }, ring2: { rx: 122, ry: 150 } };
var MAP_LIMITS = { ring1: 12, ring2: 16 };
function layoutMap(graph, center, route = [], limits = MAP_LIMITS) {
  const nodes = [{ path: center, x: 0, y: 0, ring: 0, parent: null, passage: null }];
  const all = [...graph.neighbors(center), ...graph.ghosts(center).map((path) => ({ path, passage: "link" }))];
  const first = route[0] === center ? route[1] : void 0;
  const isFirst = (n) => Number(n.path === first);
  const tagFirst = (n) => Number(isTag(n.path));
  const ordered = all.map((n, i) => ({ ...n, i, degree: graph.degree(n.path) })).sort((a, b) => isFirst(b) - isFirst(a) || tagFirst(b) - tagFirst(a) || b.degree - a.degree || a.i - b.i).slice(0, limits.ring1).sort((a, b) => isFirst(b) - isFirst(a) || a.i - b.i);
  const taken = /* @__PURE__ */ new Set([center, ...ordered.map((n) => n.path)]);
  const step = Math.PI * 2 / Math.max(ordered.length, 1);
  const children = /* @__PURE__ */ new Map();
  let budget = limits.ring2;
  const perParent = Math.min(3, Math.max(1, Math.ceil(limits.ring2 / Math.max(ordered.length, 1))));
  const second = first ? route[2] : void 0;
  for (const n of ordered) {
    const isSecond = (k) => Number(n.path === first && k.path === second);
    const kids = graph.neighbors(n.path).filter((k) => !taken.has(k.path)).sort((a, b) => isSecond(b) - isSecond(a));
    const pick = kids.slice(0, Math.min(perParent, budget));
    for (const k of pick) taken.add(k.path);
    budget -= pick.length;
    children.set(n.path, pick);
  }
  ordered.forEach((n, i) => {
    const angle = -Math.PI / 2 + i * step;
    nodes.push({ path: n.path, ...ellipse(MAP_RINGS.ring1, angle), ring: 1, parent: center, passage: n.passage });
    const kids = children.get(n.path) ?? [];
    const spread = Math.min(step * 0.7, 0.8);
    kids.forEach((k, j) => {
      const a = kids.length > 1 ? angle - spread / 2 + spread * j / (kids.length - 1) : angle;
      const inset = j % 2 ? 10 : 0;
      const ring = { rx: MAP_RINGS.ring2.rx - inset, ry: MAP_RINGS.ring2.ry - inset };
      nodes.push({ path: k.path, ...ellipse(ring, a), ring: 2, parent: n.path, passage: k.passage });
    });
  });
  return { nodes, hidden: all.length - ordered.length };
}
function ellipse({ rx, ry }, angle) {
  return { x: round(Math.cos(angle) * rx), y: round(Math.sin(angle) * ry) };
}
var round = (v) => Math.round(v * 10) / 10;
function footsteps(a, b, spacing = 15, margin = 14) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const count2 = Math.floor((len - margin * 2) / spacing);
  if (count2 < 1) return [];
  const ux = dx / len;
  const uy = dy / len;
  const angle = round(Math.atan2(dy, dx) * 180 / Math.PI + 90);
  const start = (len - (count2 - 1) * spacing) / 2;
  return Array.from({ length: count2 }, (_, i) => {
    const d = start + i * spacing;
    const side = i % 2 ? 3.5 : -3.5;
    return { x: round(a.x + ux * d - uy * side), y: round(a.y + uy * d + ux * side), angle };
  });
}

// src/marauders.ts
var MAP_VIEW = "hp-marauders-map";
var SVG_NS2 = "http://www.w3.org/2000/svg";
var LABEL_MAX = 14;
var GRAPH_DELAY = 400;
var PERSIST_DELAY = 5e3;
var MaraudersMap = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.route = null;
    /** Что случилось с маршрутом при последнем переходе: на карте пишется «путь перестроен». */
    this.routeStatus = null;
    this.footprints = [];
    this.cachedGraph = null;
    /** С какими настройками построен граф: теги, исключённые папки, неизведанные комнаты. */
    this.graphKey = "";
    /** Заметки, чьи ссылки поменялись с последнего обновления графа. */
    this.dirty = /* @__PURE__ */ new Set();
    /** Файлы переименовали, удалили или создали — граф проще построить заново. */
    this.rebuild = false;
    this.flushTimer = 0;
  }
  get app() {
    return this.plugin.app;
  }
  get t() {
    return this.plugin.t;
  }
  load() {
    const { plugin, app, t } = this;
    const saved = plugin.settings;
    this.footprints = [...saved.footprints];
    this.route = saved.route ? { ...saved.route } : null;
    plugin.registerView(MAP_VIEW, (leaf) => new MaraudersMapView(leaf, this));
    plugin.registerHoverLinkSource(MAP_VIEW, { display: t("mapTitle"), defaultMod: true });
    plugin.addRibbonIcon("footprints", t("mapTitle"), () => void this.reveal());
    plugin.addCommand({ id: "marauders-map", name: t("commandMapOpen"), callback: () => void this.reveal() });
    plugin.addCommand({ id: "marauders-route", name: t("commandMapRoute"), callback: () => this.planRoute() });
    plugin.addCommand({
      id: "marauders-next",
      name: t("commandMapNext"),
      checkCallback: (checking) => {
        if (!this.nextStep) return false;
        if (!checking) this.goNext();
        return true;
      }
    });
    plugin.registerEvent(app.workspace.on("file-open", (file) => this.onFileOpen(file)));
    plugin.registerEvent(app.workspace.on("active-leaf-change", () => this.refresh()));
    plugin.registerEvent(app.workspace.on("layout-change", () => this.refresh()));
    plugin.registerEvent(app.metadataCache.on("resolve", (file) => this.markDirty(file.path)));
    plugin.registerEvent(app.metadataCache.on("resolved", () => this.scheduleFlush()));
    plugin.registerEvent(app.vault.on("rename", (file, oldPath) => this.onRename(file.path, oldPath)));
    plugin.registerEvent(app.vault.on("delete", (file) => this.onDelete(file)));
    plugin.registerEvent(app.vault.on("create", () => this.rebuildSoon()));
    plugin.register(() => window.clearTimeout(this.flushTimer));
    app.workspace.onLayoutReady(() => {
      const exists = (p) => app.vault.getAbstractFileByPath(p) instanceof import_obsidian.TFile;
      this.footprints = this.footprints.filter(exists);
      if (this.route && !exists(this.route.target)) this.route = null;
      const here = this.here();
      if (here) this.footprints = addFootprint(this.footprints, here);
      this.persist();
      this.refresh();
    });
  }
  get graph() {
    const { settings } = this.plugin;
    const key = JSON.stringify([settings.mapTags, settings.mapUnresolved, settings.mapExclude]);
    if (!this.cachedGraph || this.graphKey !== key) {
      const { metadataCache } = this.app;
      this.graphKey = key;
      this.dirty.clear();
      this.rebuild = false;
      this.cachedGraph = new LinkGraph(metadataCache.resolvedLinks, settings.mapTags ? this.tags() : {}, {
        unresolved: settings.mapUnresolved ? metadataCache.unresolvedLinks : {},
        exclude: settings.mapExclude
      });
    }
    return this.cachedGraph;
  }
  /** Теги всех заметок: из текста и из свойств (frontmatter). */
  tags() {
    const tags = {};
    for (const file of this.app.vault.getMarkdownFiles()) {
      const list = this.tagsOf(file);
      if (list?.length) tags[file.path] = list;
    }
    return tags;
  }
  tagsOf(file) {
    const cache = this.app.metadataCache.getFileCache(file);
    return cache && (0, import_obsidian.getAllTags)(cache) || void 0;
  }
  markDirty(path) {
    this.dirty.add(path);
    this.scheduleFlush();
  }
  rebuildSoon() {
    this.rebuild = true;
    this.scheduleFlush();
  }
  scheduleFlush() {
    window.clearTimeout(this.flushTimer);
    this.flushTimer = window.setTimeout(() => this.flush(), GRAPH_DELAY);
  }
  /** Применить накопленные правки к графу, проверить маршрут и перерисовать карту. */
  flush() {
    window.clearTimeout(this.flushTimer);
    this.flushTimer = 0;
    if (this.rebuild) this.cachedGraph = null;
    const graph = this.cachedGraph;
    if (graph) {
      const { resolvedLinks, unresolvedLinks } = this.app.metadataCache;
      const { mapTags, mapUnresolved } = this.plugin.settings;
      for (const path of this.dirty) {
        const file = this.app.vault.getAbstractFileByPath(path);
        const tags = mapTags && file instanceof import_obsidian.TFile ? this.tagsOf(file) : void 0;
        graph.setNote(path, resolvedLinks[path], tags, mapUnresolved ? unresolvedLinks[path] : void 0);
      }
    }
    this.dirty.clear();
    this.rebuild = false;
    this.checkRoute();
    this.refresh();
  }
  /** Граф мог поменяться: по маршруту ещё можно пройти? */
  checkRoute() {
    if (!this.route) return;
    const { route, status } = revalidateRoute(this.graph, this.route, this.here());
    if (route === this.route) return;
    this.route = route;
    this.routeStatus = status;
    this.persist();
  }
  /** Поменялись настройки карты: граф и маршрут — заново. */
  settingsChanged() {
    this.checkRoute();
    this.refresh();
  }
  /** Открытая заметка (последняя, если сейчас в фокусе боковая панель). */
  here() {
    const file = this.app.workspace.getActiveFile();
    return file && file.extension === "md" ? file.path : null;
  }
  get nextStep() {
    const steps = this.route?.steps;
    return steps && steps[0] === this.here() ? nextNote(steps) : null;
  }
  async reveal() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(MAP_VIEW)[0];
    if (!leaf) {
      const right = workspace.getRightLeaf(false);
      if (!right) return;
      await right.setViewState({ type: MAP_VIEW, active: true });
      leaf = right;
    }
    await workspace.revealLeaf(leaf);
  }
  /** «Шалость удалась»: карта стирается. */
  close() {
    this.app.workspace.detachLeavesOfType(MAP_VIEW);
  }
  open(path, evt) {
    if (isTag(path)) {
      this.searchTag(path);
      return;
    }
    const newLeaf = evt ? import_obsidian.Keymap.isModEvent(evt) : false;
    if (isGhost(path)) {
      void this.app.workspace.openLinkText(ghostLink(path), this.here() ?? "", newLeaf);
      return;
    }
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof import_obsidian.TFile)) return;
    void this.app.workspace.getLeaf(newLeaf).openFile(file);
  }
  /** Тег на карте: все заметки с ним — в поиске Obsidian. API поиска не публичное. */
  searchTag(tag) {
    const app = this.app;
    app.internalPlugins?.getPluginById?.("global-search")?.instance?.openGlobalSearch?.(`tag:${tag}`);
  }
  planRoute() {
    const here = this.here();
    if (!here) {
      new import_obsidian.Notice(this.t("mapNoNote"));
      return;
    }
    new RouteModal(this.app, this.t, here, (file) => this.setRoute(here, file.path)).open();
  }
  setRoute(from, to) {
    const steps = this.graph.route(from, to);
    if (!steps) {
      new import_obsidian.Notice(this.t("mapNoPath", noteName(to)));
      return;
    }
    this.route = { target: to, steps };
    this.routeStatus = null;
    this.persist();
    this.refresh();
    void this.reveal();
  }
  clearRoute() {
    this.route = null;
    this.routeStatus = null;
    this.persist();
    this.refresh();
  }
  goNext() {
    const next = this.nextStep;
    if (next) this.open(next);
  }
  refresh() {
    for (const leaf of this.app.workspace.getLeavesOfType(MAP_VIEW)) {
      if (leaf.view instanceof MaraudersMapView) leaf.view.refresh();
    }
  }
  /** Следы и маршрут — в data.json, чтобы пережить перезапуск. */
  persist() {
    const { settings } = this.plugin;
    settings.footprints = [...this.footprints];
    settings.route = this.route ? { target: this.route.target, steps: this.route.steps ? [...this.route.steps] : null } : null;
    this.plugin.saveSoon(PERSIST_DELAY);
  }
  onFileOpen(file) {
    if (!file || file.extension !== "md") return;
    this.footprints = addFootprint(this.footprints, file.path);
    if (this.route) {
      const { route, status } = followRoute(this.graph, this.route, file.path);
      if (status === "arrived") new import_obsidian.Notice(this.t("mapArrived", noteName(this.route.target)));
      this.route = route;
      this.routeStatus = route ? status : null;
    }
    this.persist();
    this.refresh();
  }
  onRename(path, oldPath) {
    const rename = (p) => p === oldPath ? path : p.startsWith(oldPath + "/") ? path + p.slice(oldPath.length) : p;
    this.footprints = this.footprints.map(rename);
    if (this.route) this.route = { target: rename(this.route.target), steps: this.route.steps?.map(rename) ?? null };
    this.persist();
    this.rebuildSoon();
  }
  onDelete(file) {
    const gone = (p) => p === file.path || p.startsWith(file.path + "/");
    this.footprints = this.footprints.filter((p) => !gone(p));
    if (this.route && gone(this.route.target)) {
      this.route = null;
      this.routeStatus = null;
    }
    this.persist();
    this.rebuildSoon();
  }
};
var MaraudersMapView = class extends import_obsidian.ItemView {
  constructor(leaf, map) {
    super(leaf);
    this.map = map;
    this.hoverPopover = null;
    /** Что нарисовано сейчас: карта перерисовывается, только если что-то поменялось. */
    this.drawn = "";
    /** Карту не видно (свёрнутая панель, соседняя вкладка): нарисуем, когда покажут. */
    this.stale = false;
  }
  getViewType() {
    return MAP_VIEW;
  }
  getDisplayText() {
    return this.map.t("mapTitle");
  }
  getIcon() {
    return "footprints";
  }
  async onOpen() {
    this.contentEl.addClass("hp-marauders");
    const view = this.containerEl.ownerDocument.defaultView ?? window;
    if (typeof view.ResizeObserver === "function") {
      const observer = new view.ResizeObserver(() => {
        if (this.stale) this.refresh();
      });
      observer.observe(this.containerEl);
      this.register(() => observer.disconnect());
    }
    this.refresh();
  }
  async onClose() {
    this.contentEl.empty();
    this.drawn = "";
  }
  get visible() {
    const el = this.containerEl;
    return el.isConnected && el.offsetWidth > 0 && !el.closest(".is-collapsed");
  }
  /** Перерисовать, если карту видно; иначе — когда покажут. */
  refresh() {
    this.stale = !this.visible;
    if (!this.stale) this.render();
  }
  render() {
    const { map, contentEl } = this;
    const here = map.here();
    const route = map.route;
    const steps = here && route?.steps && route.steps[0] === here ? route.steps : [];
    const { mapDepth, restrictedFolders } = map.plugin.settings;
    const limits = mapDepth === 1 ? { ...MAP_LIMITS, ring2: 0 } : MAP_LIMITS;
    const layout = here ? layoutMap(map.graph, here, steps, limits) : null;
    const footprints = map.footprints.filter((p) => p !== here).slice(0, FOOTPRINTS_MAX - 4);
    const state = JSON.stringify([here, layout, route, map.routeStatus, footprints, restrictedFolders]);
    if (state === this.drawn) return;
    this.drawn = state;
    contentEl.empty();
    const { t } = map;
    const head = contentEl.createDiv({ cls: "hp-marauders-head" });
    head.createDiv({ cls: "hp-marauders-title", text: t("mapTitle") });
    head.createDiv({ cls: "hp-marauders-motto", text: t("eggMap1") });
    if (!here || !layout) {
      contentEl.createEl("p", { cls: "hp-marauders-empty", text: t("mapEmpty") });
      this.renderFootprints(footprints);
      return;
    }
    const parchment = contentEl.createDiv({ cls: "hp-marauders-parchment" });
    this.renderMap(parchment, layout.nodes, steps, new Set(footprints), route?.target ?? null);
    if (layout.hidden > 0) parchment.createDiv({ cls: "hp-marauders-hidden", text: t("mapHidden", layout.hidden) });
    if (layout.nodes.length === 1) contentEl.createEl("p", { cls: "hp-marauders-empty", text: t("mapLonely") });
    else {
      const legend = contentEl.createDiv({ cls: "hp-marauders-legend" });
      legend.createSpan({ cls: "hp-legend-link", text: t("mapLegendLink") });
      legend.createSpan({ cls: "hp-legend-backlink", text: t("mapLegendBacklink") });
      if (layout.nodes.some((n) => isTag(n.path))) legend.createSpan({ cls: "hp-legend-tag", text: t("mapLegendTag") });
      if (layout.nodes.some((n) => isGhost(n.path))) legend.createSpan({ cls: "hp-legend-ghost", text: t("mapLegendGhost") });
    }
    this.renderRoute(here);
    this.renderFootprints(footprints);
  }
  renderMap(parent, nodes, steps, visited, target) {
    const svg = svgEl(parent, "svg", { viewBox: "-180 -176 360 352", class: "hp-marauders-svg", role: "group", "aria-label": this.map.t("mapTitle") });
    const at = new Map(nodes.map((n) => [n.path, n]));
    const edges = svgEl(svg, "g", { class: "hp-map-edges" });
    const trail = svgEl(svg, "g", { class: "hp-map-steps", "aria-hidden": "true" });
    const dots = svgEl(svg, "g", { class: "hp-map-nodes" });
    const onRoute = (a, b) => steps.indexOf(b) === steps.indexOf(a) + 1 && steps.includes(a);
    for (const node of nodes) {
      const from = node.parent ? at.get(node.parent) : null;
      if (!from) continue;
      const mx = (from.x + node.x) / 2 - (node.y - from.y) * 0.08;
      const my = (from.y + node.y) / 2 + (node.x - from.x) * 0.08;
      svgEl(edges, "path", {
        d: `M${from.x} ${from.y}Q${round2(mx)} ${round2(my)} ${node.x} ${node.y}`,
        class: `hp-map-edge is-${node.passage}` + (isGhost(node.path) ? " is-ghost" : "") + (onRoute(from.path, node.path) ? " is-route" : "")
      });
    }
    let i = 0;
    for (let s = 1; s < steps.length; s++) {
      const a = at.get(steps[s - 1]);
      const b = at.get(steps[s]);
      if (!a || !b) break;
      for (const f of footsteps(a, b)) {
        const foot = svgEl(trail, "ellipse", { cx: f.x, cy: f.y, rx: 2.3, ry: 3.8, transform: `rotate(${f.angle} ${f.x} ${f.y})` });
        foot.style.setProperty("--i", String(i++));
      }
    }
    for (const node of nodes) this.renderNode(dots, node, steps, visited, target);
  }
  renderNode(parent, node, steps, visited, target) {
    const { t } = this.map;
    const name = noteName(node.path);
    const tag = isTag(node.path);
    const ghost = isGhost(node.path);
    const cls = ["hp-map-node", `ring-${node.ring}`];
    if (node.ring === 0) cls.push("is-here");
    if (tag) cls.push("is-tag");
    if (ghost) cls.push("is-ghost");
    if (nextNote(steps) === node.path) cls.push("is-next");
    if (steps.includes(node.path) && node.ring > 0) cls.push("is-route");
    if (node.path === target) cls.push("is-target");
    if (visited.has(node.path)) cls.push("is-visited");
    if (isRestricted(node.path, this.map.plugin.settings.restrictedFolders)) cls.push("is-restricted");
    const label = node.ring === 0 ? `${name} — ${t("mapHere")}` : tag ? `${name} — ${t("mapTagHint")}` : ghost ? `${name} — ${t("mapGhostHint")}` : `${name}${passageHint(t, node.passage)}`;
    const g = svgEl(parent, "g", {
      class: cls.join(" "),
      "data-path": node.path,
      transform: `translate(${node.x} ${node.y})`,
      tabindex: 0,
      role: "link",
      "aria-label": label
    });
    svgEl(g, "title").textContent = noteFolder(node.path) ? `${label}
${noteFolder(node.path)}` : label;
    svgEl(g, "circle", { class: "hp-map-hit", r: node.ring === 2 ? 9 : 13 });
    const r = [9, 6.5, 4.5][node.ring];
    if (tag) svgEl(g, "path", { class: "hp-map-dot", d: `M0 ${-r - 1.5}L${r + 1.5} 0L0 ${r + 1.5}L${-r - 1.5} 0Z` });
    else svgEl(g, "circle", { class: "hp-map-dot", r });
    const text = svgEl(g, "text", { class: "hp-map-label" });
    text.textContent = name.length > LABEL_MAX ? name.slice(0, LABEL_MAX - 1) + "…" : name;
    placeLabel(text, node);
    if (node.ring === 0) svgEl(g, "text", { class: "hp-map-here", y: 42, "text-anchor": "middle" }).textContent = t("mapHere");
    const go = (e) => {
      if (node.ring > 0) this.map.open(node.path, e);
    };
    g.addEventListener("click", go);
    g.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      go(e);
    });
    if (!tag && !ghost) g.addEventListener("mouseover", (event) => {
      this.app.workspace.trigger("hover-link", {
        event,
        source: MAP_VIEW,
        hoverParent: this,
        targetEl: g,
        linktext: node.path,
        sourcePath: this.map.here() ?? ""
      });
    });
  }
  renderRoute(here) {
    const { map } = this;
    const { t } = map;
    const box = this.contentEl.createDiv({ cls: "hp-marauders-route" });
    const route = map.route;
    if (!route) {
      box.createEl("button", { cls: "mod-cta hp-map-plan", text: t("mapRouteButton") }).addEventListener("click", () => map.planRoute());
      return;
    }
    box.createDiv({ cls: "hp-marauders-heading", text: t("mapRouteTitle", noteName(route.target)) });
    if (!route.steps) {
      box.createEl("p", { cls: "hp-marauders-note", text: t("mapLost", noteName(route.target)) });
    } else {
      const steps = routeSteps(map.graph, route.steps);
      const note = map.routeStatus === "rerouted" ? t("mapRerouted") : map.routeStatus === "changed" ? t("mapRouteChanged") : "";
      box.createEl("p", { cls: "hp-marauders-note", text: [t("mapRouteSteps", steps.length - 1), note].filter(Boolean).join(" · ") });
      const list = box.createEl("ol", { cls: "hp-marauders-steps" });
      steps.forEach(({ path, passage, tag }, i) => {
        const li = list.createEl("li", { cls: i === 0 ? "is-here" : i === 1 ? "is-next" : "" });
        const btn = li.createEl("button", { cls: "hp-map-step", attr: { type: "button", "data-path": path } });
        btn.createSpan({ cls: "hp-map-step-name", text: noteName(path) });
        const hint = i === 0 ? t("mapHere") : tag ? t("mapStepTag", tag) : t(passage === "backlink" ? "mapStepBacklink" : "mapStepLink");
        btn.createSpan({ cls: "hp-map-step-hint", text: hint });
        if (i > 0) btn.addEventListener("click", (e) => map.open(path, e));
        else btn.disabled = true;
      });
    }
    const actions = box.createDiv({ cls: "hp-marauders-actions" });
    if (route.steps && route.steps[0] === here && nextNote(route.steps)) {
      actions.createEl("button", { cls: "mod-cta hp-map-next", text: t("mapNext") }).addEventListener("click", () => map.goNext());
    }
    actions.createEl("button", { cls: "hp-map-plan", text: t("mapRouteButton") }).addEventListener("click", () => map.planRoute());
    actions.createEl("button", { cls: "hp-map-clear", text: t("mapClear") }).addEventListener("click", () => map.clearRoute());
  }
  renderFootprints(footprints) {
    if (!footprints.length) return;
    const box = this.contentEl.createDiv({ cls: "hp-marauders-footprints" });
    box.createDiv({ cls: "hp-marauders-heading", text: this.map.t("mapFootprints") });
    for (const path of footprints) {
      const btn = box.createEl("button", { cls: "hp-map-footprint", text: noteName(path), attr: { type: "button", "data-path": path } });
      btn.addEventListener("click", (e) => this.map.open(path, e));
    }
  }
};
var RouteModal = class extends import_obsidian.FuzzySuggestModal {
  constructor(app, t, here, onChoose) {
    super(app);
    this.here = here;
    this.onChoose = onChoose;
    this.setPlaceholder(t("mapRoutePlaceholder"));
  }
  getItems() {
    return this.app.vault.getMarkdownFiles().filter((f) => f.path !== this.here);
  }
  getItemText(file) {
    return file.path.replace(/\.md$/, "");
  }
  onChooseItem(file) {
    this.onChoose(file);
  }
};
function passageHint(t, passage) {
  return passage === "backlink" ? ` (${t("mapLegendBacklink")})` : "";
}
function placeLabel(text, node) {
  if (node.ring === 0) {
    text.setAttribute("y", "27");
    text.setAttribute("text-anchor", "middle");
    return;
  }
  const len = Math.hypot(node.x, node.y) || 1;
  const cos = node.x / len;
  const sin = node.y / len;
  if (Math.abs(cos) < 0.3) {
    text.setAttribute("y", String(sin < 0 ? -11 : 20));
    text.setAttribute("text-anchor", "middle");
    return;
  }
  const right = node.ring === 2 ? cos < 0 : cos > 0;
  text.setAttribute("x", String(right ? 10 : -10));
  text.setAttribute("y", "5");
  text.setAttribute("text-anchor", right ? "start" : "end");
}
var round2 = (v) => Math.round(v * 10) / 10;
function svgEl(parent, tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS2, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  parent.appendChild(el);
  return el;
}

// src/work.ts
var TASK_POINTS = 10;
var DAILY_POINTS = 20;
function countDoneTasks(listItems) {
  return listItems?.filter((item) => item.task === "x" || item.task === "X").length ?? 0;
}
function newlyDone(best, done) {
  if (best === void 0) return { award: 0, best: done };
  return { award: Math.max(0, done - best), best: Math.max(best, done) };
}
function isDailyNote(path, todayName) {
  const name = path.replace(/\.md$/, "");
  return !!todayName && (name === todayName || name.endsWith("/" + todayName));
}

// src/memories.ts
var DAY = 24 * 60 * 60 * 1e3;
var PENSIEVE_DAYS = 90;
function daysSince(time, now) {
  return Math.max(0, Math.floor((now - time) / DAY));
}
function pensieveCandidates(notes, now, minDays = PENSIEVE_DAYS) {
  const old = notes.filter((n) => now - n.mtime >= minDays * DAY);
  if (old.length) return old;
  const sorted = [...notes].sort((a, b) => a.mtime - b.mtime);
  return sorted.slice(0, Math.ceil(sorted.length / 4));
}
function pickPensieve(notes, now, random = Math.random) {
  const list = pensieveCandidates(notes, now);
  return list.length ? list[Math.floor(random() * list.length)] : null;
}
function yearAgo(now) {
  const d = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(now.getDate(), last));
  return d;
}
function sameDay(time, day) {
  const t = new Date(time);
  return t.getFullYear() === day.getFullYear() && t.getMonth() === day.getMonth() && t.getDate() === day.getDate();
}
function timeTurner(notes, day, dailyName) {
  const daily = notes.filter((n) => isDailyNote(n.path, dailyName));
  const created = notes.filter((n) => sameDay(n.ctime, day) && !daily.includes(n)).sort((a, b) => a.ctime - b.ctime);
  return [...daily, ...created];
}

// src/cloak.ts
var OPEN = '<span class="hp-cloak">';
var CLOSE = "</span>";
function toggleCloak(text) {
  if (text.startsWith(OPEN) && text.endsWith(CLOSE)) return text.slice(OPEN.length, -CLOSE.length);
  return OPEN + text + CLOSE;
}
function cloakCallout(title) {
  return `> [!cloak] ${title}
> `;
}

// src/modals.ts
var import_obsidian2 = require("obsidian");

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
var FRACTIONS = { "0.25": "¼", "0.5": "½", "0.75": "¾" };
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

// src/sorting.ts
var QUIZ_QUESTIONS = ["noise", "virtue", "book", "subject", "legacy", "team"];
function shuffled(items, random = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function sortByAnswers(answers, random = Math.random) {
  if (!answers.length) return HOUSE_IDS[Math.floor(random() * HOUSE_IDS.length)];
  const score = new Map(HOUSE_IDS.map((h) => [h, 0]));
  for (const a of answers) score.set(a, (score.get(a) ?? 0) + 1);
  const best = Math.max(...score.values());
  const tied = HOUSE_IDS.filter((h) => score.get(h) === best);
  for (let i = answers.length - 1; i >= 0; i--) if (tied.includes(answers[i])) return answers[i];
  return tied[0];
}

// src/modals.ts
var SortingHatModal = class extends import_obsidian2.Modal {
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
    this.progress = this.contentEl.createDiv({ cls: "hp-hat-progress" });
    this.text = this.contentEl.createEl("p", { cls: "hp-hat-text" });
    this.text.setAttribute("aria-live", "assertive");
    this.choices = this.contentEl.createDiv({ cls: "hp-hat-choices" });
    this.intro();
  }
  onClose() {
    this.cancelled = true;
    this.contentEl.empty();
  }
  intro() {
    const { t } = this;
    this.text.setText(t("hatIntro"));
    this.choices.empty();
    const quiz = this.choices.createEl("button", { cls: "mod-cta hp-hat-quiz", text: t("hatQuiz"), attr: { type: "button" } });
    quiz.addEventListener("click", () => this.ask(0, []));
    this.choices.createEl("button", { cls: "hp-hat-trust", text: t("hatTrust"), attr: { type: "button" } }).addEventListener("click", () => void this.verdict(null));
    window.setTimeout(() => quiz.focus(), 0);
  }
  ask(index, answers) {
    const { t } = this;
    if (index === QUIZ_QUESTIONS.length) {
      void this.verdict(sortByAnswers(answers));
      return;
    }
    const question = QUIZ_QUESTIONS[index];
    this.progress.setText(t("hatProgress", index + 1, QUIZ_QUESTIONS.length));
    this.text.setText(t(`quiz_${question}`));
    this.choices.empty();
    this.choices.addClass("is-quiz");
    const buttons = shuffled(HOUSE_IDS).map((house) => {
      const btn = this.choices.createEl("button", {
        cls: "hp-hat-answer",
        text: t(`quiz_${question}_${house}`),
        attr: { type: "button", "data-house": house }
      });
      btn.addEventListener("click", () => this.ask(index + 1, [...answers, house]));
      return btn;
    });
    window.setTimeout(() => buttons[0]?.focus(), 0);
  }
  // При «уменьшении движения» анимации отключает CSS, а паузы остаются: фразы нужно успеть прочитать.
  sleep(ms) {
    return new Promise((r) => window.setTimeout(r, ms));
  }
  /** house — итог испытания; null — шляпа решает сама. */
  async verdict(chosen) {
    const { text } = this;
    this.choices.empty();
    this.choices.removeClass("is-quiz");
    this.progress.setText("");
    const phrases = shuffled(["hat1", "hat2", "hat3", "hat4"]).slice(0, chosen ? 2 : 3);
    for (const key of phrases) {
      text.setText(this.t(key));
      await this.sleep(1100);
      if (this.cancelled) return;
    }
    const house = chosen ?? HOUSE_IDS[Math.floor(Math.random() * HOUSE_IDS.length)];
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
var WandShopModal = class extends import_obsidian2.Modal {
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
    new import_obsidian2.Setting(contentEl).setName(t("settingWandCursor")).setDesc(t("settingWandCursorDesc")).addToggle((tg) => {
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
    const length = new import_obsidian2.Setting(form).setName(t("shopLength"));
    this.lengthLabel = length.nameEl.createSpan({ cls: "hp-shop-length" });
    length.addSlider((s) => {
      this.slider = s;
      s.setLimits(LENGTH_MIN, LENGTH_MAX, LENGTH_STEP).setValue(this.wand.length).onChange((value) => this.update({ length: value }));
    });
    new import_obsidian2.Setting(form).addButton((b) => b.setButtonText(t("shopRandom")).onClick(() => this.set(randomWand())));
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
    new import_obsidian2.Setting(container).setName(name).addDropdown((d) => {
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
    this.lengthLabel?.setText(` · ${formatLength(wand.length)}″`);
  }
};
var WandModal = class extends import_obsidian2.Modal {
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
var HouseSuggestModal = class extends import_obsidian2.FuzzySuggestModal {
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
var NoteSuggestModal = class extends import_obsidian2.FuzzySuggestModal {
  constructor(app, placeholder, paths, onChoose) {
    super(app);
    this.paths = paths;
    this.onChoose = onChoose;
    this.setPlaceholder(placeholder);
  }
  getItems() {
    return this.paths;
  }
  getItemText(path) {
    return path.replace(/\.md$/, "");
  }
  onChooseItem(path) {
    this.onChoose(path);
  }
};
var ConfirmModal = class extends import_obsidian2.Modal {
  constructor(app, options) {
    super(app);
    this.options = options;
  }
  onOpen() {
    const { title, text, confirm, cancel, onConfirm } = this.options;
    this.titleEl.setText(title);
    this.contentEl.createEl("p", { text });
    new import_obsidian2.Setting(this.contentEl).addButton((b) => b.setButtonText(cancel).onClick(() => this.close())).addButton((b) => b.setButtonText(confirm).setWarning().onClick(() => {
      this.close();
      onConfirm();
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/settings.ts
var import_obsidian3 = require("obsidian");

// src/settings-data.ts
var MODE_SETTINGS = ["auto", "parchment", "common"];
var DEFAULT_SETTINGS = {
  house: "gryffindor",
  mode: "auto",
  readableFont: true,
  headingFont: true,
  ornaments: true,
  wandCursor: true,
  wand: { ...DEFAULT_WAND },
  gestures: true,
  mapTags: true,
  mapUnresolved: true,
  mapDepth: 2,
  mapExclude: [],
  restrictedFolders: [],
  statusBar: true,
  easterEggs: true,
  workPoints: true,
  points: { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 },
  snitches: 0,
  birthdayShown: "",
  dailyAwarded: "",
  footprints: [],
  route: null
};
var isStringList = (v) => Array.isArray(v) && v.every((x) => typeof x === "string");
var count = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
function sanitizeRoute(v) {
  if (!v || typeof v !== "object") return null;
  const { target, steps } = v;
  if (typeof target !== "string") return null;
  return { target, steps: isStringList(steps) ? [...steps] : null };
}
function migrateSettings(data) {
  const raw = data && typeof data === "object" ? data : {};
  const settings = { ...DEFAULT_SETTINGS };
  for (const [key, fallback] of Object.entries(DEFAULT_SETTINGS)) {
    const value = raw[key];
    if (typeof fallback === "boolean" || typeof fallback === "string") {
      if (typeof value === typeof fallback) settings[key] = value;
    }
  }
  const s = settings;
  if (!HOUSE_IDS.includes(s.house)) s.house = DEFAULT_SETTINGS.house;
  if (!MODE_SETTINGS.includes(s.mode)) s.mode = DEFAULT_SETTINGS.mode;
  s.mapDepth = raw.mapDepth === 1 ? 1 : 2;
  const points = raw.points && typeof raw.points === "object" ? raw.points : {};
  s.points = Object.fromEntries(HOUSE_IDS.map((id) => [id, count(points[id])]));
  s.snitches = count(raw.snitches);
  s.mapExclude = isStringList(raw.mapExclude) ? [...raw.mapExclude] : [];
  s.restrictedFolders = isStringList(raw.restrictedFolders) ? [...raw.restrictedFolders] : [];
  s.footprints = isStringList(raw.footprints) ? [...raw.footprints] : [];
  s.route = sanitizeRoute(raw.route);
  s.wand = sanitizeWand(raw.wand);
  return s;
}
function parseFolderList(text) {
  const out = [];
  for (const part of text.split(/[\n,]/)) {
    const folder = part.trim().replace(/^\/+|\/+$/g, "");
    if (folder && !out.includes(folder)) out.push(folder);
  }
  return out;
}

// src/settings.ts
var HpSettingTab = class extends import_obsidian3.PluginSettingTab {
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
    this.heading(t("sectionAppearance"));
    new import_obsidian3.Setting(containerEl).setName(t("settingMode")).setDesc(t("settingModeDesc")).addDropdown((d) => {
      for (const mode of MODE_SETTINGS) d.addOption(mode, t(`mode_${mode}`));
      d.setValue(settings.mode).onChange((value) => void this.plugin.setMode(value));
    }).settingEl.addClass("hp-mode-setting");
    this.toggle("readableFont", t("settingReadableFont"), t("settingReadableFontDesc"));
    this.toggle("headingFont", t("settingHeadingFont"), t("settingHeadingFontDesc"));
    this.toggle("ornaments", t("settingOrnaments"), t("settingOrnamentsDesc"));
    this.toggle("statusBar", t("settingStatusBar"));
    this.heading(t("sectionWand"));
    const wand = new import_obsidian3.Setting(containerEl).setName(t("settingWand")).setDesc(`${wandName(t, settings.wand)}: ${describeWand(t, settings.wand).toLowerCase()}`).addButton((b) => b.setButtonText(t("buttonWandShop")).onClick(() => this.plugin.openWandShop(() => this.display())));
    wand.settingEl.addClass("hp-wand-setting");
    wand.infoEl.createDiv({ cls: "hp-wand-current" }).appendChild(svgElement(wandSideSvg(settings.wand, 260, "hp-settings-wand")));
    this.toggle("wandCursor", t("settingWandCursor"), t("settingWandCursorDesc"));
    this.heading(t("sectionMap"));
    this.toggle("mapTags", t("settingMapTags"), t("settingMapTagsDesc"));
    this.toggle("mapUnresolved", t("settingMapUnresolved"), t("settingMapUnresolvedDesc"));
    new import_obsidian3.Setting(containerEl).setName(t("settingMapDepth")).setDesc(t("settingMapDepthDesc")).addDropdown((d) => d.addOption("2", t("mapDepth_2")).addOption("1", t("mapDepth_1")).setValue(String(settings.mapDepth)).onChange(async (value) => {
      settings.mapDepth = value === "1" ? 1 : 2;
      await this.plugin.saveSettings();
    })).settingEl.addClass("hp-map-depth-setting");
    this.folders("mapExclude", t("settingMapExclude"), t("settingMapExcludeDesc"), "Templates\nArchive", true);
    this.folders("restrictedFolders", t("settingRestricted"), t("settingRestrictedDesc"), "Secrets", false);
    this.heading(t("sectionMagic"));
    this.toggle("easterEggs", t("settingEasterEggs"), t("settingEasterEggsDesc"), () => this.display());
    const gestures = this.toggle(
      "gestures",
      t("settingGestures"),
      `${t("settingGesturesDesc")} ${settings.easterEggs ? t("settingGesturesAlt") : t("settingGesturesDisabled")}`
    );
    gestures.setDisabled(!settings.easterEggs);
    gestures.settingEl.toggleClass("is-disabled", !settings.easterEggs);
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
    this.heading(t("sectionCup"));
    this.toggle("workPoints", t("settingWorkPoints"), t("settingWorkPointsDesc", TASK_POINTS, DAILY_POINTS));
    this.cup();
    new import_obsidian3.Setting(containerEl).setName(t("settingSortingHat")).addButton((b) => b.setButtonText(t("buttonSortingHat")).setCta().onClick(() => this.plugin.openSortingHat(() => this.display()))).addButton((b) => b.setButtonText(t("buttonResetPoints")).setWarning().onClick(() => new ConfirmModal(this.app, {
      title: t("resetTitle"),
      text: t("resetText"),
      confirm: t("resetConfirm"),
      cancel: t("cancel"),
      onConfirm: () => void this.plugin.resetPoints().then(() => this.display())
    }).open())).settingEl.addClass("hp-cup-actions");
  }
  heading(name) {
    new import_obsidian3.Setting(this.containerEl).setName(name).setHeading();
  }
  /** Кубок школы: очки всех факультетов, полоски — относительно лидера. */
  cup() {
    const { t, settings } = this.plugin;
    const cup = this.containerEl.createDiv({ cls: "hp-cup" });
    const max = Math.max(1, ...HOUSE_IDS.map((id) => settings.points[id] ?? 0));
    for (const id of HOUSE_IDS) {
      const points = settings.points[id] ?? 0;
      const row = cup.createDiv({ cls: "hp-cup-row" + (id === settings.house ? " is-current" : ""), attr: { "data-house": id } });
      row.appendChild(svgElement(crestSvg(id, 20)));
      row.createSpan({ cls: "hp-cup-name", text: t(`house_${id}`) });
      const bar = row.createDiv({ cls: "hp-cup-bar" }).createDiv({ cls: "hp-cup-fill" });
      bar.style.width = `${Math.round(points / max * 100)}%`;
      bar.style.background = HOUSES[id].crest.field;
      row.createSpan({ cls: "hp-cup-points", text: t("cupPoints", points) });
    }
    cup.createDiv({ cls: "setting-item-description", text: t("cupSnitches", settings.snitches) });
  }
  toggle(key, name, desc, after) {
    const setting = new import_obsidian3.Setting(this.containerEl).setName(name);
    if (desc) setting.setDesc(desc);
    setting.addToggle((tg) => tg.setValue(this.plugin.settings[key]).onChange(async (value) => {
      this.plugin.settings[key] = value;
      await this.plugin.saveSettings();
      after?.();
    }));
    return setting;
  }
  /** Список папок: сохраняется, когда поле отпустили, а не на каждую букву — карта перестраивается целиком. */
  folders(key, name, desc, placeholder, multiline) {
    const setting = new import_obsidian3.Setting(this.containerEl).setName(name).setDesc(desc);
    setting.settingEl.addClass(`hp-folders-${key}`);
    const save = async (text) => {
      const folders = parseFolderList(text);
      if (folders.join("\n") === this.plugin.settings[key].join("\n")) return;
      this.plugin.settings[key] = folders;
      await this.plugin.saveSettings();
    };
    const value = this.plugin.settings[key].join(multiline ? "\n" : ", ");
    if (multiline) {
      setting.addTextArea((ta) => {
        ta.setPlaceholder(placeholder).setValue(value);
        ta.inputEl.rows = 3;
        ta.inputEl.addEventListener("change", () => void save(ta.getValue()));
      });
    } else {
      setting.addText((tx) => {
        tx.setPlaceholder(placeholder).setValue(value);
        tx.inputEl.addEventListener("change", () => void save(tx.getValue()));
      });
    }
  }
};

// src/main.ts
var SNITCH_POINTS = 150;
var SAVE_DELAY = 400;
var NEW_NOTE_MS = 60 * 1e3;
var RESTRICTED_STYLE_ID = "hp-restricted-css";
function detectLanguage() {
  const getLanguage2 = obsidian.getLanguage;
  if (typeof getLanguage2 === "function") return getLanguage2();
  return window.localStorage.getItem("language") || "en";
}
var HpThemePlugin = class extends import_obsidian4.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
    this.t = createTranslator("en");
    /** «Шалость удалась»: тема выключена до клятвы или перезапуска. */
    this.paused = false;
    this.saveTimer = 0;
    this.saveDue = 0;
    this.statusEl = null;
    this.bodies = /* @__PURE__ */ new Set();
    this.spellbook = createSpellbook();
    this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    /**
     * Светлая или тёмная тема — как выбрано в Obsidian. Плагин может временно её подменить
     * («Люмос», «Нокс») или держать пергамент / гостиную всегда (настройка), но настройку Obsidian не трогает.
     */
    this.nativeDark = document.body.classList.contains("theme-dark");
    /** Что плагин поставил на <body> сам: чужие изменения классов темы — это Obsidian. */
    this.appliedDark = null;
    /** «Люмос» и «Нокс» до перезапуска, смены темы в Obsidian или настройки режима. */
    this.spellMode = null;
    /** Рекорд закрытых задач по заметкам: очки только за новые. */
    this.taskBest = /* @__PURE__ */ new Map();
  }
  async onload() {
    this.t = createTranslator(detectLanguage());
    await this.loadSettings();
    this.effects = new Effects(() => this.reducedMotionQuery.matches);
    this.gestures = new GestureInput({
      enabled: () => this.settings.easterEggs && this.settings.gestures,
      colors: () => CORES[this.settings.wand.core],
      cast: (spell, at, doc) => this.cast(spell, at, doc)
    }, this.effects);
    this.bodies.add(document.body);
    this.watchWindow(window);
    this.watchNativeTheme();
    this.registerEvent(this.app.workspace.on("window-open", (win, view) => {
      this.bodies.add(win.doc.body);
      this.watchWindow(view ?? win.win);
      this.applyTheme();
    }));
    this.registerEvent(this.app.workspace.on("window-close", (win) => {
      this.bodies.delete(win.doc.body);
      this.effects.forget(win.doc);
    }));
    this.addSettingTab(new HpSettingTab(this.app, this));
    this.addRibbonIcon("wand", this.t("ribbonTitle"), (evt) => this.openHouseMenu(evt));
    this.map = new MaraudersMap(this);
    this.map.load();
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
    this.addCommand({ id: "pensieve", name: this.t("commandPensieve"), callback: () => this.openPensieve() });
    this.addCommand({ id: "time-turner", name: this.t("commandTimeTurner"), callback: () => this.openTimeTurner() });
    this.addCommand({ id: "cloak", name: this.t("commandCloak"), editorCallback: (editor) => this.cloak(editor) });
    this.addCommand({
      id: "toggle-theme",
      name: this.t("commandToggle"),
      callback: () => {
        this.paused = !this.paused;
        this.applyTheme();
      }
    });
    this.registerEvent(this.app.metadataCache.on("changed", (file, _data, cache) => this.onNoteChanged(file, cache)));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      const best = this.taskBest.get(oldPath);
      this.taskBest.delete(oldPath);
      if (best !== void 0) this.taskBest.set(file.path, best);
    }));
    this.registerEvent(this.app.vault.on("delete", (file) => this.taskBest.delete(file.path)));
    this.applyTheme();
    this.app.workspace.onLayoutReady(() => {
      this.rememberTasks();
      void this.birthday();
    });
  }
  onunload() {
    if (this.saveTimer) {
      window.clearTimeout(this.saveTimer);
      void this.saveData(this.settings);
    }
    this.gestures?.cancel();
    this.effects?.destroy();
    let changed = false;
    for (const body of this.bodies) {
      this.setBodyClasses(body, false);
      body.style.removeProperty("--hp-wand-cursor");
      body.ownerDocument.getElementById(RESTRICTED_STYLE_ID)?.remove();
      if (body.classList.contains("theme-dark") !== this.nativeDark) {
        body.classList.toggle("theme-dark", this.nativeDark);
        body.classList.toggle("theme-light", !this.nativeDark);
        changed = true;
      }
    }
    if (changed) this.app.workspace.trigger("css-change");
  }
  /** Заклинания с клавиатуры и жесты — в каждом окне Obsidian, а не только в главном. */
  watchWindow(view) {
    this.registerDomEvent(view, "keydown", (e) => this.onKeydown(e), true);
    this.registerDomEvent(view, "pointermove", (e) => {
      this.effects.trackPointer(e);
      this.gestures.pointerMove(e);
    }, { passive: true });
    this.registerDomEvent(view, "pointerdown", (e) => this.gestures.pointerDown(e), true);
    this.registerDomEvent(view, "pointerup", (e) => this.gestures.pointerUp(e), true);
    this.registerDomEvent(view, "pointercancel", () => this.gestures.cancel(), true);
    this.registerDomEvent(view, "contextmenu", (e) => this.gestures.contextMenu(e), true);
  }
  // ---------- Настройки ----------
  async loadSettings() {
    this.settings = migrateSettings(await this.loadData());
  }
  async saveSettings() {
    window.clearTimeout(this.saveTimer);
    this.saveTimer = 0;
    await this.saveData(this.settings);
    this.applyTheme();
    this.map?.settingsChanged();
  }
  /** Сохранить чуть позже: палочку крутят ползунком, следы на карте меняются на каждом шаге. */
  saveSoon(delay = SAVE_DELAY) {
    const due = Date.now() + delay;
    if (this.saveTimer && this.saveDue <= due) return;
    window.clearTimeout(this.saveTimer);
    this.saveDue = due;
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = 0;
      void this.saveData(this.settings);
    }, delay);
  }
  /** Палочка меняется сразу, а сохраняется с задержкой. */
  setWand(wand) {
    this.settings.wand = wand;
    this.applyTheme();
    this.saveSoon();
  }
  async setHouse(house) {
    this.settings.house = house;
    await this.saveSettings();
  }
  /** Пергамент, гостиная или по теме Obsidian. Временный «Люмос» или «Нокс» при этом забывается. */
  async setMode(mode) {
    this.settings.mode = mode;
    this.spellMode = null;
    await this.saveSettings();
  }
  async resetPoints() {
    this.settings.points = { ...DEFAULT_SETTINGS.points };
    this.settings.snitches = 0;
    await this.saveSettings();
  }
  // ---------- Тема ----------
  applyTheme() {
    const cursor = wandCursorCss(this.settings.wand);
    const css = restrictedCss(this.settings.restrictedFolders);
    for (const body of this.bodies) {
      this.setBodyClasses(body, !this.paused);
      if (this.settings.wandCursor && !this.paused) body.style.setProperty("--hp-wand-cursor", cursor);
      else body.style.removeProperty("--hp-wand-cursor");
      this.setRestrictedCss(body.ownerDocument, css);
    }
    this.applyBaseMode();
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
  /** Свои «Запретные секции» в проводнике: селекторы зависят от настроек. */
  setRestrictedCss(doc, css) {
    let style = doc.getElementById(RESTRICTED_STYLE_ID);
    if (!css) {
      style?.remove();
      return;
    }
    if (!style) {
      style = doc.createElement("style");
      style.id = RESTRICTED_STYLE_ID;
      doc.head.appendChild(style);
    }
    if (style.textContent !== css) style.textContent = css;
  }
  wantDark() {
    if (this.paused) return this.nativeDark;
    const mode = this.spellMode ?? (this.settings.mode === "auto" ? null : this.settings.mode);
    return mode ? mode === "common" : this.nativeDark;
  }
  /** Классы светлой и тёмной темы на <body> всех окон — как нужно сейчас (без записи в настройки Obsidian). */
  applyBaseMode() {
    const dark = this.wantDark();
    this.appliedDark = dark;
    let changed = false;
    for (const body of this.bodies) {
      if (body.classList.contains("theme-dark") === dark && body.classList.contains("theme-light") !== dark) continue;
      body.classList.toggle("theme-dark", dark);
      body.classList.toggle("theme-light", !dark);
      changed = true;
    }
    if (changed) this.app.workspace.trigger("css-change");
  }
  /** Тему поменяли в Obsidian (настройки, «как в системе»): запомнить выбор и снова применить свой режим. */
  watchNativeTheme() {
    const body = document.body;
    const observer = new MutationObserver(() => {
      const dark = body.classList.contains("theme-dark");
      if (dark === this.appliedDark || !dark && !body.classList.contains("theme-light")) return;
      this.nativeDark = dark;
      this.spellMode = null;
      this.applyBaseMode();
    });
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    this.register(() => observer.disconnect());
  }
  updateStatus() {
    const el = this.statusEl;
    if (!el) return;
    const s = this.settings;
    el.toggle(s.statusBar && !this.paused);
    el.setText(`⚡ ${this.t(`house_${s.house}`)} · ${s.points[s.house] ?? 0}`);
    el.setAttribute("aria-label", this.t("statusTitle", s.snitches));
  }
  isDark() {
    return document.body.classList.contains("theme-dark");
  }
  // ---------- Меню, Шляпа, палочка ----------
  openHouseMenu(evt) {
    const menu = new import_obsidian4.Menu();
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
    menu.addItem((item) => item.setTitle(this.t("mapTitle")).setIcon("footprints").onClick(() => void this.map.reveal()));
    menu.addItem((item) => item.setTitle(this.t("pensieveTitle")).setIcon("droplets").onClick(() => this.openPensieve()));
    menu.addItem((item) => item.setTitle(this.t("timeTurnerTitle")).setIcon("hourglass").onClick(() => this.openTimeTurner()));
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
        new import_obsidian4.Notice(this.t("wandOff"));
        return;
      }
      const spell = parseIncantation(phrase);
      if (spell) this.cast(spell);
      else new import_obsidian4.Notice(this.t("wandFail"));
    }).open();
  }
  openSettings() {
    const setting = this.app.setting;
    setting?.open();
    setting?.openTabById(this.manifest.id);
  }
  // ---------- Омут памяти, Маховик времени, Мантия-невидимка ----------
  /** Заметки хранилища без исключённых с карты папок (шаблоны, архив). */
  noteStats() {
    return this.app.vault.getMarkdownFiles().filter((f) => !inFolder(f.path, this.settings.mapExclude)).map((f) => ({ path: f.path, ctime: f.stat.ctime, mtime: f.stat.mtime }));
  }
  openNote(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian4.TFile) void this.app.workspace.getLeaf(false).openFile(file);
  }
  /** «Омут памяти»: случайная заметка, которую давно не открывали для правки. */
  openPensieve() {
    const here = this.app.workspace.getActiveFile()?.path;
    const now = Date.now();
    const note = pickPensieve(this.noteStats().filter((n) => n.path !== here), now);
    if (!note) {
      new import_obsidian4.Notice(this.t("pensieveEmpty"));
      return;
    }
    this.openNote(note.path);
    new import_obsidian4.Notice(this.t("pensieveNotice", noteName(note.path), daysSince(note.mtime, now)));
  }
  /** «Маховик времени»: что было записано ровно год назад. */
  openTimeTurner() {
    const day = yearAgo(/* @__PURE__ */ new Date());
    const notes = timeTurner(this.noteStats(), day, (0, import_obsidian4.moment)(day).format(this.dailyFormat()));
    const date = day.toLocaleDateString(this.t("locale"), { day: "numeric", month: "long", year: "numeric" });
    if (!notes.length) {
      new import_obsidian4.Notice(this.t("timeTurnerEmpty", date));
      return;
    }
    if (notes.length === 1) {
      this.openNote(notes[0].path);
      new import_obsidian4.Notice(this.t("timeTurnerNotice", date));
      return;
    }
    new NoteSuggestModal(this.app, this.t("timeTurnerPlaceholder", date), notes.map((n) => n.path), (path) => this.openNote(path)).open();
  }
  /** «Мантия-невидимка»: выделенное — под мантию (или из-под неё), без выделения — коллаут-мантия. */
  cloak(editor) {
    const selection = editor.getSelection();
    if (selection) editor.replaceSelection(toggleCloak(selection));
    else editor.replaceSelection(cloakCallout(this.t("cloakTitle")));
  }
  // ---------- Очки за работу ----------
  /** Формат имени ежедневной заметки из настроек дневника Obsidian (API не публичное). */
  dailyFormat() {
    const app = this.app;
    return app.internalPlugins?.getPluginById?.("daily-notes")?.instance?.options?.format || "YYYY-MM-DD";
  }
  /** Сколько задач уже закрыто в каждой заметке: за них очков не дают. */
  rememberTasks() {
    for (const file of this.app.vault.getMarkdownFiles()) {
      const cache = this.app.metadataCache.getFileCache(file);
      if (cache) this.taskBest.set(file.path, countDoneTasks(cache.listItems));
    }
  }
  onNoteChanged(file, cache) {
    let best = this.taskBest.get(file.path);
    if (best === void 0 && Date.now() - file.stat.ctime < NEW_NOTE_MS) best = 0;
    const { award, best: record } = newlyDone(best, countDoneTasks(cache.listItems));
    this.taskBest.set(file.path, record);
    if (!this.settings.workPoints || this.paused) return;
    if (this.app.workspace.getActiveFile()?.path !== file.path) return;
    if (award > 0) this.addPoints(award * TASK_POINTS);
    const today = (0, import_obsidian4.moment)().format("YYYY-MM-DD");
    if (this.settings.dailyAwarded !== today && isDailyNote(file.path, (0, import_obsidian4.moment)().format(this.dailyFormat()))) {
      this.settings.dailyAwarded = today;
      this.addPoints(DAILY_POINTS, this.t("pointsDaily", DAILY_POINTS, this.t(`house_${this.settings.house}`)));
    }
  }
  addPoints(points, message) {
    const house = this.settings.house;
    this.settings.points[house] = (this.settings.points[house] ?? 0) + points;
    this.saveSoon();
    this.updateStatus();
    if (this.statusEl?.isShown()) this.effects.floatText(this.statusEl, `+${points}`);
    if (message) new import_obsidian4.Notice(message);
  }
  // ---------- Пасхалки ----------
  onKeydown(e) {
    if (!this.settings.easterEggs || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const target = e.composedPath()[0] ?? e.target;
    if (isEditable(target)) return;
    const spell = this.spellbook.push(e.key);
    if (spell) this.cast(spell, void 0, eventDocument(e));
  }
  /** at — где начат жест палочкой (для «Вингардиум Левиосы»), иначе — где курсор. doc — окно, где колдуют. */
  cast(spell, at, doc = activeDocument) {
    if (this.paused && spell !== "solemnlySwear") return;
    switch (spell) {
      case "wingardiumLeviosa": {
        const p = at ?? this.effects.pointerIn(doc);
        this.effects.levitate(doc, p.x, p.y);
        new import_obsidian4.Notice(this.t("eggLeviosa"));
        break;
      }
      case "lumos":
        this.effects.lumos(doc);
        this.spellMode = "parchment";
        this.applyBaseMode();
        new import_obsidian4.Notice(this.t("eggLumos"));
        break;
      case "nox":
        this.effects.nox(doc);
        this.effects.later(() => {
          this.spellMode = "common";
          this.applyBaseMode();
        }, this.effects.noxSwitchDelay);
        new import_obsidian4.Notice(this.t("eggNox"));
        break;
      case "solemnlySwear":
        if (this.paused) {
          this.paused = false;
          this.applyTheme();
        }
        this.effects.marauders(doc, [this.t("eggMap1"), this.t("eggMap2"), this.t("eggMapTitle")]);
        this.effects.later(() => void this.map.reveal(), 1200);
        break;
      case "mischiefManaged":
        this.effects.inkFade(doc);
        this.map.close();
        new import_obsidian4.Notice(this.t("eggMischief"));
        this.effects.later(() => {
          this.paused = true;
          this.applyTheme();
        }, 500);
        break;
      case "accioSnitch":
        this.effects.releaseSnitch(doc, { label: this.t("eggSnitchLabel"), onCatch: () => void this.awardSnitch() });
        break;
    }
  }
  async awardSnitch() {
    const house = this.settings.house;
    this.settings.points[house] = (this.settings.points[house] ?? 0) + SNITCH_POINTS;
    this.settings.snitches += 1;
    await this.saveSettings();
    new import_obsidian4.Notice(this.t("eggSnitch", SNITCH_POINTS, this.t(`house_${house}`)));
  }
  async birthday() {
    const now = /* @__PURE__ */ new Date();
    if (!this.settings.easterEggs || now.getMonth() !== 6 || now.getDate() !== 31) return;
    const year = String(now.getFullYear());
    if (this.settings.birthdayShown === year) return;
    this.settings.birthdayShown = year;
    await this.saveData(this.settings);
    new import_obsidian4.Notice(this.t("eggBirthday"), 1e4);
  }
};
