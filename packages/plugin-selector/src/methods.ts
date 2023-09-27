import { App, Konva, KonvaMouseEvent, KonvaNode } from '@pictode/core';

import { SelectorPlugin } from './index';

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

App.prototype.selectAll = function (): App {
  const selectorPlugin = this.getPlugin('selectorPlugin') as SelectorPlugin;
  if (selectorPlugin) {
    selectorPlugin.selector?.selectAll();
  }
  return this;
};

App.prototype.triggerSelector = function (enabled?: boolean): App {
  const selectorPlugin = this.getPlugin('selectorPlugin') as SelectorPlugin;
  if (selectorPlugin) {
    selectorPlugin.selector?.triggerSelector(enabled);
  }
  return this;
};

App.prototype.isSelected = function (node: KonvaNode): boolean {
  const selectorPlugin = this.getPlugin('selectorPlugin') as SelectorPlugin;
  if (selectorPlugin) {
    return selectorPlugin.selector?.isSelected(node) ?? false;
  }
  return false;
};
