/*
 * Очки факультету за работу: закрытые задачи и запись в ежедневной заметке.
 * Чистая логика без Obsidian: на вход — listItems из metadataCache и пути заметок.
 */

export const TASK_POINTS = 10;
export const DAILY_POINTS = 20;

/** Закрытые задачи заметки: «- [x]». Отменённые «- [-]» и прочие статусы не считаются. */
export function countDoneTasks(listItems?: { task?: string }[]): number {
  return listItems?.filter((item) => item.task === 'x' || item.task === 'X').length ?? 0;
}

/**
 * Сколько задач закрыто сверх прежнего рекорда заметки. Снять галочку и поставить снова —
 * не новые очки. best === undefined — заметку видим впервые: запоминаем, но не награждаем.
 */
export function newlyDone(best: number | undefined, done: number): { award: number; best: number } {
  if (best === undefined) return { award: 0, best: done };
  return { award: Math.max(0, done - best), best: Math.max(best, done) };
}

/** Ежедневная заметка на сегодня: имя по формату дневника («2026-10-25» или «2026/10/25») в любой папке. */
export function isDailyNote(path: string, todayName: string): boolean {
  const name = path.replace(/\.md$/, '');
  return !!todayName && (name === todayName || name.endsWith('/' + todayName));
}
