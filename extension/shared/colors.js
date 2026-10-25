/*
 * Чистые функции для анализа цветов страницы (без DOM) — используются
 * адаптивной перекраской в content/theme.js и покрыты тестами.
 */
(function (root) {
  // 'rgb(1, 2, 3)' | 'rgba(1, 2, 3, 0.5)' | 'rgb(1 2 3 / 50%)' -> {r, g, b, a} | null
  function parseColor(str) {
    if (!str) return null;
    const m = String(str).match(/rgba?\(([^)]+)\)/i);
    if (!m) return null;
    const parts = m[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const ch = parts.slice(0, 3).map(Number);
    if (ch.some(Number.isNaN)) return null;
    let a = 1;
    if (parts[3] !== undefined) a = parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
    return { r: ch[0], g: ch[1], b: ch[2], a };
  }

  function luminance({ r, g, b }) {
    const f = (v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }

  function contrast(c1, c2) {
    const l1 = luminance(c1);
    const l2 = luminance(c2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  // «Нейтральный» = почти серый: белый, чёрный, оттенки серого, слегка тёплые/холодные.
  function isNeutral({ r, g, b }) {
    return Math.max(r, g, b) - Math.min(r, g, b) <= 28;
  }

  function isOpaque(c) {
    return !!c && c.a >= 0.9;
  }

  function sameColor(a, b) {
    if (!a || !b) return false;
    return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) <= 6 && Math.abs(a.a - b.a) < 0.05;
  }

  /*
   * Можно ли перекрасить фон в цвет темы.
   * На светлом сайте перекрашиваем светлые нейтральные фоны (белый, светло-серый),
   * на тёмном — тёмные нейтральные. Цветные (брендовые) блоки не трогаем.
   */
  function isThemeableBackground(c, baseIsLight) {
    if (!isOpaque(c) || !isNeutral(c)) return false;
    const l = luminance(c);
    return baseIsLight ? l >= 0.6 : l <= 0.1;
  }

  /*
   * Как перекрасить текст, лежащий на фоне темы.
   * Возвращает 'text' | 'muted' | null (оставить цвет сайта).
   *   color    — исходный цвет текста;
   *   baseBg   — исходный фон сайта (для оценки «насколько текст второстепенный»);
   *   themeBg  — фон темы, на котором текст окажется.
   */
  function textRole(color, baseBg, themeBg) {
    if (!color) return null;
    if (isNeutral(color)) return contrast(color, baseBg) >= 7 ? 'text' : 'muted';
    // Цветной текст сохраняем, только если он остаётся читаемым на новом фоне.
    return contrast(color, themeBg) >= 4.5 ? null : 'text';
  }

  function hexToColor(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }

  const api = { parseColor, luminance, contrast, isNeutral, isOpaque, sameColor, isThemeableBackground, textRole, hexToColor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HP = Object.assign(root.HP || {}, { colors: api });
})(typeof globalThis !== 'undefined' ? globalThis : this);
