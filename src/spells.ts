/*
 * Распознавание «заклинаний», набранных на клавиатуре.
 * Чистая логика без DOM: на вход — KeyboardEvent.key, на выход — id заклинания.
 */

export type SpellId = 'lumos' | 'nox' | 'solemnlySwear' | 'mischiefManaged' | 'accioSnitch' | 'wingardiumLeviosa';

// Порядок важен: длинные фразы проверяются раньше.
export const SPELLS: { id: SpellId; words: string[] }[] = [
  { id: 'solemnlySwear', words: ['i solemnly swear that i am up to no good', 'solemnly swear', 'клянусь что замышляю только шалость'] },
  { id: 'mischiefManaged', words: ['mischief managed', 'шалость удалась'] },
  { id: 'accioSnitch', words: ['accio snitch', 'акцио снитч'] },
  { id: 'wingardiumLeviosa', words: ['wingardium leviosa', 'вингардиум левиоса'] },
  { id: 'lumos', words: ['lumos', 'люмос'] },
  { id: 'nox', words: ['nox', 'нокс'] }
];

export const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
// На русской раскладке B/A — это «и»/«ф».
const KONAMI_ALIASES: Record<string, string> = { 'и': 'b', 'ф': 'a' };
const MAX_BUFFER = 48;

/** Приводит фразу к виду, в котором хранятся заклинания: нижний регистр, ё→е, знаки → один пробел. */
export function normalize(phrase: string): string {
  return phrase
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Для модалки «Взмахнуть палочкой»: целая фраза → заклинание. */
export function parseIncantation(phrase: string): SpellId | null {
  const text = normalize(phrase);
  for (const spell of SPELLS) {
    if (spell.words.includes(text)) return spell.id;
  }
  return null;
}

export interface Spellbook {
  push(key: string): SpellId | null;
  reset(): void;
}

export function createSpellbook(): Spellbook {
  let text = '';
  let keys: string[] = [];

  return {
    push(key) {
      if (typeof key !== 'string') return null;
      const k = key.toLowerCase();

      keys.push(KONAMI_ALIASES[k] ?? k);
      if (keys.length > KONAMI.length) keys.shift();
      if (keys.length === KONAMI.length && keys.every((x, i) => x === KONAMI[i])) {
        keys = [];
        text = '';
        return 'accioSnitch';
      }

      if ([...k].length !== 1) return null; // Shift, Enter, стрелки не влияют на текст
      const ch = /[\p{L}\p{N}]/u.test(k) ? (k === 'ё' ? 'е' : k) : ' ';
      if (ch === ' ' && (text === '' || text.endsWith(' '))) return null;
      text = (text + ch).slice(-MAX_BUFFER);

      for (const spell of SPELLS) {
        for (const w of spell.words) {
          if (text.endsWith(w) && isWordStart(text, w)) {
            text = '';
            return spell.id;
          }
        }
      }
      return null;
    },
    reset() {
      text = '';
      keys = [];
    }
  };
}

// Заклинание должно начинаться с нового слова: «equinox» — не «nox».
function isWordStart(text: string, word: string): boolean {
  const before = text.length - word.length - 1;
  return before < 0 || text[before] === ' ';
}
