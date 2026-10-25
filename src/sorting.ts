/*
 * Распределяющая шляпа как испытание: несколько вопросов, каждый ответ — голос за факультет.
 * Чистая логика без DOM; тексты вопросов и ответов — в i18n.ts (quiz_<вопрос>, quiz_<вопрос>_<факультет>).
 */
import { HOUSE_IDS } from './houses.ts';
import type { HouseId } from './houses.ts';

export const QUIZ_QUESTIONS = ['noise', 'virtue', 'book', 'subject', 'legacy', 'team'] as const;
export type QuizQuestion = typeof QUIZ_QUESTIONS[number];

/** Ответы в случайном порядке, чтобы первый вариант не был всегда за Гриффиндор. */
export function shuffled<T>(items: readonly T[], random = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Вердикт: факультет, за который больше всего ответов. При ничьей шляпа прислушивается
 * к тому, что было сказано позже: побеждает спорный факультет из последнего ответа.
 * Без ответов — шляпа решает сама (случайно).
 */
export function sortByAnswers(answers: HouseId[], random = Math.random): HouseId {
  if (!answers.length) return HOUSE_IDS[Math.floor(random() * HOUSE_IDS.length)];
  const score = new Map<HouseId, number>(HOUSE_IDS.map((h) => [h, 0]));
  for (const a of answers) score.set(a, (score.get(a) ?? 0) + 1);
  const best = Math.max(...score.values());
  const tied = HOUSE_IDS.filter((h) => score.get(h) === best);
  for (let i = answers.length - 1; i >= 0; i--) if (tied.includes(answers[i])) return answers[i];
  return tied[0];
}
