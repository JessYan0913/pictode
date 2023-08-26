import { App, Konva, KonvaMouseEvent, KonvaNode } from '@pictode/core';

import { SelectorPlugin } from './index';

Object.defineProperty(App.prototype, 'selected', {
  get() {
    const selectorPlugin = this.getPlugin('selectorPlugin') as SelectorPlugin;
    if (selectorPlugin) {
      return [...(selectorPlugin.selector?.selected.values() ?? [])];
    }
    return [];
  },
});

App.prototype.select = function (...nodes: KonvaNode[]): App {
  const selectorPlugin = this.getPlugin('selectorPlugin') as SelectorPlugin;
  if (selectorPlugin) {
    selectorPlugin.selector?.select(...nodes);
  }
  return this;
};

App.prototype.cancelSelect = function (...nodes: KonvaNode[]): App {
  const selectorPlugin = this.getPlugin('selectorPlugin') as SelectorPlugin;
  if (selectorPlugin) {
    selectorPlugin.selector?.cancelSelect(...nodes);
  }
  return this;
};

App.prototype.selectByEvent = function (event: KonvaMouseEvent): App {
  const selectorPlugin = this.getPlugin('selectorPlugin') as SelectorPlugin;
  if (selectorPlugin) {
    if (event.target instanceof Konva.Stage) {
      this.cancelSelect();
    } else {
      this.select(event.target);
    }
  }
  return this;
};
