import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class ModifiedObjectCmd extends BaseCmd<Cmd.ModifiedObjectOptions> {
  constructor(app: App, options: Cmd.ModifiedObjectOptions) {
    super(app, options);
  }

  public execute(): void {}

  public undo(): void {}
}

export default ModifiedObjectCmd;
