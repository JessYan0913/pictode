import { App, Plugin } from '@pictode/core';

import { Ruler } from './ruler';
import { Options } from './types';

const DEFAULT_OPTIONS: Options = {
  enabled: true,
};

export class RulerPlugin implements Plugin {
  public name: string = 'rulerPlugin';
  public app?: App;
  public options: Options;
  public ruler?: Ruler;

  constructor(options?: Partial<Options>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public install(app: App) {
    this.app = app;
    this.ruler = new Ruler(this.app, 'x', 50, '#fff', 40);
    this.app.emit('ruler:installed', { ruler: this });
  }

  public destroy(): void {
    this.ruler?.destroy();
    this.app?.emit('ruler:destroy', { ruler: this });
  }

  public enable(): void {
    if (!this.ruler) {
      return;
    }
  }

  public disable(): void {
    if (!this.ruler) {
      return;
    }
  }

  public isEnabled(): boolean {
    return false;
  }
}

export default RulerPlugin;
