import { App } from '@pictode/core';

import { BaseCmd } from './commands/base';
import { CommandClass, History } from './index';

App.prototype.registerCommands = function <T extends BaseCmd>(
  commandClasses: CommandClass<T> | Array<CommandClass<T>>
): App {
  const history = this.getPlugin('history') as History;
  if (history) {
    history.registerCommands<T>(commandClasses);
  }
  return this;
};

App.prototype.undo = function (step: number = 1): App {
  const history = this.getPlugin('history') as History;
  if (history) {
    history.undo(step);
  }
  return this;
};
