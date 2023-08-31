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

export const getPanelConfigByShape = (shapeName: string): PanelConfig | undefined => {
  return panelConfigs.find(({ bindShape }) => bindShape.includes(shapeName));
};

export const getPanelConfigByTool = (toolName: string): PanelConfig | undefined => {
  return panelConfigs.find(({ bindTool }) => bindTool.includes(toolName));
};
