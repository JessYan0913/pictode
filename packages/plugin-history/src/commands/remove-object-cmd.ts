import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class RemoveObjectCmd extends BaseCmd<Cmd.RemoveObjectOptions> {
  constructor(app: App, options: Cmd.RemoveObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    this.app._remove(...this.options.nodes);
  }

  public undo(): void {
    this.app._add(...this.options.nodes);
  }
}

export default RemoveObjectCmd;
