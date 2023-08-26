import { KonvaMouseEvent, KonvaNode } from '@pictode/core';

import { SelectorPlugin } from './index';

declare module '@pictode/core' {
  export interface App {
    get selected(): KonvaNode[];
    select(...nodes: KonvaNode[]): void;
    cancelSelect(...nodes: KonvaNode[]): void;
    selectByEvent(event: KonvaMouseEvent): void;
  }

  export interface EventArgs {
    'selector:installed': {
      selector: SelectorPlugin;
    };
    'selector:destroy': {
      selector: SelectorPlugin;
    };
    'selected:changed': {
      selected: KonvaNode[];
    };
  }
}

export interface Options {
  enable?: boolean;
  multipleSelect?: boolean;
}
