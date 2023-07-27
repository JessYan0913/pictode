import { App } from '@pictode/core';

import { History } from './index';

App.prototype.undo = function (step: number = 1): App {
  const history = this.getPlugin('history') as History;
  if (history) {
    history.undo(step);
  }
  return this;
};

App.prototype.redo = function (step: number = 1): App {
  const history = this.getPlugin('history') as History;
  if (history) {
    history.redo(step);
  }
  return this;
};

App.prototype.canUndo = function (): boolean {
  const history = this.getPlugin('history') as History;
  if (history) {
    return history.canUndo();
  }
  return false;
};

App.prototype.canRedo = function (): boolean {
  const history = this.getPlugin('history') as History;
  if (history) {
    return history.canRedo();
  }
  return false;
};

App.prototype.jump = function (id: number): App {
  const history = this.getPlugin('history') as History;
  if (history) {
    history.jump(id);
  }
  return this;
};
