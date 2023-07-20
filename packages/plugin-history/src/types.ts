import { History } from './index';

declare module '@pictode/core' {
  export interface Context {
    undo(): void;
  }
}

export namespace Cmd {
  export interface Options {
    [key: string]: any;
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

export interface EventArgs {
  'stack:changed': CmdStack;
  'history:destroy': {
    history: History;
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
