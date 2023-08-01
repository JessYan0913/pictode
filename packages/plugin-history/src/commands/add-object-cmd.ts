import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class AddObjectCmd extends BaseCmd<Cmd.AddObjectOptions> {
  constructor(app: App, options: Cmd.AddObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    this.app._add(...this.options.object);
  }

  public undo(): void {
    this.app._remove(...this.options.object);
  }
}

export default AddObjectCmd;
