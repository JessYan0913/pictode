import { App, Konva } from '@pictode/core';

import { Cmd } from '../types';

import { BaseCmd } from './base';

export class RemoveObjectCmd extends BaseCmd<Cmd.RemoveObjectOptions> {
  constructor(app: App, options: Cmd.RemoveObjectOptions) {
    super(app, options);
  }

  public execute(): void {
    this.app._remove(...this.options.nodes.map((node) => Konva.Node.create(node)));
  }

  public undo(): void {
    this.app._add(...this.options.nodes.map((node) => Konva.Node.create(node)));
  }
}

export default RemoveObjectCmd;
