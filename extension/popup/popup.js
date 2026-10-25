/* HP Theme — попап: выбор факультета и режимов, Распределяющая шляпа, отключение на сайте. */
(async () => {
  const ext = globalThis.browser ?? globalThis.chrome;
  const { HOUSES, HOUSE_IDS, DEFAULT_SETTINGS, crest } = globalThis.HP;
  const $ = (sel) => document.querySelector(sel);
  const t = (key, subs) => ext.i18n.getMessage(key, subs) || key;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');

  let settings = { ...DEFAULT_SETTINGS };
  let page = null; // { host, active, paused } от content script текущей вкладки

  // ---------- i18n ----------

  document.documentElement.lang = (ext.i18n.getUILanguage() || 'ru').slice(0, 2);
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
  $('.switch').title = t('popupEnabled');

  // ---------- Данные ----------

  try {
    settings = { ...DEFAULT_SETTINGS, ...(await ext.storage.sync.get(DEFAULT_SETTINGS)) };
  } catch (e) {
    // остаёмся на значениях по умолчанию
  }

  try {
    const [tab] = await ext.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id !== undefined) page = await ext.tabs.sendMessage(tab.id, { type: 'hp:getPageState' });
  } catch (e) {
    page = null; // служебная страница браузера или content script не внедрён
  }

  ext.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    for (const [k, { newValue }] of Object.entries(changes)) settings[k] = newValue === undefined ? DEFAULT_SETTINGS[k] : newValue;
    render();
  });

  function save(patch) {
    Object.assign(settings, patch);
    render();
    return ext.storage.sync.set(patch);
  }

  // ---------- Отрисовка ----------

  function resolvedMode() {
    if (settings.mode === 'auto') return darkQuery.matches ? 'common' : 'parchment';
    return settings.mode;
  }

  const VARS = {
    bg: '--hp-bg', surface: '--hp-surface', text: '--hp-text', muted: '--hp-muted', primary: '--hp-primary',
    onPrimary: '--hp-on-primary', accent: '--hp-accent', link: '--hp-link', border: '--hp-border'
  };

  // Кнопки факультетов создаются один раз
  const housesBox = $('#houses');
  for (const id of HOUSE_IDS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'house';
    b.setAttribute('role', 'radio');
    b.dataset.house = id;
    b.append(crest.svgElement(crest.crestSvg(id, 22)), t(`house_${id}`));
    b.addEventListener('click', () => save({ house: id }));
    housesBox.appendChild(b);
  }

  function render() {
    const house = HOUSES[settings.house] ? settings.house : DEFAULT_SETTINGS.house;
    const mode = resolvedMode();
    const palette = HOUSES[house].palettes[mode];
    for (const [k, v] of Object.entries(VARS)) document.documentElement.style.setProperty(v, palette[k]);
    document.documentElement.style.colorScheme = mode === 'common' ? 'dark' : 'light';

    $('#crest').replaceChildren(crest.svgElement(crest.crestSvg(house, 38)));
    $('#subtitle').textContent = `${t(`house_${house}`)} · ${t(mode === 'common' ? 'modeCommon' : 'modeParchment')}`;
    $('#enabled').checked = !!settings.enabled;
    $('#popup').classList.toggle('off', !settings.enabled);

    for (const b of housesBox.children) b.setAttribute('aria-checked', String(b.dataset.house === house));
    for (const seg of document.querySelectorAll('.seg')) {
      for (const b of seg.children) b.setAttribute('aria-checked', String(settings[seg.dataset.setting] === b.dataset.value));
    }
    $('#readableFont').checked = !!settings.readableFont;
    $('#wandCursor').checked = !!settings.wandCursor;
    $('#wandCursor').disabled = settings.intensity !== 'full';

    const siteBtn = $('#site');
    const note = $('#site-note');
    if (page && page.host) {
      const off = (settings.disabledHosts || []).includes(page.host);
      siteBtn.hidden = false;
      siteBtn.textContent = t(off ? 'popupEnableSite' : 'popupDisableSite', [page.host]);
      note.hidden = !page.paused;
      note.textContent = page.paused ? t('popupPaused') : '';
    } else {
      siteBtn.hidden = true;
      note.hidden = false;
      note.textContent = t('popupNoSite');
    }

    const points = (settings.points && settings.points[house]) || 0;
    const pointsEl = $('#points');
    pointsEl.textContent = `⚡ ${t('popupPoints', [String(points)])}`;
    pointsEl.title = t('popupSnitches', [String(settings.snitches || 0)]);
  }

  // ---------- События ----------

  $('#enabled').addEventListener('change', (e) => save({ enabled: e.target.checked }));
  $('#readableFont').addEventListener('change', (e) => save({ readableFont: e.target.checked }));
  $('#wandCursor').addEventListener('change', (e) => save({ wandCursor: e.target.checked }));

  for (const seg of document.querySelectorAll('.seg')) {
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-value]');
      if (b) save({ [seg.dataset.setting]: b.dataset.value });
    });
  }

  // Стрелки внутри радиогрупп
  document.addEventListener('keydown', (e) => {
    const group = e.target.closest && e.target.closest('[role="radiogroup"]');
    if (!group || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    const items = [...group.querySelectorAll('[role="radio"]')];
    const i = items.indexOf(e.target);
    const next = items[(i + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length];
    next.focus();
    next.click();
    e.preventDefault();
  });

  $('#site').addEventListener('click', () => {
    if (!page || !page.host) return;
    const hosts = new Set(settings.disabledHosts || []);
    if (hosts.has(page.host)) hosts.delete(page.host);
    else hosts.add(page.host);
    save({ disabledHosts: [...hosts] });
  });

  // Пасхалка: тройной клик по гербу — девиз Хогвартса
  let clicks = [];
  $('#crest').addEventListener('click', () => {
    const now = Date.now();
    clicks = clicks.filter((x) => now - x < 700).concat(now);
    if (clicks.length >= 3) {
      clicks = [];
      $('#motto').hidden = !$('#motto').hidden;
    }
  });

  // ---------- Распределяющая шляпа ----------

  const sleep = (ms) => new Promise((r) => setTimeout(r, reducedMotion ? Math.min(ms, 150) : ms));

  $('#sort').addEventListener('click', async () => {
    const hat = $('#hat');
    const text = $('#hat-text');
    hat.hidden = false;
    text.classList.remove('verdict');

    const phrases = ['hat1', 'hat2', 'hat3', 'hat4'].sort(() => Math.random() - 0.5).slice(0, 3);
    for (const key of phrases) {
      text.textContent = t(key);
      await sleep(1100);
    }

    const house = HOUSE_IDS[Math.floor(Math.random() * HOUSE_IDS.length)];
    const palette = HOUSES[house].palettes[resolvedMode()];
    hat.style.setProperty('--hp-primary', palette.primary);
    hat.style.setProperty('--hp-bg', palette.bg);
    text.classList.add('verdict');
    text.textContent = t(`houseUpper_${house}`);
    await sleep(1500);

    hat.hidden = true;
    hat.style.removeProperty('--hp-primary');
    hat.style.removeProperty('--hp-bg');
    await save({ house });
  });

  render();
})();
