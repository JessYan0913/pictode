import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class RemoveObjectCmd extends BaseCmd<Cmd.RemoveObjectOptions> {
  constructor(app: App, options: Cmd.RemoveObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    if (!this.app || !this.options?.object) {
      return;
    }
    this.app.canvas.remove(this.options.object);
  }

  public undo(): void {
    if (!this.app || !this.options?.object) {
      return;
    }
    this.app.canvas.add(this.options.object);
  }
}

export default RemoveObjectCmd;
