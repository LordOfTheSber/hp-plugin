/* Строки интерфейса. Язык выбирается по языку Obsidian: русский или английский. */

const en = {
  pluginName: 'HP Theme',
  house_gryffindor: 'Gryffindor',
  house_slytherin: 'Slytherin',
  house_ravenclaw: 'Ravenclaw',
  house_hufflepuff: 'Hufflepuff',
  houseShout_gryffindor: 'GRYFFINDOR!',
  houseShout_slytherin: 'SLYTHERIN!',
  houseShout_ravenclaw: 'RAVENCLAW!',
  houseShout_hufflepuff: 'HUFFLEPUFF!',

  settingsIntro: 'Parchment is used with the light base theme, the common room with the dark one (Settings → Appearance).',
  settingReadableFont: 'Literata for notes',
  settingReadableFontDesc: 'A typeface designed for reading on screens, with Cyrillic. Your own font from Appearance settings still wins.',
  settingHeadingFont: 'Forum for headings',
  settingHeadingFontDesc: 'A classical roman for headings and the note title.',
  settingOrnaments: 'Ornaments',
  settingOrnamentsDesc: 'Golden thread under the note title, ✦ dividers, accents on the active tab and file.',
  settingWandCursor: 'Magic wand cursor',
  settingWandCursorDesc: 'Outside the note text, which keeps the usual text cursor.',
  settingStatusBar: 'House and points in the status bar',
  settingEasterEggs: 'Magic',
  settingEasterEggsDesc: 'Words have power…',
  settingSortingHat: 'Sorting Hat',
  settingPoints: '{0} points: {1}',
  buttonSortingHat: 'Put on the Hat',
  motto: 'Draco dormiens nunquam titillandus',
  mottoTranslation: 'Never tickle a sleeping dragon',

  commandChooseHouse: 'Choose house',
  commandSortingHat: 'Sorting Hat',
  commandWand: 'Wave your wand…',
  commandToggle: 'Toggle Hogwarts theme',
  ribbonTitle: 'Hogwarts houses',
  menuSettings: 'Theme settings',
  statusTitle: 'Snitches caught: {0}',

  hat1: 'Hmm. Difficult. Very difficult…',
  hat2: "Plenty of courage, I see. Not a bad mind either…",
  hat3: "There's talent, oh yes, and a thirst to prove yourself…",
  hat4: 'So where shall I put you?..',

  wandTitle: 'Wave your wand',
  wandPlaceholder: 'Say the incantation',
  wandHint: 'Say the incantation and press Enter',
  wandFail: 'Nothing happens. Perhaps it was the wrong wand movement?',
  wandOff: 'Magic is switched off in the plugin settings.',

  eggLumos: 'Lumos! Let there be light.',
  eggNox: 'Nox. Welcome to the common room.',
  eggMap1: 'Messrs Moony, Wormtail, Padfoot and Prongs',
  eggMap2: 'are proud to present',
  eggMapTitle: "The Marauder's Map",
  eggMischief: 'Mischief managed. The theme returns after a solemn oath — or a restart.',
  eggSnitch: '+{0} points to {1}! The Snitch is caught.',
  eggSnitchLabel: 'The Golden Snitch — catch it!',
  eggBirthday: 'July 31st — happy birthday, Harry! Hagrid is bringing a (slightly squashed) cake.'
};

type Strings = typeof en;
export type StringKey = keyof Strings;

const ru: Strings = {
  pluginName: 'HP Theme',
  house_gryffindor: 'Гриффиндор',
  house_slytherin: 'Слизерин',
  house_ravenclaw: 'Когтевран',
  house_hufflepuff: 'Пуффендуй',
  houseShout_gryffindor: 'ГРИФФИНДОР!',
  houseShout_slytherin: 'СЛИЗЕРИН!',
  houseShout_ravenclaw: 'КОГТЕВРАН!',
  houseShout_hufflepuff: 'ПУФФЕНДУЙ!',

  settingsIntro: 'Пергамент — со светлой базовой темой, гостиная — с тёмной (Настройки → Оформление).',
  settingReadableFont: 'Шрифт заметок Literata',
  settingReadableFontDesc: 'Шрифт для чтения с экрана, с кириллицей. Свой шрифт из настроек оформления по-прежнему важнее.',
  settingHeadingFont: 'Заголовки Forum',
  settingHeadingFontDesc: 'Классическая антиква для заголовков и названия заметки.',
  settingOrnaments: 'Орнаменты',
  settingOrnamentsDesc: 'Золотая нить под названием заметки, разделители ✦, акценты активной вкладки и файла.',
  settingWandCursor: 'Курсор — волшебная палочка',
  settingWandCursorDesc: 'Вне текста заметки: там остаётся обычный текстовый курсор.',
  settingStatusBar: 'Факультет и очки в статус-баре',
  settingEasterEggs: 'Магия',
  settingEasterEggsDesc: 'Слова имеют силу…',
  settingSortingHat: 'Распределяющая шляпа',
  settingPoints: 'Очки факультета {0}: {1}',
  buttonSortingHat: 'Надеть шляпу',
  motto: 'Draco dormiens nunquam titillandus',
  mottoTranslation: 'Никогда не щекочи спящего дракона',

  commandChooseHouse: 'Выбрать факультет',
  commandSortingHat: 'Распределяющая шляпа',
  commandWand: 'Взмахнуть палочкой…',
  commandToggle: 'Включить/выключить тему Хогвартса',
  ribbonTitle: 'Факультеты Хогвартса',
  menuSettings: 'Настройки темы',
  statusTitle: 'Поймано снитчей: {0}',

  hat1: 'Хм… непросто. Очень непросто…',
  hat2: 'Вижу немало смелости. И ум неплох…',
  hat3: 'Есть талант, о да, и жажда проявить себя…',
  hat4: 'Так куда же мне тебя определить?..',

  wandTitle: 'Взмахнуть палочкой',
  wandPlaceholder: 'Произнесите заклинание',
  wandHint: 'Произнесите заклинание и нажмите Enter',
  wandFail: 'Ничего не произошло. Может, палочкой взмахнули не так?',
  wandOff: 'Магия выключена в настройках плагина.',

  eggLumos: 'Lumos! Да будет свет.',
  eggNox: 'Nox. Добро пожаловать в гостиную.',
  eggMap1: 'Господа Лунатик, Хвост, Бродяга и Сохатый',
  eggMap2: 'с гордостью представляют',
  eggMapTitle: 'Карту Мародёров',
  eggMischief: 'Шалость удалась. Тема вернётся после клятвы — или перезапуска.',
  eggSnitch: '+{0} очков факультету {1}! Снитч пойман.',
  eggSnitchLabel: 'Золотой снитч — поймай его!',
  eggBirthday: '31 июля — с днём рождения, Гарри! Хагрид уже несёт торт (слегка помятый).'
};

export const STRINGS = { en, ru };
export type Translate = (key: StringKey, ...args: (string | number)[]) => string;

export function createTranslator(language: string): Translate {
  const dict = language.toLowerCase().startsWith('ru') ? ru : en;
  return (key, ...args) => dict[key].replace(/\{(\d+)\}/g, (m, i) => String(args[Number(i)] ?? m));
}
