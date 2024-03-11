import { App } from '@pictode/core';

import './methods';

import { BaseCmd } from './commands/base';
import { Options } from './types';

export class History {
  public name: string = 'history';
  public app: App;
  public enabled: boolean;
  public stackSize: number;

  private undoStack: BaseCmd[] = [];
  private redoStack: BaseCmd[] = [];
  private idCounter: number = 0;

  constructor(app: App, options: Options) {
    const { enabled, stackSize } = options;
    this.app = app;
    this.enabled = enabled;
    this.stackSize = stackSize;
  }

  public execute(command: BaseCmd, needExecute?: boolean): void {
    // 如果命令栈中的命令长度已经超出了最大栈长，则将最早的命令清除
    if (this.undoStack.length > this.stackSize) {
      this.undoStack.shift();
    }

    this.undoStack.push(command);
    command.id = ++this.idCounter;

    if (needExecute) {
      command.execute();
    }
    command.executed = true;
    command.executeTime = new Date().getTime();
    this.redoStack = [];
    this.app.emit('stack:changed', { undoStack: this.undoStack, redoStack: this.redoStack });
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
          this.app.emit('stack:changed', { undoStack: this.undoStack, redoStack: this.redoStack });
        }
      }
      --step;
    }
    this.app.emit('history:undo', { step, command: command?.toJSON() });
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
          this.app.emit('stack:changed', { undoStack: this.undoStack, redoStack: this.redoStack });
        }
      }
      --step;
    }
    this.app.emit('history:redo', { step, command: command?.toJSON() });
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

    this.app.emit('stack:changed', { undoStack: this.undoStack, redoStack: this.redoStack });
  }

  public destroy(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.app.emit('stack:changed', { undoStack: this.undoStack, redoStack: this.redoStack });
  }
}

export default History;
