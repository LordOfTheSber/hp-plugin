/*
 * Герб факультета (SVG-строка): щит в основном цвете, перевязь и кайма в цвете металла, инициал.
 * Используется в попапе и при генерации иконок.
 */
(function (root) {
  const CRESTS = {
    gryffindor: { field: '#7f0909', metal: '#d3a625', letter: 'G', ink: '#fff4d6' },
    slytherin: { field: '#1a472a', metal: '#aab3b5', letter: 'S', ink: '#eef3ef' },
    ravenclaw: { field: '#0e1a40', metal: '#946b2d', letter: 'R', ink: '#f1e3c8' },
    hufflepuff: { field: '#372e29', metal: '#ecb939', letter: 'H', ink: '#ecb939' }
  };

  const SHIELD = 'M50 4L92 16V52C92 78 72 94 50 100C28 94 8 78 8 52V16Z';

  function crestSvg(id, size = 40) {
    const c = CRESTS[id];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.04)}" viewBox="0 0 100 104" aria-hidden="true">` +
      `<defs><clipPath id="clip-${id}"><path d="${SHIELD}"/></clipPath></defs>` +
      `<path d="${SHIELD}" fill="${c.field}"/>` +
      `<path d="M8 22L92 92" stroke="${c.metal}" stroke-width="12" opacity=".45" clip-path="url(#clip-${id})"/>` +
      `<path d="${SHIELD}" fill="none" stroke="${c.metal}" stroke-width="6"/>` +
      `<text x="50" y="67" text-anchor="middle" font-family="'HP Forum', Georgia, serif" font-size="48" fill="${c.ink}">${c.letter}</text>` +
      '</svg>';
  }

  // Общий значок расширения: щит, разделённый на четыре поля факультетов.
  function hogwartsSvg(size = 128) {
    const q = ['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff'].map((id) => CRESTS[id]);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 104 104">` +
      `<defs><clipPath id="s"><path transform="translate(2 0)" d="${SHIELD}"/></clipPath></defs>` +
      `<g clip-path="url(#s)"><rect x="0" y="0" width="52" height="52" fill="${q[0].field}"/>` +
      `<rect x="52" y="0" width="52" height="52" fill="${q[1].field}"/>` +
      `<rect x="0" y="52" width="52" height="52" fill="${q[2].field}"/>` +
      `<rect x="52" y="52" width="52" height="52" fill="${q[3].metal}"/></g>` +
      `<path transform="translate(2 0)" d="${SHIELD}" fill="none" stroke="#d3a625" stroke-width="7"/>` +
      '<path d="M52 4V100M10 52H94" stroke="#d3a625" stroke-width="5"/>' +
      '</svg>';
  }

  // SVG-строка -> DOM-узел без innerHTML (браузерная часть: попап и пасхалки).
  function svgElement(markup) {
    const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
    return document.importNode(doc.documentElement, true);
  }

  const api = { CRESTS, crestSvg, hogwartsSvg, svgElement };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HP = Object.assign(root.HP || {}, { crest: api });
})(typeof globalThis !== 'undefined' ? globalThis : this);
