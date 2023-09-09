import { KonvaNode } from '@pictode/core';

import { AlignmentPlugin } from './index';

declare module '@pictode/core' {
  export interface App {
    alignLeft(nodes: KonvaNode[]): void;
    alignRight(nodes: KonvaNode[]): void;
    alignTop(nodes: KonvaNode[]): void;
    alignBottom(nodes: KonvaNode[]): void;
    alignCenterX(nodes: KonvaNode[]): void;
    alignCenterY(nodes: KonvaNode[]): void;
    dispersionX(nodes: KonvaNode[]): void;
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
}
