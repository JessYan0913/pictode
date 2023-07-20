import { App } from '@pictode/core';

import { Cmd, Command } from '../types';

export abstract class BaseCmd<T extends Cmd.Options = Cmd.Options> implements Command<T> {
  public app?: App;
  public name: string;
  public id: number = 0;
  public executed: boolean = false;
  public options?: T;
  public executeTime: number = new Date().getTime();

  constructor(app?: App, options?: T) {
    this.app = app;
    this.name = this.constructor.name;
    this.options = options;
  }

  public abstract execute(): void;

  public abstract undo(): void;

  public toJSON(): Command<T> {
    return {
      id: this.id,
      name: this.name,
      options: this.options,
      executed: this.executed,
      executeTime: this.executeTime,
    };
  }

  public fromJSON(json: Command<T>): void {
    this.id = json.id;
    this.name = json.name;
    this.options = json.options;
    this.executed = json.executed;
    this.executeTime = json.executeTime;
  }
}
