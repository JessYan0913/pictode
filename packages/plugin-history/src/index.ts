import { App, Plugin } from '@pictode/core';
import { isSubclass } from '@pictode/utils';

import './methods';

import { BaseCmd } from './commands/base';
import { CmdNotOptionsError, CmdNotRegisterError } from './errors';
import { Cmd, Options } from './types';

export type CommandClass<T extends BaseCmd = BaseCmd, O extends Cmd.Options = Cmd.Options> = new (
  app?: App,
  options?: O
) => T;

export class History implements Plugin {
  public name: string = 'history';
  private app?: App;
  private enabled: boolean;
  private stackSize: number;

  private commands: Record<string, CommandClass> = {};
  private undoStack: BaseCmd[] = [];
  private redoStack: BaseCmd[] = [];
  private idCounter: number = 0;

  constructor(options?: Options) {
    const { enabled = true, stackSize = 500 } = options ?? {};
    this.enabled = enabled;
    this.stackSize = stackSize;
  }

  public setStackSize(size: number): void {
    this.stackSize = size;
  }

  public registerCommands<T extends BaseCmd>(commandClasses: CommandClass<T> | Array<CommandClass<T>>): void {
    if (!Array.isArray(commandClasses)) {
      commandClasses = [commandClasses];
    }
    commandClasses.forEach((commandClass) => {
      if (isSubclass(commandClass, BaseCmd)) {
        this.commands[commandClass.name] = commandClass;
      }
    });
  }

  public getCommandClass(command: BaseCmd | string): CommandClass {
    let result: CommandClass;
    if (command instanceof BaseCmd) {
      result = this.commands[command.name];
    } else {
      result = this.commands[command];
    }
    if (!result) {
      throw new CmdNotRegisterError(command);
    }
    return result;
  }

  public execute<T extends Cmd.Options>(command: BaseCmd | string, options?: T): void {
    let executeCommand: BaseCmd;
    const Command = this.getCommandClass(command);
    if (command instanceof BaseCmd) {
      executeCommand = command;
    } else {
      if (!options) {
        throw new CmdNotOptionsError(command);
      }
      executeCommand = new Command(this.app, options);
    }

    // 如果命令栈中的命令长度已经超出了最大栈长，则将最早的命令清除
    if (this.undoStack.length > this.stackSize) {
      this.undoStack.shift();
    }

    this.undoStack.push(executeCommand);
    executeCommand.id = ++this.idCounter;

    executeCommand.execute();
    executeCommand.executed = true;
    executeCommand.executeTime = new Date().getTime();
    this.redoStack = [];
    this.app?.emit('stack:changed', {
      undoStack: this.undoStack,
      redoStack: this.redoStack,
    });
  }

  public undo(step: number = 1): BaseCmd | undefined {
    if (!this.enabled) {
      return;
    }

    let command: BaseCmd | undefined;
    while (step) {
      if (this.undoStack.length > 0) {
        command = this.undoStack.pop();

        if (command) {
          command.undo();
          this.redoStack.push(command);
          this.app?.emit('stack:changed', {
            undoStack: this.undoStack,
            redoStack: this.redoStack,
          });
        }
      }
      --step;
    }
    this.app?.emit('history:undo', {
      step,
      command: command?.toJSON(),
    });
    return command;
  }

  public redo(step: number = 1): BaseCmd | undefined {
    if (!this.enabled) {
      return;
    }
    let command: BaseCmd | undefined;
    while (step) {
      if (this.redoStack.length > 0) {
        command = this.redoStack.pop();
        if (command) {
          command.execute();
          this.undoStack.push(command);
          this.app?.emit('stack:changed', {
            undoStack: this.undoStack,
            redoStack: this.redoStack,
          });
        }
      }
      --step;
    }
    this.app?.emit('history:redo', {
      command: command?.toJSON(),
      step,
    });
    return command;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public jump(id: number): void {
    if (!this.enabled) {
      return;
    }

    let command: BaseCmd | undefined =
      this.undoStack.length > 0 ? this.undoStack[this.undoStack.length - 1] : undefined;

    if (command === undefined || id > command.id) {
      command = this.redo();

      while (command !== undefined && id > command.id) {
        command = this.redo();
      }
    } else {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        command = this.undoStack[this.undoStack.length - 1];

        if (command === undefined || id === command.id) {
          break;
        }
        this.undo();
      }
    }

    this.app?.emit('stack:changed', {
      undoStack: this.undoStack,
      redoStack: this.redoStack,
    });
  }

  public install(app: App) {
    this.app = app;
  }

  public dispose(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.app?.emit('stack:changed', {
      undoStack: this.undoStack,
      redoStack: this.redoStack,
    });
    this.app?.emit('history:destroy', {
      history: this,
    });
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public isEnabled(): boolean {
    return this.enabled ?? false;
  }
}

export default History;
