import { App, Plugin } from '@pictode/core';

import './methods';

export class ShortcutPlugin implements Plugin {
  public name: string = 'shortcutPlugin';
  public app?: App;

  constructor() {}

  public install(app: App) {
    this.app = app;
  }

  public destroy(): void {}

  public enable(): void {}

  public disable(): void {}

  public isEnabled(): boolean {
    return false;
  }
}

export default ShortcutPlugin;
