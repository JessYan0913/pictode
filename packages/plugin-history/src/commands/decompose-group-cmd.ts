import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class DecomposeGroupCmd extends BaseCmd<Cmd.DecomposeGroupOptions> {
  constructor(app: App, options: Cmd.DecomposeGroupOptions) {
    super(app, options);
  }

  public execute(): void {
    this.app._decomposeGroup(this.options.group);
  }

  public undo(): void {
    this.app._makeGroup(this.options.nodes);
  }
}

export default DecomposeGroupCmd;
