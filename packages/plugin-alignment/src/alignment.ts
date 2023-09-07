import { App } from '@pictode/core';

import { Options } from './types';

export class Alignment {
  public app: App;
  public options?: Options;

  constructor(app: App, options?: Options) {
    this.app = app;
    this.options = options;
  }

  public destroy(): void {}
}

export default Alignment;
