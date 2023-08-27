import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class MoveZIndexObjectCmd extends BaseCmd<Cmd.MoveZIndexObjectOptions> {
  constructor(app: App, options: Cmd.MoveZIndexObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    this.options.newNodes.forEach(({ node, zIndex }) => {
      node.zIndex(zIndex);
    });
  }

  public undo(): void {
    this.options.oldNodes.forEach(({ node, zIndex }) => {
      node.zIndex(zIndex);
    });
  }
}

export default MoveZIndexObjectCmd;
