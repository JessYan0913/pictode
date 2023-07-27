import { Color } from 'fabric';

import { AppOption, ControlsOption } from '../types';

export const DEFAULT_APP_OPTION: AppOption & { controls: ControlsOption } = {
  backgroundColor: '#ffffff',
  controls: {
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
