import { App } from '@pictode/core';

import { History } from './index';

App.prototype.undo = function (step: number = 1) {
  const history = this.getPlugin('history') as History;
  if (history) {
    history.undo(step);
  }
  return this;
};
