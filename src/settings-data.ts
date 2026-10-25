// Настройки плагина: значения по умолчанию и чтение сохранённых данных (без зависимости от obsidian).
import { HOUSE_IDS } from './houses.ts';
import type { HouseId } from './houses.ts';

export interface HpSettings {
  house: HouseId;
  readableFont: boolean;
  headingFont: boolean;
  ornaments: boolean;
  wandCursor: boolean;
  statusBar: boolean;
  easterEggs: boolean;
  points: Record<HouseId, number>;
  snitches: number;
  birthdayShown: string;
}

export const DEFAULT_SETTINGS: HpSettings = {
  house: 'gryffindor',
  readableFont: true,
  headingFont: true,
  ornaments: true,
  wandCursor: false,
  statusBar: true,
  easterEggs: true,
  points: { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 },
  snitches: 0,
  birthdayShown: ''
};

/** Сохранённые данные → полные настройки (неизвестные значения заменяются значениями по умолчанию). */
export function migrateSettings(data: unknown): HpSettings {
  const raw = (data && typeof data === 'object' ? data : {}) as Partial<HpSettings>;
  const settings: HpSettings = { ...DEFAULT_SETTINGS, ...raw, points: { ...DEFAULT_SETTINGS.points, ...(raw.points ?? {}) } };
  if (!HOUSE_IDS.includes(settings.house)) settings.house = DEFAULT_SETTINGS.house;
  return settings;
}
