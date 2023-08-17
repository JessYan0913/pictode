import { FormConfig } from '@/form';

import diamondPanel from './diamond-panel';
import ellipsePanel from './ellipse-panel';
import imagePanel from './image-panel';
import linePanel from './line-panel';
import rectPanel from './rect-panel';
import textPanel from './text-panel';

export const panels: { [key: string]: FormConfig } = {
  diamondPanel,
  ellipsePanel,
  imagePanel,
  linePanel,
  rectPanel,
  textPanel,
};
