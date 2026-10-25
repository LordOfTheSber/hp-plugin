// Настройки плагина: значения по умолчанию и чтение сохранённых данных (без зависимости от obsidian).
import { HOUSE_IDS } from './houses.ts';
import type { HouseId, Mode } from './houses.ts';
import { DEFAULT_WAND, sanitizeWand } from './wands.ts';
import type { WandSpec } from './wands.ts';

/** Пергамент или гостиная: по теме Obsidian или всегда одно. */
export type ModeSetting = 'auto' | Mode;
export const MODE_SETTINGS: ModeSetting[] = ['auto', 'parchment', 'common'];

export interface SavedRoute {
  target: string;
  steps: string[] | null;
}

export interface HpSettings {
  house: HouseId;
  mode: ModeSetting;
  readableFont: boolean;
  headingFont: boolean;
  ornaments: boolean;
  wandCursor: boolean;
  wand: WandSpec;
  gestures: boolean;
  /** Карта Мародёров связывает заметки и через общие теги. */
  mapTags: boolean;
  /** Неразрешённые ссылки — «неизведанные комнаты» на карте. */
  mapUnresolved: boolean;
  /** Сколько кругов у карты: только соседи (1) или и соседи соседей (2). */
  mapDepth: 1 | 2;
  /** Папки, которых нет на карте (шаблоны, архив…). */
  mapExclude: string[];
  /** Свои названия «Запретной секции» в дополнение к встроенным. */
  restrictedFolders: string[];
  statusBar: boolean;
  easterEggs: boolean;
  /** Очки факультету за закрытые задачи и запись в ежедневной заметке. */
  workPoints: boolean;
  points: Record<HouseId, number>;
  snitches: number;
  birthdayShown: string;
  /** День (ГГГГ-ММ-ДД), за который уже начислены очки за ежедневную заметку. */
  dailyAwarded: string;
  /** Следы и маршрут Карты Мародёров — переживают перезапуск. */
  footprints: string[];
  route: SavedRoute | null;
}

export const DEFAULT_SETTINGS: HpSettings = {
  house: 'gryffindor',
  mode: 'auto',
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
  birthdayShown: '',
  dailyAwarded: '',
  footprints: [],
  route: null
};

const isStringList = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');
const count = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);

function sanitizeRoute(v: unknown): SavedRoute | null {
  if (!v || typeof v !== 'object') return null;
  const { target, steps } = v as Partial<SavedRoute>;
  if (typeof target !== 'string') return null;
  return { target, steps: isStringList(steps) ? [...steps] : null };
}

/**
 * Сохранённые данные → полные настройки. Значения не того типа (строка вместо флага,
 * неизвестный факультет) заменяются значениями по умолчанию.
 */
export function migrateSettings(data: unknown): HpSettings {
  const raw = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  const settings = { ...DEFAULT_SETTINGS } as Record<string, unknown>;
  for (const [key, fallback] of Object.entries(DEFAULT_SETTINGS)) {
    const value = raw[key];
    if (typeof fallback === 'boolean' || typeof fallback === 'string') {
      if (typeof value === typeof fallback) settings[key] = value;
    }
  }
  const s = settings as unknown as HpSettings;
  if (!HOUSE_IDS.includes(s.house)) s.house = DEFAULT_SETTINGS.house;
  if (!MODE_SETTINGS.includes(s.mode)) s.mode = DEFAULT_SETTINGS.mode;
  s.mapDepth = raw.mapDepth === 1 ? 1 : 2;
  const points = (raw.points && typeof raw.points === 'object' ? raw.points : {}) as Record<string, unknown>;
  s.points = Object.fromEntries(HOUSE_IDS.map((id) => [id, count(points[id])])) as Record<HouseId, number>;
  s.snitches = count(raw.snitches);
  s.mapExclude = isStringList(raw.mapExclude) ? [...raw.mapExclude] : [];
  s.restrictedFolders = isStringList(raw.restrictedFolders) ? [...raw.restrictedFolders] : [];
  s.footprints = isStringList(raw.footprints) ? [...raw.footprints] : [];
  s.route = sanitizeRoute(raw.route);
  s.wand = sanitizeWand(raw.wand);
  return s;
}

/** «Шаблоны, Архив/» → ['Шаблоны', 'Архив']: по строке или через запятую, без лишних «/». */
export function parseFolderList(text: string): string[] {
  const out: string[] = [];
  for (const part of text.split(/[\n,]/)) {
    const folder = part.trim().replace(/^\/+|\/+$/g, '');
    if (folder && !out.includes(folder)) out.push(folder);
  }
  return out;
}
