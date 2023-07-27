import { BaseFabricObject } from '@pictode/core';

import { BaseCmd } from './commands/base';
import { CommandClass, HistoryPlugin } from './index';

declare module '@pictode/core' {
  export interface App {
    registerCommands<T extends BaseCmd>(commandClasses: CommandClass<T> | Array<CommandClass<T>>): App;
    execute<T extends Cmd.Options>(command: BaseCmd | string, options?: T): App;
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
    object: BaseFabricObject;
  }
}

export interface Options {
  enabled?: boolean;
  stackSize?: number;
}

export interface Command<T extends Cmd.Options = Cmd.Options> {
  id: number;
  name: string;
  options?: T;
  executed: boolean;
  executeTime: number;
}

export interface CmdStack {
  undoStack: Command[];
  redoStack: Command[];
}
