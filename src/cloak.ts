/* «Мантия-невидимка»: текст под мантией размыт, пока не наведёшь курсор. */

const OPEN = '<span class="hp-cloak">';
const CLOSE = '</span>';

/** Накинуть мантию на выделенный текст или снять её, если он уже под мантией. */
export function toggleCloak(text: string): string {
  if (text.startsWith(OPEN) && text.endsWith(CLOSE)) return text.slice(OPEN.length, -CLOSE.length);
  return OPEN + text + CLOSE;
}

/** Ничего не выделено — коллаут-мантия, в который можно спрятать целый абзац. */
export function cloakCallout(title: string): string {
  return `> [!cloak] ${title}\n> `;
}
