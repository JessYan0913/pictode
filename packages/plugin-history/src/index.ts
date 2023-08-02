import { App, EventArgs, Plugin } from '@pictode/core';

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
  }

  public install(app: App) {
    this.app = app;
    this.history = new History(app, this.options);
    this.history.app = app;
    this.app.on('shape:added', this.onObjectAdded);
    this.app.on('shape:removed', this.onObjectRemove);
  }

  public dispose(): void {
    this.history?.dispose();
    this.app?.off('shape:added', this.onObjectAdded);
    this.app?.off('shape:added', this.onObjectRemove);
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

  private onObjectAdded = ({ object }: EventArgs['shape:added']) => {
    if (!this.app || !this.history) {
      return;
    }
    this.history.execute(new AddObjectCmd(this.app, { object }));
  };

  private onObjectRemove = ({ object }: EventArgs['shape:removed']) => {
    if (!this.app || !this.history) {
      return;
    }
    this.history.execute(new RemoveObjectCmd(this.app, { object }));
  };
}

export default HistoryPlugin;
