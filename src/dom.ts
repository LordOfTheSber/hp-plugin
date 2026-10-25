/** Поле ввода или редактор: там клавиатура и правая кнопка ведут себя как обычно. */
export function isEditable(el: Element | null): boolean {
  if (!el || el.nodeType !== 1) return false;
  if ((el as HTMLElement).isContentEditable) return true;
  const tag = el.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag === 'INPUT') return !/^(button|checkbox|radio|range|color|submit|reset|file|image)$/i.test((el as HTMLInputElement).type);
  return !!el.closest('.cm-editor, [contenteditable="true"]');
}

/** Документ окна, где случилось событие: у Obsidian бывают отдельные окна. */
export function eventDocument(e: Event): Document {
  const view = (e as UIEvent).view;
  if (view?.document) return view.document;
  const target = e.target as Node | null;
  return target?.ownerDocument ?? (target as Document | null)?.defaultView?.document ?? document;
}
