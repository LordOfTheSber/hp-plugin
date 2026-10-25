// Сборка: main.js (плагин), styles.css (тема + шрифты), docs/mockups/tokens.js (токены для макетов).
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));

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

await buildTokens();
if (args.has('--mockups-only')) process.exit(0);
