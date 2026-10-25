/** Поле ввода или редактор: там клавиатура и правая кнопка ведут себя как обычно. */
export function isEditable(el: Element | null): boolean {
  if (!el || el.nodeType !== 1) return false;
  if ((el as HTMLElement).isContentEditable) return true;
  const tag = el.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag === 'INPUT') return !/^(button|checkbox|radio|range|color|submit|reset|file|image)$/i.test((el as HTMLInputElement).type);
  return !!el.closest('.cm-editor, [contenteditable="true"]');
}
