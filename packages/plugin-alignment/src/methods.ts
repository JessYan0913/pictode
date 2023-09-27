import { App, KonvaNode } from '@pictode/core';

import { AlignmentPlugin } from './index';

App.prototype.alignLeft = function (nodes: KonvaNode[]): App {
  const alignmentPlugin = this.getPlugin('alignmentPlugin') as AlignmentPlugin;
  if (alignmentPlugin) {
    alignmentPlugin.alignment?.alignLeft(nodes);
  }
  return this;
};

App.prototype.alignRight = function (nodes: KonvaNode[]): App {
  const alignmentPlugin = this.getPlugin('alignmentPlugin') as AlignmentPlugin;
  if (alignmentPlugin) {
    alignmentPlugin.alignment?.alignRight(nodes);
  }
  return this;
};

App.prototype.alignTop = function (nodes: KonvaNode[]): App {
  const alignmentPlugin = this.getPlugin('alignmentPlugin') as AlignmentPlugin;
  if (alignmentPlugin) {
    alignmentPlugin.alignment?.alignTop(nodes);
  }
  return this;
};

App.prototype.alignBottom = function (nodes: KonvaNode[]): App {
  const alignmentPlugin = this.getPlugin('alignmentPlugin') as AlignmentPlugin;
  if (alignmentPlugin) {
    alignmentPlugin.alignment?.alignBottom(nodes);
  }
  return this;
};

App.prototype.alignCenterX = function (nodes: KonvaNode[]): App {
  const alignmentPlugin = this.getPlugin('alignmentPlugin') as AlignmentPlugin;
  if (alignmentPlugin) {
    alignmentPlugin.alignment?.alignCenterX(nodes);
  }
  return this;
};

App.prototype.alignCenterY = function (nodes: KonvaNode[]): App {
  const alignmentPlugin = this.getPlugin('alignmentPlugin') as AlignmentPlugin;
  if (alignmentPlugin) {
    alignmentPlugin.alignment?.alignCenterY(nodes);
  }
  return this;
};

App.prototype.dispersionX = function (nodes: KonvaNode[]): App {
  const alignmentPlugin = this.getPlugin('alignmentPlugin') as AlignmentPlugin;
  if (alignmentPlugin) {
    alignmentPlugin.alignment?.dispersionX(nodes);
  }
  return this;
};

App.prototype.dispersionY = function (nodes: KonvaNode[]): App {
  const alignmentPlugin = this.getPlugin('alignmentPlugin') as AlignmentPlugin;
  if (alignmentPlugin) {
    alignmentPlugin.alignment?.dispersionY(nodes);
  }
  return this;
};
