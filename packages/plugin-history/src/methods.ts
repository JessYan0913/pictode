import { Context } from '@pictode/core';

import { History } from './index';

Context.prototype.undo = function (step: number = 1) {
  const history = this.getPlugin('history') as History;
  if (history) {
    history.undo(step);
  }
  return this;
};
