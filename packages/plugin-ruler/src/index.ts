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
    this.ruler = new Ruler(this.app.stage, this.app.mainLayer, this.app.stage.width(), this.app.stage.height(), 'y');
    this.app.add(this.ruler.rulerShape);
    this.ruler.update();
    this.app.on('canvas:resized', () => {
      setTimeout(() => {
        this.ruler?.update();
      }, 1000);
    });
  }

  public destroy(): void {
    this.ruler = undefined;
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
