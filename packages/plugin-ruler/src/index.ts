import { App, Plugin } from '@pictode/core';

import { Options } from './types';

const DEFAULT_OPTIONS: Options = {
  enabled: true,
  stackSize: 100,
};

export class RulerPlugin implements Plugin {
  public name: string = 'rulerPlugin';
  public app?: App;
  public options: Options;

  constructor(options?: Partial<Options>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

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

export default RulerPlugin;
