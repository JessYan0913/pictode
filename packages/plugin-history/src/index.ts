import { App, BaseFabricObject, Plugin } from '@pictode/core';

import './methods';

import { AddObjectCmd, RemoveObjectCmd } from './commands';
import { History } from './history';
import { Options } from './types';

export class HistoryPlugin implements Plugin {
  public name: string = 'historyPlugin';
  public history?: History;
  public app?: App;
  public options?: Options;

  constructor(options?: Options) {
    this.options = options;
    (['onObjectAdded', 'onObjectRemove'] as (keyof this)[]).forEach((method) => {
      method = method as keyof HistoryPlugin;
      this[method] = (this[method] as Function).bind(this);
    });
  }

  public install(app: App) {
    this.app = app;
    this.history = new History(app, this.options);
    this.history.app = app;
    this.app.canvas.on('object:added', this.onObjectAdded);
    this.app.canvas.on('object:removed', this.onObjectRemove);
  }

  public dispose(): void {
    this.history?.dispose();
    this.app?.canvas.off('object:added', this.onObjectAdded);
    this.app?.canvas.off('object:added', this.onObjectRemove);
    this.app?.emit('history:destroy', {
      history: this,
    });
  }

  public enable(): void {
    if (!this.history) {
      return;
    }
    this.history.enabled = true;
  }

  public disable(): void {
    if (!this.history) {
      return;
    }
    this.history.enabled = false;
  }

  public isEnabled(): boolean {
    return this.history?.enabled ?? false;
  }

  private onObjectAdded({ target }: { target: BaseFabricObject }) {
    if (!this.app || !this.history) {
      return;
    }
    this.history.execute(new AddObjectCmd(this.app, { object: target.toJSON() }));
  }

  private onObjectRemove({ target }: { target: BaseFabricObject }) {
    if (!this.app || !this.history) {
      return;
    }
    this.history.execute(new RemoveObjectCmd(this.app, { object: target.toJSON() }));
  }
}

export default HistoryPlugin;
