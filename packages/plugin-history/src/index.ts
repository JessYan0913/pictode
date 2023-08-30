import { App, EventArgs, KonvaNode, Plugin } from '@pictode/core';

import './methods';

import { AddObjectCmd, ModifiedObjectCmd, MoveZIndexObjectCmd, RemoveObjectCmd } from './commands';
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
    this.app.on('node:update:before', this.onNodeUpdateBefore);
    this.app.on('node:zindex:changed', this.onNodeZIndexChanged);
    this.app.on('node:updated', this.onNodeUpdated);
  }

  public destroy(): void {
    this.history?.destroy();
    this.app?.off('node:added', this.onNodeAdded);
    this.app?.off('node:removed', this.onNodeRemove);
    this.app?.off('node:update:before', this.onNodeUpdateBefore);
    this.app?.off('node:updated', this.onNodeUpdated);
    this.app?.emit('history:destroy', {
      history: this,
    });
  }

  public enable(): void {
    if (!this.history) {
      return;
    }
    this.history.enable = true;
  }

  public disable(): void {
    if (!this.history) {
      return;
    }
    this.history.enable = false;
  }

  public isEnabled(): boolean {
    return this.history?.enable ?? false;
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

  private onNodeUpdateBefore = ({ nodes }: EventArgs['node:transform:start']) => {
    this.oldNodes = nodes.map((node) => node.toObject());
  };

  private onNodeUpdated = ({ nodes }: EventArgs['node:transform:end']) => {
    if (!this.app || !this.history) {
      return;
    }
    this.history.execute(
      new ModifiedObjectCmd(this.app, {
        oldNodes: this.oldNodes,
        newNodes: nodes.map((node) => node.toObject()),
      })
    );
  };

  private onNodeZIndexChanged = ({ nodes }: EventArgs['node:zindex:changed']) => {
    if (!this.app || !this.history) {
      return;
    }
    this.history.execute(new MoveZIndexObjectCmd(this.app, { nodes }));
  };
}

export default HistoryPlugin;
