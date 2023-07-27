import { Color } from 'fabric';

import { AppOption, ObjectConfig } from '../types';

export const DEFAULT_APP_OPTION: AppOption & { objectConfig: ObjectConfig } = {
  backgroundColor: '#ffffff',
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
