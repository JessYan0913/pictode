import { App, EventArgs, Plugin } from '@pictode/core';

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
    this.app.on('canvas:resized', this.onCanvasResized);
    this.app.emit('ruler:installed', { ruler: this });
  }

  public destroy(): void {
    this.app?.off('canvas:resized', this.onCanvasResized);
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

  private onCanvasResized = ({ width, height }: EventArgs['canvas:resized']) => {
    this.ruler?.updateSize(width, height);
  };
}

export default RulerPlugin;
