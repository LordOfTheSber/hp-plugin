import test from 'node:test';
import assert from 'node:assert/strict';
import { QUIZ_QUESTIONS, shuffled, sortByAnswers } from '../src/sorting.ts';
import { DAILY_POINTS, TASK_POINTS, countDoneTasks, isDailyNote, newlyDone } from '../src/work.ts';
import { PENSIEVE_DAYS, daysSince, pensieveCandidates, pickPensieve, timeTurner, yearAgo } from '../src/memories.ts';
import { cloakCallout, toggleCloak } from '../src/cloak.ts';
import { STRINGS } from '../src/i18n.ts';
import { HOUSE_IDS } from '../src/houses.ts';

const DAY = 24 * 60 * 60 * 1000;

test('шляпа: больше всего ответов — этот факультет, при ничьей — последнее слово', () => {
  assert.equal(sortByAnswers(['ravenclaw', 'ravenclaw', 'gryffindor']), 'ravenclaw');
  assert.equal(sortByAnswers(['slytherin', 'gryffindor', 'gryffindor', 'slytherin']), 'slytherin');
  assert.equal(sortByAnswers(['hufflepuff', 'gryffindor']), 'gryffindor');
  assert.equal(sortByAnswers([], () => 0.99), 'hufflepuff', 'без ответов — шляпа решает сама');
  assert.deepEqual(shuffled([1, 2, 3, 4], () => 0).sort(), [1, 2, 3, 4]);
});

test('шляпа: у каждого вопроса есть ответ за каждый факультет на обоих языках', () => {
  assert.ok(QUIZ_QUESTIONS.length >= 5 && QUIZ_QUESTIONS.length <= 7);
  for (const lang of ['en', 'ru'] as const) {
    const dict = STRINGS[lang] as Record<string, string>;
    for (const q of QUIZ_QUESTIONS) {
      assert.ok(dict[`quiz_${q}`], `${lang}: quiz_${q}`);
      for (const h of HOUSE_IDS) assert.ok(dict[`quiz_${q}_${h}`], `${lang}: quiz_${q}_${h}`);
    }
  }
});

test('очки за работу: только новые закрытые задачи', () => {
  assert.equal(countDoneTasks([{ task: 'x' }, { task: ' ' }, { task: 'X' }, { task: '-' }, {}]), 2);
  assert.equal(countDoneTasks(undefined), 0);
  assert.deepEqual(newlyDone(undefined, 5), { award: 0, best: 5 }, 'старые задачи — без очков');
  assert.deepEqual(newlyDone(5, 7), { award: 2, best: 7 });
  assert.deepEqual(newlyDone(7, 6), { award: 0, best: 7 }, 'сняли галочку — рекорд остаётся');
  assert.deepEqual(newlyDone(7, 7), { award: 0, best: 7 }, 'и поставили снова — без очков');
  assert.ok(TASK_POINTS > 0 && DAILY_POINTS > 0);
});

test('ежедневная заметка: по формату дневника, в любой папке', () => {
  assert.ok(isDailyNote('2026-10-25.md', '2026-10-25'));
  assert.ok(isDailyNote('Дневник/2026-10-25.md', '2026-10-25'));
  assert.ok(isDailyNote('Journal/2026/10/25.md', '2026/10/25'));
  assert.ok(!isDailyNote('Дневник/2026-10-25 планы.md', '2026-10-25'));
  assert.ok(!isDailyNote('x.md', ''));
});

test('Омут памяти: давно не менявшиеся заметки, а если таких нет — самые забытые', () => {
  const now = 1000 * DAY;
  const notes = [
    { path: 'old.md', ctime: 0, mtime: now - (PENSIEVE_DAYS + 1) * DAY },
    { path: 'new.md', ctime: 0, mtime: now - DAY },
    { path: 'newer.md', ctime: 0, mtime: now }
  ];
  assert.deepEqual(pensieveCandidates(notes, now).map((n) => n.path), ['old.md']);
  assert.deepEqual(pensieveCandidates(notes.slice(1), now).map((n) => n.path), ['new.md']);
  assert.equal(pickPensieve([], now), null);
  assert.equal(pickPensieve(notes, now)?.path, 'old.md');
  assert.equal(daysSince(now - 3.5 * DAY, now), 3);
});

test('Маховик времени: ровно год назад, ежедневная заметка первой', () => {
  assert.deepEqual(yearAgo(new Date(2026, 9, 25)), new Date(2025, 9, 25));
  assert.deepEqual(yearAgo(new Date(2028, 1, 29)), new Date(2027, 1, 28), '29 февраля → 28-е');
  const day = new Date(2025, 9, 25);
  const at = (h: number) => new Date(2025, 9, 25, h).getTime();
  const notes = [
    { path: 'Идеи.md', ctime: at(18), mtime: 0 },
    { path: 'Дневник/2025-10-25.md', ctime: at(23), mtime: 0 },
    { path: 'Позже.md', ctime: new Date(2025, 9, 26, 1).getTime(), mtime: 0 },
    { path: 'Утро.md', ctime: at(8), mtime: 0 }
  ];
  assert.deepEqual(timeTurner(notes, day, '2025-10-25').map((n) => n.path), ['Дневник/2025-10-25.md', 'Утро.md', 'Идеи.md']);
});

test('Мантия-невидимка: накинуть и снять', () => {
  const cloaked = toggleCloak('пароль');
  assert.equal(cloaked, '<span class="hp-cloak">пароль</span>');
  assert.equal(toggleCloak(cloaked), 'пароль');
  assert.equal(cloakCallout('Мантия'), '> [!cloak] Мантия\n> ');
});
