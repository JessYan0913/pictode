import { App, Plugin } from '@pictode/core';

import './methods';

import Alignment from './alignment';
import { Options } from './types';

export class AlignmentPlugin implements Plugin {
  public name: string = 'alignmentPlugin';
  public alignment?: Alignment;
  public app?: App;
  public options?: Options;

  constructor(options?: Options) {
    this.options = options;
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
  }

  public disable(): void {
    if (!this.alignment) {
      return;
    }
  }

  public isEnabled(): boolean {
    return false;
  }
}

export default AlignmentPlugin;
