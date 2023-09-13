import { Konva, KonvaMouseEvent, KonvaNode } from '@pictode/core';

import { SelectorPlugin } from './index';

declare module '@pictode/core' {
  export interface App {
    select(...nodes: KonvaNode[]): App;
    cancelSelect(...nodes: KonvaNode[]): App;
    selectByEvent(event: KonvaMouseEvent): App;
    selectAll(): App;
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
  enable: boolean;
  multipleSelect: boolean;
  transformer: Pick<
    Konva.TransformerConfig,
    | 'padding'
    | 'ignoreStroke'
    | 'borderStroke'
    | 'borderStrokeWidth'
    | 'borderDash'
    | 'anchorSize'
    | 'anchorStroke'
    | 'anchorCornerRadius'
    | 'anchorStrokeWidth'
    | 'rotateAnchorOffset'
  >;
}
