/*
 * HP Theme — применение темы на странице.
 *
 * 1. Читает настройки из storage.sync и выставляет на <html> атрибуты data-hp-* и CSS-переменные --hp-*.
 * 2. В режиме «полностью» размечает элементы страницы (data-hp-bg / data-hp-fg / data-hp-bd),
 *    чтобы theme.css перекрасил светлые нейтральные фоны и текст на них, не трогая брендовые блоки.
 * 3. Отдаёт небольшой API (HP.theme) для пасхалок и отвечает попапу на сообщения.
 */
(() => {
  if (globalThis.HP && globalThis.HP.theme) return; // защита от повторной инъекции

  const ext = globalThis.browser ?? globalThis.chrome;
  const { HOUSES, DEFAULT_SETTINGS, colors: C } = globalThis.HP;
  const root = document.documentElement;
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');

  const state = {
    settings: { ...DEFAULT_SETTINGS },
    paused: false,       // «Шалость удалась» — выключено на этой вкладке до перезагрузки
    active: false,
    mode: 'parchment',
    palette: null,
    listeners: new Set()
  };

  // ---------- Шрифты ----------

  const FONT_FILES = [
    ['HP Literata', 'literata', '400', 'normal'],
    ['HP Literata', 'literata', '400', 'italic'],
    ['HP Literata', 'literata', '700', 'normal'],
    ['HP Forum', 'forum', '400', 'normal']
  ];
  const SUBSETS = {
    latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    cyrillic: 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116'
  };
  let fontsAdded = false;

  // FontFace API вместо <style>: не упирается в CSP страницы на inline-стили.
  function addFonts() {
    if (fontsAdded || !document.fonts || typeof FontFace === 'undefined') return;
    fontsAdded = true;
    for (const [family, file, weight, style] of FONT_FILES) {
      for (const [subset, range] of Object.entries(SUBSETS)) {
        const url = ext.runtime.getURL(`fonts/${file}-${subset}-${weight}-${style}.woff2`);
        try {
          const face = new FontFace(family, `url("${url}") format("woff2")`, {
            weight, style, unicodeRange: range, display: 'swap'
          });
          document.fonts.add(face);
        } catch (e) {
          // Шрифт не обязателен: в стеке есть Georgia и системные антиквы.
        }
      }
    }
  }

  const WAND_CURSOR = 'url("data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
    '<path d="M4 4l20 20" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
    '<path d="M4 4l20 20" stroke="#3b2414" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M18 18l6 6" stroke="#5c3a1e" stroke-width="3.6" stroke-linecap="round"/>' +
    '<circle cx="4" cy="4" r="2.6" fill="#ffe9a8"/></svg>') + '") 3 3';

  // ---------- Применение настроек ----------

  function resolveMode(s) {
    if (s.mode === 'auto') return darkQuery.matches ? 'common' : 'parchment';
    return s.mode === 'common' ? 'common' : 'parchment';
  }

  function isEnabledHere(s) {
    return s.enabled && !state.paused && !(s.disabledHosts || []).includes(location.hostname);
  }

  const VAR_KEYS = {
    bg: '--hp-bg', surface: '--hp-surface', text: '--hp-text', muted: '--hp-muted',
    primary: '--hp-primary', onPrimary: '--hp-on-primary', accent: '--hp-accent',
    link: '--hp-link', border: '--hp-border'
  };

  function apply() {
    const s = state.settings;
    if (!isEnabledHere(s)) {
      teardown();
      notify();
      return;
    }
    const house = HOUSES[s.house] ? s.house : DEFAULT_SETTINGS.house;
    const mode = resolveMode(s);
    const palette = HOUSES[house].palettes[mode];
    const paletteChanged = state.palette !== palette;

    addFonts();
    for (const [k, v] of Object.entries(VAR_KEYS)) root.style.setProperty(v, palette[k]);
    root.style.setProperty('--hp-font-body', '"HP Literata", Literata, Georgia, "Times New Roman", serif');
    root.style.setProperty('--hp-font-display', '"HP Forum", "HP Literata", Georgia, serif');
    root.style.setProperty('--hp-wand-cursor', WAND_CURSOR);

    setAttr('data-hp-theme', house);
    setAttr('data-hp-mode', mode);
    setAttr('data-hp-intensity', s.intensity === 'accents' ? 'accents' : 'full');
    setAttr('data-hp-font', s.readableFont ? '' : null);
    setAttr('data-hp-wand', s.wandCursor ? '' : null);

    state.active = true;
    state.mode = mode;
    state.palette = palette;

    if (s.intensity === 'accents') adapter.stop();
    else adapter.start(palette, paletteChanged);
    notify();
  }

  function teardown() {
    adapter.stop();
    for (const v of [...Object.values(VAR_KEYS), '--hp-font-body', '--hp-font-display', '--hp-wand-cursor']) {
      root.style.removeProperty(v);
    }
    for (const a of ['data-hp-theme', 'data-hp-mode', 'data-hp-intensity', 'data-hp-font', 'data-hp-wand']) {
      root.removeAttribute(a);
    }
    if (root.getAttribute('style') === '') root.removeAttribute('style');
    state.active = false;
    state.palette = null;
  }

  function setAttr(name, value) {
    if (value === null) root.removeAttribute(name);
    else if (root.getAttribute(name) !== value) root.setAttribute(name, value);
  }

  function notify() {
    for (const fn of state.listeners) {
      try { fn(api.snapshot()); } catch (e) { /* слушатель пасхалок не должен ломать тему */ }
    }
  }

  // ---------- Адаптивная перекраска (режим «полностью») ----------

  const adapter = (() => {
    const SKIP_TAGS = new Set([
      'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'LINK', 'META', 'HEAD', 'TITLE', 'BR', 'WBR',
      'IMG', 'PICTURE', 'SOURCE', 'VIDEO', 'AUDIO', 'CANVAS', 'IFRAME', 'OBJECT', 'EMBED', 'MATH'
    ]);
    const FORM_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON']);
    const MARKS = ['data-hp-bg', 'data-hp-fg', 'data-hp-bd'];
    const SYNC_LIMIT = 20000;

    let info = new WeakMap();   // элемент -> { zone, effBg, origColor, role }
    let palette = null;
    let paletteColors = null;
    let base = null;             // { bg, color, light }
    let rootInfo = null;
    let observer = null;
    let pending = new Set();
    let timer = 0;
    let running = false;

    function start(p, paletteChanged) {
      palette = p;
      paletteColors = {
        text: C.hexToColor(p.text), muted: C.hexToColor(p.muted),
        heading: C.hexToColor(p.primary), link: C.hexToColor(p.link), bg: C.hexToColor(p.bg)
      };
      if (!document.body) {
        document.addEventListener('DOMContentLoaded', () => state.active && start(palette, true), { once: true });
        return;
      }
      if (running && !paletteChanged) return;
      fullPass();
      if (!observer) {
        observer = new MutationObserver(onMutations);
        observer.observe(document.documentElement, { childList: true, subtree: true });
      }
      running = true;
    }

    function stop() {
      if (observer) observer.disconnect();
      observer = null;
      clearTimeout(timer);
      pending.clear();
      clearMarks(document);
      info = new WeakMap();
      running = false;
    }

    function clearMarks(scope) {
      for (const el of scope.querySelectorAll('[data-hp-bg],[data-hp-fg],[data-hp-bd]')) {
        for (const m of MARKS) el.removeAttribute(m);
        if (el.style && el.style.getPropertyValue('--hp-orig-color')) {
          el.style.removeProperty('--hp-orig-color');
          if (el.getAttribute('style') === '') el.removeAttribute('style');
        }
      }
    }

    /*
     * Полный проход: на время чтения выключаем полное оформление, чтобы видеть
     * исходные цвета сайта, затем включаем обратно и расставляем разметку.
     * Всё происходит в одной задаче — браузер не успевает отрисовать «голую» страницу.
     */
    function fullPass() {
      const intensity = root.getAttribute('data-hp-intensity');
      root.removeAttribute('data-hp-intensity');
      clearMarks(document);
      info = new WeakMap();

      base = readBase();
      rootInfo = { zone: 'themed', effBg: base.bg, origColor: base.color, role: 'text' };
      info.set(document.documentElement, rootInfo);
      info.set(document.body, rootInfo);

      const writes = [];
      const walker = makeWalker(document.body);
      let n = 0;
      for (let el = walker.nextNode(); el && n < SYNC_LIMIT; el = walker.nextNode(), n++) {
        const w = analyze(el, false);
        if (w) writes.push(w);
      }
      root.setAttribute('data-hp-intensity', intensity || 'full');
      for (const w of writes) write(w);
    }

    function readBase() {
      const bodyCs = getComputedStyle(document.body);
      const htmlCs = getComputedStyle(document.documentElement);
      let bg = C.parseColor(bodyCs.backgroundColor);
      if (!C.isOpaque(bg)) bg = C.parseColor(htmlCs.backgroundColor);
      if (!C.isOpaque(bg)) bg = { r: 255, g: 255, b: 255, a: 1 };
      const color = C.parseColor(bodyCs.color) || { r: 0, g: 0, b: 0, a: 1 };
      return { bg, color, light: C.luminance(bg) >= 0.4 };
    }

    function makeWalker(scope) {
      return document.createTreeWalker(scope, NodeFilter.SHOW_ELEMENT, {
        acceptNode(el) {
          if (SKIP_TAGS.has(el.tagName) || el instanceof SVGElement || el.id === 'hp-theme-overlay') {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
    }

    function infoOf(el) {
      if (!el || el === document.body || el === document.documentElement) return rootInfo;
      const known = info.get(el);
      if (known) return known;
      const w = analyze(el, true); // предок ещё не размечен (например, добавлен только что)
      if (w) write(w);
      return info.get(el) || rootInfo;
    }

    /*
     * Решает, как перекрасить элемент. themedState=true означает, что читаем стили
     * уже при включённой теме (новые узлы из MutationObserver): тогда унаследованный
     * цвет темы распознаём и подменяем исходным цветом родителя.
     */
    function analyze(el, themedState) {
      const parentInfo = infoOf(el.parentElement);
      const cs = getComputedStyle(el);
      const bgc = C.parseColor(cs.backgroundColor);
      let color = C.parseColor(cs.color) || parentInfo.origColor;

      if (themedState && parentInfo.role && paletteColors[parentInfo.role] &&
          C.sameColor(color, paletteColors[parentInfo.role])) {
        color = parentInfo.origColor;
      }

      let zone = parentInfo.zone;
      let effBg = parentInfo.effBg;
      let bgRole = null;

      if (cs.backgroundImage !== 'none') {
        zone = 'other';
      } else if (C.isOpaque(bgc)) {
        if (C.isThemeableBackground(bgc, base.light)) {
          zone = 'themed';
          bgRole = parentInfo.zone === 'themed' && C.sameColor(bgc, effBg) ? 'bg' : 'surface';
        } else {
          zone = 'other';
        }
        effBg = bgc;
      }

      let role = null;
      if (zone === 'themed') {
        const tag = el.tagName;
        if (tag === 'A' && el.hasAttribute('href') && !C.isNeutral(color)) role = 'link';
        else if (/^H[1-6]$/.test(tag) && C.isNeutral(color)) role = 'heading';
        else role = C.textRole(color, effBg, paletteColors.bg);
      } else if (parentInfo.role && !FORM_TAGS.has(el.tagName)) {
        // Блок со своим (не перекрашиваемым) фоном внутри темы: возвращаем ему исходный цвет текста.
        role = 'orig';
      }

      let border = false;
      if (zone === 'themed' && parseFloat(cs.borderTopWidth) + parseFloat(cs.borderLeftWidth) +
          parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderRightWidth) > 0) {
        const bc = C.parseColor(cs.borderTopColor) || C.parseColor(cs.borderLeftColor);
        border = !!bc && C.isNeutral(bc);
      }

      info.set(el, { zone, effBg, origColor: color, role: role === 'orig' ? null : role });
      if (!bgRole && !role && !border) return null;
      return { el, bgRole, role, border, color };
    }

    function write({ el, bgRole, role, border, color }) {
      if (bgRole) el.setAttribute('data-hp-bg', bgRole);
      if (role === 'orig') {
        el.setAttribute('data-hp-fg', 'orig');
        el.style.setProperty('--hp-orig-color', `rgb(${color.r}, ${color.g}, ${color.b})`);
      } else if (role) {
        el.setAttribute('data-hp-fg', role);
      }
      if (border) el.setAttribute('data-hp-bd', '');
    }

    function onMutations(list) {
      for (const m of list) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1 && node.id !== 'hp-theme-overlay') pending.add(node);
        }
      }
      if (pending.size && !timer) timer = setTimeout(flush, 60);
    }

    function flush() {
      timer = 0;
      if (!running) return;
      const nodes = [...pending];
      pending.clear();
      const writes = [];
      for (const node of nodes) {
        if (!node.isConnected || info.has(node)) continue;
        if (SKIP_TAGS.has(node.tagName) || node instanceof SVGElement) continue;
        const first = analyze(node, true);
        if (first) writes.push(first);
        const walker = makeWalker(node);
        for (let el = walker.nextNode(); el; el = walker.nextNode()) {
          if (info.has(el)) continue;
          const w = analyze(el, true);
          if (w) writes.push(w);
        }
      }
      for (const w of writes) write(w);
    }

    return { start, stop };
  })();

  // ---------- Настройки и сообщения ----------

  async function loadSettings() {
    try {
      state.settings = { ...DEFAULT_SETTINGS, ...(await ext.storage.sync.get(DEFAULT_SETTINGS)) };
    } catch (e) {
      state.settings = { ...DEFAULT_SETTINGS };
    }
  }

  ext.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    const relevant = ['enabled', 'house', 'mode', 'intensity', 'readableFont', 'wandCursor', 'disabledHosts'];
    for (const [k, { newValue }] of Object.entries(changes)) {
      state.settings[k] = newValue === undefined ? DEFAULT_SETTINGS[k] : newValue;
    }
    if (Object.keys(changes).some((k) => relevant.includes(k))) apply();
    else notify();
  });

  darkQuery.addEventListener('change', () => {
    if (state.settings.mode === 'auto') apply();
  });

  ext.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || typeof msg.type !== 'string') return undefined;
    if (msg.type === 'hp:getPageState') {
      sendResponse({ host: location.hostname, active: state.active, paused: state.paused });
    }
    return undefined;
  });

  const api = {
    snapshot() {
      return { settings: state.settings, active: state.active, paused: state.paused, mode: state.mode, palette: state.palette };
    },
    onChange(fn) { state.listeners.add(fn); },
    setPaused(paused) {
      state.paused = paused;
      apply();
    },
    async update(patch) {
      Object.assign(state.settings, patch);
      try {
        await ext.storage.sync.set(patch);
      } catch (e) {
        apply(); // хранилище недоступно — применяем хотя бы на этой странице
      }
    }
  };
  globalThis.HP.theme = api;

  loadSettings().then(apply);
})();
