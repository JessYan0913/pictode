import { KonvaNode } from '@pictode/core';

import { AlignmentPlugin } from './index';

declare module '@pictode/core' {
  export interface App {
    aligned(nodes: KonvaNode[]): void;
    distributeEvenly(nodes: KonvaNode[]): void;
  }

  export interface EventArgs {
    'alignment:installed': {
      alignment: AlignmentPlugin;
    };
    'alignment:destroy': {
      alignment: AlignmentPlugin;
    };
  }
}

export interface Options {
  enable?: boolean;
  multipleSelect?: boolean;
}
