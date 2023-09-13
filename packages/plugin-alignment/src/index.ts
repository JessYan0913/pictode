import { App, Plugin } from '@pictode/core';

import './methods';

import Alignment from './alignment';
import { Options } from './types';

const DEFAULT_OPTIONS: Options = {
  enabled: true,
};

export class AlignmentPlugin implements Plugin {
  public name: string = 'alignmentPlugin';
  public alignment?: Alignment;
  public app?: App;
  public options: Options;

  constructor(options?: Partial<Options>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public install(app: App) {
    this.app = app;
    this.alignment = new Alignment(app, this.options);
    this.app.emit('alignment:installed', { alignment: this });
  }

  public destroy(): void {
    this.app?.emit('alignment:destroy', { alignment: this });
  }

  public enable(): void {
    if (!this.alignment) {
      return;
    }
    this.options.enabled = true;
    this.alignment.enabled = true;
  }

  public disable(): void {
    if (!this.alignment) {
      return;
    }
    this.options.enabled = false;
    this.alignment.enabled = false;
  }

  public isEnabled(): boolean {
    return this.options.enabled;
  }
}

export default AlignmentPlugin;
