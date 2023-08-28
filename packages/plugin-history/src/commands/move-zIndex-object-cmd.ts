import { App } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class MoveZIndexObjectCmd extends BaseCmd<Cmd.MoveZIndexObjectOptions> {
  constructor(app: App, options: Cmd.MoveZIndexObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    this.options.nodes.forEach(({ node, newZIndex }) => {
      node.setZIndex(newZIndex);
    });
  }

  public undo(): void {
    this.options.nodes.forEach(({ node, oldZIndex }) => {
      node.setZIndex(oldZIndex);
    });
  }
}

export default MoveZIndexObjectCmd;
