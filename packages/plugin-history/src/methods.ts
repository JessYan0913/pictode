import { App } from '@pictode/core';

import { HistoryPlugin } from './index';

App.prototype.undo = function (step: number = 1): App {
  const historyPlugin = this.getPlugin('historyPlugin') as HistoryPlugin;
  if (historyPlugin) {
    historyPlugin.history.undo(step);
  }
  return this;
};

App.prototype.redo = function (step: number = 1): App {
  const historyPlugin = this.getPlugin('historyPlugin') as HistoryPlugin;
  if (historyPlugin) {
    historyPlugin.history.redo(step);
  }
  return this;
};

App.prototype.canUndo = function (): boolean {
  const historyPlugin = this.getPlugin('historyPlugin') as HistoryPlugin;
  if (historyPlugin) {
    return historyPlugin.history.canUndo();
  }
  return false;
};

App.prototype.canRedo = function (): boolean {
  const historyPlugin = this.getPlugin('historyPlugin') as HistoryPlugin;
  if (historyPlugin) {
    return historyPlugin.history.canRedo();
  }
  return false;
};

App.prototype.jump = function (id: number): App {
  const historyPlugin = this.getPlugin('historyPlugin') as HistoryPlugin;
  if (historyPlugin) {
    historyPlugin.history.jump(id);
  }
  return this;
};
