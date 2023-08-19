import { App } from '@pictode/core';

import { PanelConfig } from '@/panels/types';

import { diamondPanelConfig } from './diamond-panel';
import { ellipsePanelConfig } from './ellipse-panel';
import { imagePanelConfig } from './image-panel';
import { linePanelConfig } from './line-panel';
import { rectPanelConfig } from './rect-panel';
import { textPanelConfig } from './text-panel';

const panelConfigs = [
  diamondPanelConfig,
  ellipsePanelConfig,
  imagePanelConfig,
  linePanelConfig,
  rectPanelConfig,
  textPanelConfig,
];

export * from './types';

export const getPanelConfig = (app: App): PanelConfig | undefined => {
  const curToolName = app.curTool?.name;
  const panelConfig = panelConfigs.find(({ bindTool }) => bindTool === curToolName);
  if (panelConfig) {
    return panelConfig;
  }
  const selected = app.selected[0];
  if (!selected || !app.curTool) {
    return;
  }
  return panelConfigs.find(({ bindShape }) => bindShape === selected.className);
};
