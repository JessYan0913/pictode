import { KonvaNode } from '@pictode/core';

import { AlignmentPlugin } from './index';

declare module '@pictode/core' {
  export interface App {
    alignLeft(nodes: KonvaNode[]): App;
    alignRight(nodes: KonvaNode[]): App;
    alignTop(nodes: KonvaNode[]): App;
    alignBottom(nodes: KonvaNode[]): App;
    alignCenterX(nodes: KonvaNode[]): App;
    alignCenterY(nodes: KonvaNode[]): App;
    dispersionX(nodes: KonvaNode[]): App;
    dispersionY(nodes: KonvaNode[]): App;
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
  enabled: boolean;
}
