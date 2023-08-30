import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class ModifiedObjectCmd extends BaseCmd<Cmd.ModifiedObjectOptions> {
  constructor(app: App, options: Cmd.ModifiedObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    this.app._update(...this.options.newNodes);
  }

  public undo(): void {
    this.app._update(...this.options.oldNodes);
  }
}

export default ModifiedObjectCmd;
