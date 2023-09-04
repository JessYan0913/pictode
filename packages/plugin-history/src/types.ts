import { Konva, KonvaNode } from '@pictode/core';

import { HistoryPlugin } from './index';

declare module '@pictode/core' {
  export interface App {
    undo(step?: number): App;
    redo(step?: number): App;
    canUndo(): boolean;
    canRedo(): boolean;
    jump(id: number): App;
  }

  export interface EventArgs {
    'stack:changed': CmdStack;
    'history:installed': {
      history: HistoryPlugin;
    };
    'history:destroy': {
      history: HistoryPlugin;
    };
    'history:undo': {
      command: Command | undefined;
      step: number;
    };
    'history:redo': {
      command: Command | undefined;
      step: number;
    };
  }
}

export namespace Cmd {
  export interface Options {
    [key: string]: any;
  }

  export interface AddObjectOptions {
    nodes: KonvaNode[];
  }

  export interface RemoveObjectOptions {
    nodes: KonvaNode[];
  }

  export interface ModifiedObjectOptions {
    oldNodes: KonvaNode[];
    newNodes: KonvaNode[];
  }

  export interface MoveZIndexObjectOptions {
    nodes: {
      node: KonvaNode;
      oldZIndex: number;
      newZIndex: number;
    }[];
  }

  export interface MakeGroupOptions {
    group: Konva.Group;
    nodes: KonvaNode[];
  }

  export interface DecomposeGroupOptions {
    group: Konva.Group;
    nodes: KonvaNode[];
  }
}

export interface Options {
  enable?: boolean;
  stackSize?: number;
}

export interface Command<T extends Cmd.Options = Cmd.Options> {
  id: number;
  name: string;
  options: T;
  executed: boolean;
  executeTime: number;
}

export interface CmdStack {
  undoStack: Command[];
  redoStack: Command[];
}
