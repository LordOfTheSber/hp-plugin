/*
 * Распознавание «заклинаний», набранных на клавиатуре.
 * Чистая логика без DOM: на вход — KeyboardEvent.key, на выход — имя сработавшего заклинания.
 */
(function (root) {
  // Порядок важен: более длинные фразы проверяются раньше.
  const SPELLS = [
    { id: 'solemnlySwear', words: ['solemnly swear', 'клянусь что замышляю только шалость'] },
    { id: 'mischiefManaged', words: ['mischief managed', 'шалость удалась'] },
    { id: 'accioSnitch', words: ['accio snitch', 'акцио снитч'] },
    { id: 'lumos', words: ['lumos', 'люмос'] },
    { id: 'nox', words: ['nox', 'нокс'] }
  ];

  const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  // На русской раскладке B/A — это «и»/«ф».
  const KONAMI_ALIASES = { 'и': 'b', 'ф': 'a' };
  const MAX_BUFFER = 48;

  function createSpellbook() {
    let text = '';
    let keys = [];

    return {
      /** @returns {string|null} id заклинания */
      push(key) {
        if (typeof key !== 'string') return null;
        const k = key.toLowerCase();

        keys.push(KONAMI_ALIASES[k] || k);
        if (keys.length > KONAMI.length) keys.shift();
        if (keys.length === KONAMI.length && keys.every((x, i) => x === KONAMI[i])) {
          keys = [];
          text = '';
          return 'accioSnitch';
        }

        if (k.length !== 1) return null; // Shift, Enter, стрелки и т.п. не влияют на текст
        // Знаки препинания и пробелы сворачиваются в один пробел: «I solemnly swear, that…» тоже сработает.
        const ch = /[\p{L}\p{N}]/u.test(k) ? (k === 'ё' ? 'е' : k) : ' ';
        if (ch === ' ' && text.endsWith(' ')) return null;
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

  // Заклинание должно начинаться с новой «словоформы»: «equinox» не равно «nox».
  function isWordStart(text, word) {
    const before = text.length - word.length - 1;
    return before < 0 || text[before] === ' ';
  }

  const api = { createSpellbook, SPELLS, KONAMI };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HP = Object.assign(root.HP || {}, { spells: api });
})(typeof globalThis !== 'undefined' ? globalThis : this);
