import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class MakeGroupCmd extends BaseCmd<Cmd.MakeGroupOptions> {
  constructor(app: App, options: Cmd.MakeGroupOptions) {
    super(app, options);
  }

  public execute(): void {
    this.app._makeGroup(this.options.nodes);
  }

  public undo(): void {
    this.app._decomposeGroup(this.options.group);
  }
}

export default MakeGroupCmd;
