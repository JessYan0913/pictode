import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class AddObjectCmd extends BaseCmd<Cmd.AddObjectOptions> {
  constructor(app: App, options: Cmd.AddObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    this.app.add(...this.options.object);
  }

  public undo(): void {
    // this.app.mainLayer.find((obj) => {})?.destroy();
    this.app.render();
  }
}

export default AddObjectCmd;
