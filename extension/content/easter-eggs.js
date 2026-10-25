/*
 * HP Theme — пасхалки.
 *
 *   lumos / люмос                 — вспышка света, режим «пергамент»
 *   nox / нокс                    — свет гаснет, режим «гостиная»
 *   I solemnly swear… / клянусь…  — следы с Карты Мародёров (и возврат темы после «шалости»)
 *   mischief managed / шалость удалась — тема гаснет на вкладке до перезагрузки
 *   accio snitch / акцио снитч, код Konami — Золотой снитч: поймай и получи 150 очков
 *   31 июля                       — поздравление с днём рождения Гарри
 *
 * Всё рисуется в отдельном Shadow DOM, стили — инлайн через CSSOM, анимации — Web Animations API,
 * поэтому ни стили страницы, ни её CSP на пасхалки не влияют.
 */
(() => {
  const HP = globalThis.HP;
  if (!HP || !HP.theme || HP.eggs) return;

  const ext = globalThis.browser ?? globalThis.chrome;
  const theme = HP.theme;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const SNITCH_POINTS = 150;

  const t = (key, subs) => {
    try {
      return ext.i18n.getMessage(key, subs) || key;
    } catch (e) {
      return key;
    }
  };

  const palette = () => theme.snapshot().palette || HP.HOUSES[HP.DEFAULT_SETTINGS.house].palettes.parchment;
  const houseName = (id) => t(`house_${id}`);
  const css = (el, styles) => Object.assign(el.style, styles);
  const rand = (min, max) => min + Math.random() * (max - min);

  // ---------- Слой поверх страницы ----------

  let host = null;
  let layer = null;

  function getLayer() {
    if (layer && host.isConnected) return layer;
    host = document.createElement('div');
    host.id = 'hp-theme-overlay';
    css(host, {
      position: 'fixed', inset: '0', zIndex: '2147483647', pointerEvents: 'none',
      display: 'block', margin: '0', padding: '0', border: '0', background: 'none'
    });
    const shadow = host.attachShadow({ mode: 'open' });
    layer = document.createElement('div');
    css(layer, { position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none' });
    shadow.appendChild(layer);
    document.documentElement.appendChild(host);
    return layer;
  }

  function el(tag, styles, parent = getLayer()) {
    const node = document.createElement(tag);
    if (styles) css(node, styles);
    parent.appendChild(node);
    return node;
  }

  function svg(markup, styles) {
    const wrap = el('div', styles);
    wrap.appendChild(HP.crest.svgElement(markup));
    return wrap;
  }

  function done(animation, node) {
    animation.onfinish = () => node.remove();
    return animation;
  }

  // ---------- Тост ----------

  function toast(title, subtitle, ms = 2600) {
    const p = palette();
    const box = el('div', {
      position: 'absolute', left: '50%', top: '28px', transform: 'translateX(-50%)',
      maxWidth: 'min(520px, calc(100vw - 32px))', boxSizing: 'border-box',
      padding: '14px 22px', borderRadius: '12px', textAlign: 'center',
      background: p.surface, color: p.text, border: `2px solid ${p.primary}`,
      boxShadow: '0 12px 40px rgba(0,0,0,.28)',
      fontFamily: '"HP Literata", Georgia, serif', fontSize: '15px', lineHeight: '1.5'
    });
    const h = el('div', {
      fontFamily: '"HP Forum", Georgia, serif', fontSize: '24px', lineHeight: '1.2', color: p.primary,
      letterSpacing: '.02em'
    }, box);
    h.textContent = title;
    if (subtitle) {
      const s = el('div', { marginTop: '4px', color: p.muted }, box);
      s.textContent = subtitle;
    }
    box.setAttribute('role', 'status');
    done(box.animate([
      { opacity: 0, transform: 'translate(-50%, -12px)' },
      { opacity: 1, transform: 'translate(-50%, 0)', offset: 0.1 },
      { opacity: 1, transform: 'translate(-50%, 0)', offset: 0.85 },
      { opacity: 0, transform: 'translate(-50%, -6px)' }
    ], { duration: ms, easing: 'ease-out' }), box);
  }

  // ---------- Lumos / Nox ----------

  const pointer = { x: innerWidth / 2, y: innerHeight / 3 };
  addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }, { passive: true, capture: true });

  function lumos() {
    const size = 80;
    const glow = el('div', {
      position: 'absolute', left: `${pointer.x - size / 2}px`, top: `${pointer.y - size / 2}px`,
      width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,252,235,1) 0%, rgba(255,236,160,.75) 35%, rgba(255,236,160,0) 70%)'
    });
    const scale = (Math.hypot(innerWidth, innerHeight) / size) * 2.2;
    done(glow.animate([
      { transform: 'scale(.2)', opacity: 1 },
      { transform: `scale(${scale})`, opacity: 0.85, offset: 0.55 },
      { transform: `scale(${scale})`, opacity: 0 }
    ], { duration: reducedMotion.matches ? 400 : 1100, easing: 'ease-out' }), glow);
    theme.update({ mode: 'parchment' });
    toast('Lumos!', t('eggLumos'));
  }

  function nox() {
    const shade = el('div', {
      position: 'absolute', inset: '0',
      background: `radial-gradient(circle at ${pointer.x}px ${pointer.y}px, rgba(0,0,0,0) 0, rgba(0,0,0,.92) 220px)`
    });
    done(shade.animate([
      { opacity: 0 }, { opacity: 1, offset: 0.45 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }
    ], { duration: reducedMotion.matches ? 500 : 1400, easing: 'ease-in-out' }), shade);
    setTimeout(() => theme.update({ mode: 'common' }), reducedMotion.matches ? 200 : 600);
    toast('Nox', t('eggNox'));
  }

  // ---------- Карта Мародёров ----------

  const FOOT = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="26" viewBox="0 0 16 26">' +
    '<path d="M8 25c-3.6 0-5-3-4.6-7 .4-3.6.2-6.2-1-9C1.3 6.2 3 3 6.4 3c3.8 0 5.6 3 5.4 7-.2 3 .9 5.2 1.6 8 .9 3.8-1.4 7-5.4 7z" fill="#4a2e14"/>' +
    '<circle cx="4" cy="1.6" r="1.4" fill="#4a2e14"/><circle cx="7.4" cy="1" r="1.3" fill="#4a2e14"/><circle cx="10.6" cy="1.6" r="1.2" fill="#4a2e14"/></svg>';

  function marauders() {
    if (theme.snapshot().paused) theme.setPaused(false);

    // Чернильная надпись на пергаменте
    const card = el('div', {
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
      padding: '22px 30px', borderRadius: '6px', textAlign: 'center', boxSizing: 'border-box',
      maxWidth: 'min(560px, calc(100vw - 32px))',
      background: 'radial-gradient(circle at 30% 20%, #f7ecd0, #e9d6a9)', color: '#4a2e14',
      boxShadow: '0 14px 50px rgba(60,35,10,.35), inset 0 0 40px rgba(120,80,30,.25)',
      fontFamily: '"HP Literata", Georgia, serif', fontStyle: 'italic', fontSize: '16px', lineHeight: '1.6'
    });
    const lines = [t('eggMap1'), t('eggMap2')];
    for (const line of lines) el('div', null, card).textContent = line;
    const big = el('div', {
      fontFamily: '"HP Forum", Georgia, serif', fontStyle: 'normal', fontSize: '30px', lineHeight: '1.25', marginTop: '6px'
    }, card);
    big.textContent = t('eggMapTitle');
    done(card.animate([
      { opacity: 0, filter: 'blur(6px)' },
      { opacity: 1, filter: 'blur(0)', offset: 0.18 },
      { opacity: 1, filter: 'blur(0)', offset: 0.8 },
      { opacity: 0, filter: 'blur(4px)' }
    ], { duration: 5200, easing: 'ease-in-out' }), card);

    if (reducedMotion.matches) return;

    // Следы: кривая Безье от одного края экрана к другому
    const w = innerWidth;
    const h = innerHeight;
    const fromLeft = Math.random() < 0.5;
    const p0 = { x: fromLeft ? -20 : w + 20, y: rand(h * 0.55, h * 0.95) };
    const p1 = { x: rand(w * 0.2, w * 0.8), y: rand(0, h) };
    const p2 = { x: fromLeft ? w + 20 : -20, y: rand(h * 0.05, h * 0.45) };
    const steps = Math.max(14, Math.round(w / 70));
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      const x = (1 - s) ** 2 * p0.x + 2 * (1 - s) * s * p1.x + s * s * p2.x;
      const y = (1 - s) ** 2 * p0.y + 2 * (1 - s) * s * p1.y + s * s * p2.y;
      const dx = 2 * (1 - s) * (p1.x - p0.x) + 2 * s * (p2.x - p1.x);
      const dy = 2 * (1 - s) * (p1.y - p0.y) + 2 * s * (p2.y - p1.y);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      const side = i % 2 ? 9 : -9;
      const nx = (-dy / Math.hypot(dx, dy)) * side;
      const ny = (dx / Math.hypot(dx, dy)) * side;
      const foot = svg(FOOT, {
        position: 'absolute', left: `${x + nx - 8}px`, top: `${y + ny - 13}px`, width: '16px', height: '26px',
        transform: `rotate(${angle}deg)`, opacity: '0'
      });
      done(foot.animate([
        { opacity: 0 }, { opacity: 0.85, offset: 0.08 }, { opacity: 0.85, offset: 0.55 }, { opacity: 0 }
      ], { duration: 3000, delay: i * 230, easing: 'ease-out', fill: 'both' }), foot);
    }
  }

  function mischiefManaged() {
    toast(t('eggMischiefTitle'), t('eggMischief'), 2400);
    const ink = el('div', {
      position: 'absolute', inset: '0', background: 'radial-gradient(circle, rgba(74,46,20,0) 30%, rgba(74,46,20,.35))'
    });
    done(ink.animate([{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 1200 }), ink);
    setTimeout(() => theme.setPaused(true), 500);
  }

  // ---------- Золотой снитч ----------

  const SNITCH = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="34" viewBox="0 0 64 34">' +
    '<g class="wl"><path d="M26 16C17 3 5 2 1 6c7 1 15 6 24 13z" fill="#fffdf5" stroke="#8a7440" stroke-width="1.1"/>' +
    '<path d="M24 13c-6-5-12-6-17-6M24 15c-5-3-10-4-15-3" stroke="#8a7440" stroke-width=".8" fill="none"/></g>' +
    '<g class="wr"><path d="M38 16C47 3 59 2 63 6c-7 1-15 6-24 13z" fill="#fffdf5" stroke="#8a7440" stroke-width="1.1"/>' +
    '<path d="M40 13c6-5 12-6 17-6M40 15c5-3 10-4 15-3" stroke="#8a7440" stroke-width=".8" fill="none"/></g>' +
    '<defs><radialGradient id="g" cx=".35" cy=".35"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#e8b923"/><stop offset="1" stop-color="#9a6f0c"/></radialGradient></defs>' +
    '<circle cx="32" cy="19" r="9" fill="url(#g)"/><path d="M24 18c5 3 11 3 16 0" stroke="#8a620a" stroke-width=".9" fill="none"/></svg>';

  let snitch = null;

  function accioSnitch() {
    if (snitch) return;
    const p = palette();
    const btn = el('button', {
      position: 'absolute', left: '0', top: '0', width: '64px', height: '34px', padding: '0', margin: '0',
      border: '0', background: 'none', cursor: 'pointer', pointerEvents: 'auto',
      filter: 'drop-shadow(0 0 5px rgba(255,200,60,.9)) drop-shadow(0 1px 2px rgba(0,0,0,.35))'
    });
    btn.type = 'button';
    btn.setAttribute('aria-label', t('eggSnitchLabel'));
    btn.appendChild(HP.crest.svgElement(SNITCH));
    btn.dataset.hpSnitch = '';

    const slow = reducedMotion.matches ? 2.5 : 1;
    const wings = [btn.querySelector('.wl'), btn.querySelector('.wr')];
    if (!reducedMotion.matches) {
      wings[0].style.transformOrigin = '26px 16px';
      wings[1].style.transformOrigin = '38px 16px';
      wings.forEach((w) => w.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(-.6)' }, { transform: 'scaleY(1)' }],
        { duration: 90, iterations: Infinity }));
    }

    let pos = { x: -70, y: rand(40, innerHeight - 80) };
    let current = null;
    let caught = false;
    const deadline = Date.now() + 25000;

    function fly() {
      if (caught) return;
      const leaving = Date.now() > deadline;
      const next = leaving
        ? { x: innerWidth + 90, y: rand(-60, innerHeight / 2) }
        : { x: rand(10, innerWidth - 80), y: rand(10, innerHeight - 50) };
      const dist = Math.hypot(next.x - pos.x, next.y - pos.y);
      // Иногда снитч замирает на месте — шанс его поймать
      const hover = !leaving && Math.random() < 0.3 ? rand(350, 900) : 0;
      current = btn.animate([
        { transform: `translate(${pos.x}px, ${pos.y}px)` },
        { transform: `translate(${next.x}px, ${next.y}px)` }
      ], { duration: Math.max(260, dist * 1.3) * slow, delay: hover, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' });
      pos = next;
      current.onfinish = () => (leaving ? cleanup() : fly());
    }

    function cleanup() {
      btn.remove();
      snitch = null;
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (caught) return;
      caught = true;
      const box = btn.getBoundingClientRect();
      if (current) current.pause();
      sparkle(box.left + box.width / 2, box.top + box.height / 2, p);
      done(btn.animate([{ opacity: 1 }, { opacity: 0, transform: `translate(${box.left}px, ${box.top}px) scale(.3)` }],
        { duration: 400, fill: 'forwards' }), btn);
      snitch = null;
      awardPoints();
    });

    snitch = btn;
    fly();
  }

  function sparkle(x, y, p) {
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const dot = el('div', {
        position: 'absolute', left: `${x - 3}px`, top: `${y - 3}px`, width: '6px', height: '6px', borderRadius: '50%',
        background: i % 2 ? '#ffe27a' : p.accent, boxShadow: '0 0 8px #ffd54a'
      });
      const r = rand(40, 80);
      done(dot.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px) scale(.2)`, opacity: 0 }
      ], { duration: 700, easing: 'ease-out' }), dot);
    }
  }

  function awardPoints() {
    const { settings } = theme.snapshot();
    const house = settings.house;
    const points = { ...HP.DEFAULT_SETTINGS.points, ...(settings.points || {}) };
    points[house] = (points[house] || 0) + SNITCH_POINTS;
    theme.update({ points, snitches: (settings.snitches || 0) + 1 });
    toast(t('eggSnitchTitle', [String(SNITCH_POINTS), houseName(house)]), t('eggSnitch'));
  }

  // ---------- День рождения Гарри ----------

  async function birthday() {
    const now = new Date();
    if (now.getMonth() !== 6 || now.getDate() !== 31) return;
    try {
      const year = String(now.getFullYear());
      const { birthdayShown } = await ext.storage.local.get('birthdayShown');
      if (birthdayShown === year) return;
      await ext.storage.local.set({ birthdayShown: year });
    } catch (e) {
      return;
    }
    toast(t('eggBirthdayTitle'), t('eggBirthday'), 6000);
  }

  // ---------- Клавиатура ----------

  const book = HP.spells.createSpellbook();

  function isEditable(target) {
    if (!target || target.nodeType !== 1) return false;
    if (target.isContentEditable) return true;
    const tag = target.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (tag === 'INPUT') return !/^(button|checkbox|radio|range|color|submit|reset|file|image)$/i.test(target.type);
    return target.getAttribute('role') === 'textbox';
  }

  const ACTIONS = { lumos, nox, solemnlySwear: marauders, mischiefManaged, accioSnitch };

  addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    const target = (e.composedPath && e.composedPath()[0]) || e.target;
    if (isEditable(target)) return;

    const spell = book.push(e.key);
    if (!spell) return;

    const { settings, paused } = theme.snapshot();
    const allowedHere = settings.enabled && !(settings.disabledHosts || []).includes(location.hostname);
    if (!allowedHere) return;
    if (paused && spell !== 'solemnlySwear') return;
    ACTIONS[spell]();
  }, true);

  HP.eggs = { lumos, nox, marauders, mischiefManaged, accioSnitch, toast };
  birthday();
})();
