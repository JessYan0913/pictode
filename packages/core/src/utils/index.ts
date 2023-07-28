import { Color } from 'fabric';

import { AppOption, CanvasConfig, ObjectConfig } from '../types';

export const DEFAULT_APP_OPTION: AppOption & { canvasConfig: CanvasConfig; objectConfig: ObjectConfig } = {
  backgroundColor: '#ffffff',
  canvasConfig: {
    isDrawingMode: false,
    selection: true,
    selectionColor: 'rgba(157, 157, 231, 0.5)',
    selectionBorderColor: 'rgb(157, 157, 231)',
    selectionLineWidth: 2,
  },
  objectConfig: {
    objectCaching: false,
    hasControls: true,
    padding: 3,
    borderColor: 'rgb(157, 157, 231)',
    cornerColor: 'rgb(157, 157, 231)',
    cornerStrokeColor: 'rgb(157, 157, 231)',
    cornerStyle: 'circle',
    cornerSize: 8,
    rotatingPointOffset: 10,
    transparentCorners: true,
  },
};

export const isTransparent = (color: string): boolean => {
  return new Color(color).getAlpha() === 0;
};
