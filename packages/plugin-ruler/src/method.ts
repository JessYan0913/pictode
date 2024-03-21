import { App } from '@pictode/core';

import { RulerPlugin } from './index';

App.prototype.triggerRulerVisible = function (enabled?: boolean) {
  const rulerPlugin = this.getPlugin<RulerPlugin>('rulerPlugin');
  if (rulerPlugin) {
    rulerPlugin.triggerVisible(enabled);
  }
  return this;
};

App.prototype.rulerUpdate = function () {
  const rulerPlugin = this.getPlugin<RulerPlugin>('rulerPlugin');
  if (rulerPlugin) {
    rulerPlugin.update();
  }
  return this;
};
