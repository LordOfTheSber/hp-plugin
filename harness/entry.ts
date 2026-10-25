// Точка входа стенда: создаёт «приложение», загружает плагин и даёт тестам ручки управления.
import HpThemePlugin from '../src/main.ts';
import { createApp } from './obsidian-shim.ts';

const app = createApp();
const plugin = new HpThemePlugin(app as never, { id: 'hp-theme', name: 'HP Theme', version: '1.0.0' } as never);

(window as any).harness = {
  plugin,
  app,
  ready: plugin.onload(),
  runCommand(id: string) { (plugin as any).commands[id].callback(); },
  openSettings() {
    const host = document.querySelector('.hp-harness-settings') as HTMLElement;
    const tab = (plugin as any).settingTab;
    host.replaceChildren(tab.containerEl);
    tab.display();
    host.parentElement!.style.display = '';
  },
  closeSettings() { (document.querySelector('.hp-harness-settings') as HTMLElement).parentElement!.style.display = 'none'; }
};
