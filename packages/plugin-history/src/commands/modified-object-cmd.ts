import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class ModifiedObjectCmd extends BaseCmd<Cmd.ModifiedObjectOptions> {
  constructor(app: App, options: Cmd.ModifiedObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    if (!this.app || !this.options?.newObject) {
      return;
    }
  }

  public undo(): void {
    throw new Error('Method not implemented.');
  }
}

export default ModifiedObjectCmd;
