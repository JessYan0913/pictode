import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class MakeGroupCmd extends BaseCmd<Cmd.MakeGroupOptions> {
  constructor(app: App, options: Cmd.MakeGroupOptions) {
    super(app, options);
  }

  public execute(): void {
    const group = this.app._makeGroup(this.options.nodes);
    this.options.group = group;
  }

  public undo(): void {
    this.app._decomposeGroup(this.options.group);
  }
}

export default MakeGroupCmd;
