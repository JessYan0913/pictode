import { BaseError } from '@pictode/utils';

import { BaseCmd } from '../types';

export class CmdNotRegisterError extends BaseError {
  constructor(command: BaseCmd | string) {
    super(`${command instanceof BaseCmd ? command.name : command} not registered`);
  }
}

export class CmdNotOptionsError extends BaseError {
  constructor(command: BaseCmd | string) {
    super(`The options of the ${command instanceof BaseCmd ? command.name : command} command cannot be undefine`);
  }
}
