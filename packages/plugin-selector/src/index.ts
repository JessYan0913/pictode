import { App, Plugin } from '@pictode/core';

import './methods';

import Selector from './selector';
import { Options } from './types';

const DEFAULT_OPTIONS: Options = {
  enable: true,
  multipleSelect: true,
  transformer: {
    padding: 6,
    ignoreStroke: true,
    borderStroke: 'rgb(157, 157, 231)',
    borderStrokeWidth: 1,
    borderDash: [3, 3],
    anchorSize: 8,
    anchorStroke: 'rgb(157, 157, 231)',
    anchorCornerRadius: 3,
    anchorStrokeWidth: 1,
    rotateAnchorOffset: 20,
  },
  hightLight: {
    padding: 3,
    stroke: 'rgb(157, 157, 231)',
    strokeWidth: 1,
  },
};

export class SelectorPlugin implements Plugin {
  public name: string = 'selectorPlugin';
  public selector?: Selector;
  public app?: App;
  public options: Options;

  constructor(options?: Partial<Options>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
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
