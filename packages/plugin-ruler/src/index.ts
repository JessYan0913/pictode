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
    this.ruler = new Ruler(this.app, 'x', '#fff', 40);
    this.app.on('canvas:resized', this.onUpdate);
    this.app.on('canvas:drag:move', this.onUpdate);
    this.app.on('canvas:zoom:end', this.onUpdate);
    this.app.emit('ruler:installed', { ruler: this });
  }

  public destroy(): void {
    this.app?.off('canvas:resized', this.onUpdate);
    this.app?.off('canvas:drag:move', this.onUpdate);
    this.app?.off('canvas:zoom:end', this.onUpdate);
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

  private onUpdate = () => {
    this.ruler?.update();
  };
}

export default RulerPlugin;
