// Сборка плагина:
//   main.js               — код плагина (esbuild, CommonJS, obsidian — внешний модуль);
//   styles.css            — шрифты (base64) + цвета факультетов из src/houses.ts + src/styles/theme.css;
//   docs/mockups/tokens.js — токены для макетов.
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateHouseCss } from '../src/css.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const watch = args.has('--watch');

async function buildTokens() {
  mkdirSync(join(root, 'docs/mockups'), { recursive: true });
  await esbuild.build({
    entryPoints: [join(root, 'src/houses.ts')],
    bundle: true,
    format: 'iife',
    globalName: 'HP_TOKENS',
    outfile: join(root, 'docs/mockups/tokens.js'),
    banner: { js: '// Сгенерировано scripts/build.mjs из src/houses.ts — не редактировать вручную.' },
    logLevel: 'warning'
  });
}

const FONTS = [
  ['HP Literata', 'literata', 400, 'normal'],
  ['HP Literata', 'literata', 400, 'italic'],
  ['HP Literata', 'literata', 700, 'normal'],
  ['HP Forum', 'forum', 400, 'normal']
];
const SUBSETS = {
  latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  cyrillic: 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116'
};

function fontFaces() {
  const out = [];
  for (const [family, file, weight, style] of FONTS) {
    for (const [subset, range] of Object.entries(SUBSETS)) {
      const data = readFileSync(join(root, 'fonts', `${file}-${subset}-${weight}-${style}.woff2`)).toString('base64');
      out.push(`@font-face {\n  font-family: '${family}';\n  font-style: ${style};\n  font-weight: ${weight};\n  font-display: swap;\n` +
        `  src: url(data:font/woff2;base64,${data}) format('woff2');\n  unicode-range: ${range};\n}`);
    }
  }
  return out.join('\n');
}

export function buildStyles() {
  const css = [
    '/* HP Theme для Obsidian. Сгенерировано scripts/build.mjs — правьте src/styles/theme.css и src/houses.ts. */',
    '/* Шрифты Literata и Forum — SIL Open Font License 1.1 (см. fonts/). */',
    fontFaces(),
    '/* ---------- Цвета факультетов (src/houses.ts) ---------- */',
    generateHouseCss(),
    readFileSync(join(root, 'src/styles/theme.css'), 'utf8')
  ].join('\n\n');
  writeFileSync(join(root, 'styles.css'), css);
}

const mainOptions = {
  entryPoints: [join(root, 'src/main.ts')],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2020',
  external: ['obsidian', 'electron', '@codemirror/*', '@lezer/*'],
  // Кириллица в строках как есть, а не \uXXXX: main.js вдвое меньше
  charset: 'utf8',
  outfile: join(root, 'main.js'),
  banner: { js: '/* HP Theme для Obsidian. Сгенерировано из src/ — см. репозиторий. */' },
  logLevel: 'info'
};

await buildTokens();
if (args.has('--mockups-only')) process.exit(0);

buildStyles();
if (watch) {
  const ctx = await esbuild.context(mainOptions);
  await ctx.watch();
} else {
  await esbuild.build(mainOptions);
}

// Тестовый стенд: тот же src/main.ts, но с заглушкой вместо модуля obsidian.
if (args.has('--harness') || process.env.HP_HARNESS) {
  await esbuild.build({
    entryPoints: [join(root, 'harness/entry.ts')],
    bundle: true,
    format: 'iife',
    target: 'es2020',
    alias: { obsidian: join(root, 'harness/obsidian-shim.ts') },
    outfile: join(root, 'harness/harness.js'),
    logLevel: 'warning'
  });
}
