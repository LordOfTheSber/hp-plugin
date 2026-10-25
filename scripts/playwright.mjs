// Находит Playwright: локальную зависимость, NODE_PATH или глобальную установку.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

export async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    // нет локальной зависимости — ищем дальше
  }
  const require = createRequire(import.meta.url);
  const roots = (process.env.NODE_PATH || '').split(':').filter(Boolean);
  try {
    roots.push(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim());
  } catch {
    // npm недоступен
  }
  for (const root of roots) {
    try {
      return require(require.resolve('playwright', { paths: [root] }));
    } catch {
      // пробуем следующий путь
    }
  }
  return null;
}
