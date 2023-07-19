import History from './services/history';
import Context from './context';

export interface Plugin {
  name: string;
  install: (context: Context) => void;
}

export namespace Cmd {
  export interface Options {
    [key: string]: any;
  }
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
export abstract class BaseCmd<T extends Cmd.Options = Cmd.Options> implements Command<T> {
  public context: Context;
  public name: string;
  public id: number = 0;
  public executed: boolean = false;
  public options: T;
  public executeTime: number = new Date().getTime();

  constructor(context: Context, options: T) {
    this.context = context;
    this.name = this.constructor.name;
    this.options = options;
  }

  public abstract execute(): void;

  public abstract undo(): void;

  public toJSON(): Command<T> {
    return {
      id: this.id,
      name: this.name,
      options: this.options,
      executed: this.executed,
      executeTime: this.executeTime,
    };
  }

  public fromJSON(json: Command<T>): void {
    this.id = json.id;
    this.name = json.name;
    this.options = json.options;
    this.executed = json.executed;
    this.executeTime = json.executeTime;
  }
}

export type CommandClass<T extends BaseCmd = BaseCmd, O extends Cmd.Options = Cmd.Options> = new (
  context: Context,
  options: O
) => T;

export namespace Event {
  export interface ContextArgs {}

  export interface HistoryArgs {
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

  export interface RendererArgs {
    'canvas:rendered': {
      time: number;
    };
  }
}
