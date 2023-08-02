import { App, EventArgs, KonvaNode, Plugin } from '@pictode/core';

import './methods';

import { AddObjectCmd, ModifiedObjectCmd, RemoveObjectCmd } from './commands';
import { History } from './history';
import { Options } from './types';

export class HistoryPlugin implements Plugin {
  public name: string = 'historyPlugin';
  public history?: History;
  public app?: App;
  public options?: Options;

  private oldNodes: KonvaNode[] = [];

  constructor(options?: Options) {
    this.options = options;
  }

  public install(app: App) {
    this.app = app;
    this.history = new History(app, this.options);
    this.history.app = app;
    this.app.on('node:added', this.onNodeAdded);
    this.app.on('node:removed', this.onNodeRemove);
    this.app.on('node:transform:start', this.onNodeTransformStart);
    this.app.on('node:transform:end', this.onNodeTransformEnd);
  }

  public dispose(): void {
    this.history?.dispose();
    this.app?.off('node:added', this.onNodeAdded);
    this.app?.off('node:removed', this.onNodeRemove);
    this.app?.off('node:transform:start', this.onNodeTransformStart);
    this.app?.off('node:transform:end', this.onNodeTransformEnd);
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

  private onNodeAdded = ({ nodes }: EventArgs['node:added']) => {
    if (!this.app || !this.history) {
      return;
    }
    this.history.execute(new AddObjectCmd(this.app, { nodes }));
  };

  private onNodeRemove = ({ nodes }: EventArgs['node:removed']) => {
    if (!this.app || !this.history) {
      return;
    }
    this.history.execute(new RemoveObjectCmd(this.app, { nodes }));
  };

  private onNodeTransformStart = ({ nodes }: EventArgs['node:transform:start']) => {
    this.oldNodes = nodes;
  };

  private onNodeTransformEnd = ({ nodes }: EventArgs['node:transform:end']) => {
    if (!this.app || !this.history) {
      return;
    }
    this.history.execute(new ModifiedObjectCmd(this.app, { oldNodes: this.oldNodes, newNodes: nodes }));
  };
}

export default HistoryPlugin;
