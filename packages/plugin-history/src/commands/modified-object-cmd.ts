import { App, Konva } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class ModifiedObjectCmd extends BaseCmd<Cmd.ModifiedObjectOptions> {
  constructor(app: App, options: Cmd.ModifiedObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    this.app._update(...this.options.newNodes.map((node) => Konva.Node.create(node)));
  }

  public undo(): void {
    this.app._update(...this.options.oldNodes.map((node) => Konva.Node.create(node)));
  }
}

export default ModifiedObjectCmd;
