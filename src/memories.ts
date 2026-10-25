/*
 * «Омут памяти» и «Маховик времени»: старые заметки, к которым стоит вернуться.
 * Чистая логика без Obsidian: на вход — пути и время создания и изменения заметок.
 */
import { isDailyNote } from './work.ts';

export interface NoteStat {
  path: string;
  ctime: number;
  mtime: number;
}

const DAY = 24 * 60 * 60 * 1000;
/** Сколько дней заметка должна пролежать нетронутой, чтобы попасть в Омут памяти. */
export const PENSIEVE_DAYS = 90;

export function daysSince(time: number, now: number): number {
  return Math.max(0, Math.floor((now - time) / DAY));
}

/** Заметки, которые давно не меняли. Если давних нет, то самая забытая четверть хранилища. */
export function pensieveCandidates(notes: NoteStat[], now: number, minDays = PENSIEVE_DAYS): NoteStat[] {
  const old = notes.filter((n) => now - n.mtime >= minDays * DAY);
  if (old.length) return old;
  const sorted = [...notes].sort((a, b) => a.mtime - b.mtime);
  return sorted.slice(0, Math.ceil(sorted.length / 4));
}

export function pickPensieve(notes: NoteStat[], now: number, random = Math.random): NoteStat | null {
  const list = pensieveCandidates(notes, now);
  return list.length ? list[Math.floor(random() * list.length)] : null;
}

/** Тот же день год назад; 29 февраля — 28-го: в невисокосный год такого дня нет. */
export function yearAgo(now: Date): Date {
  const d = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(now.getDate(), last));
  return d;
}

function sameDay(time: number, day: Date): boolean {
  const t = new Date(time);
  return t.getFullYear() === day.getFullYear() && t.getMonth() === day.getMonth() && t.getDate() === day.getDate();
}

/**
 * Заметки «ровно год назад»: ежедневная заметка за тот день (dailyName — её имя по формату дневника)
 * и заметки, созданные в тот день. Ежедневная — первой.
 */
export function timeTurner(notes: NoteStat[], day: Date, dailyName: string): NoteStat[] {
  const daily = notes.filter((n) => isDailyNote(n.path, dailyName));
  const created = notes.filter((n) => sameDay(n.ctime, day) && !daily.includes(n))
    .sort((a, b) => a.ctime - b.ctime);
  return [...daily, ...created];
}
