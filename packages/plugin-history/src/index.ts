import { App, BaseFabricObject, Plugin } from '@pictode/core';

import './methods';

import { BaseCmd } from './commands/base';
import { AddObjectCmd } from './commands';
import { History } from './history';
import { Cmd, Options } from './types';

export type CommandClass<T extends BaseCmd = BaseCmd, O extends Cmd.Options = Cmd.Options> = new (
  app?: App,
  options?: O
) => T;

export class HistoryPlugin implements Plugin {
  public name: string = 'historyPlugin';
  public history: History;
  public app?: App;

  constructor(options?: Options) {
    this.history = new History(undefined, options);
  }

  public install(app: App) {
    this.app = app;
    this.history.app = app;
    this.app.canvas.on('object:added', ({ target }: { target: BaseFabricObject }) => {
      if (this.app) {
        this.history.execute(new AddObjectCmd(this.app, { object: target }));
      }
    });
  }

  public dispose(): void {
    this.history.dispose();
    this.app?.emit('history:destroy', {
      history: this,
    });
  }

  public enable(): void {
    this.history.enabled = true;
  }

  public disable(): void {
    this.history.enabled = false;
  }

  public isEnabled(): boolean {
    return this.history.enabled;
  }
}

export default HistoryPlugin;
