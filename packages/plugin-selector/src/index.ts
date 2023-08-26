import { App, Plugin } from '@pictode/core';

import './methods';

import Selector from './selector';
import { Options } from './types';

export class SelectorPlugin implements Plugin {
  public name: string = 'selectorPlugin';
  public selector?: Selector;
  public app?: App;
  public options?: Options;

  constructor(options?: Options) {
    this.options = options;
  }

  public install(app: App) {
    this.app = app;
    this.selector = new Selector(app, this.options);
    this.app.on('canvas:cleared', this.onCanvasCleared);
    this.app.emit('selector:installed', { selector: this });
  }

  public destroy(): void {
    this.selector?.destroy();
    this.app?.off('canvas:cleared', this.onCanvasCleared);
    this.app?.emit('selector:destroy', { selector: this });
  }

  public enable(): void {
    if (!this.selector) {
      return;
    }
    this.selector.triggerSelector(true);
  }

  public disable(): void {
    if (!this.selector) {
      return;
    }
    this.selector.cancelSelect();
    this.selector.triggerSelector(false);
  }

  public isEnabled(): boolean {
    return this.selector?.enable ?? false;
  }

  private onCanvasCleared = (): void => {
    this.selector?.cancelSelect();
  };
}

export default SelectorPlugin;
