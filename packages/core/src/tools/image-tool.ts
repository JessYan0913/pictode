import { readeFile, selectFile } from '@pictode/utils';

import { Image as Img } from '../customs/image';
import { Tool } from '../types';

import { selectTool } from './select-tool';

export const imageTool = (): Tool => {
  const imageObject = new Image();
  const img = new Img({
    image: imageObject,
    stroke: 'black',
    strokeWidth: 2,
  });

  return {
    name: 'imageTool',
    async onActive(app) {
      app.cancelSelect();
      const files = await selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE'], false);
      const imgSrc = await readeFile<string>((reader) => reader.readAsDataURL(files[0]));
      imageObject.src = imgSrc;
      app.add(img);
      app.setTool(selectTool(img));
    },
  };
};

export default imageTool;
