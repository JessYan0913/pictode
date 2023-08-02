import { Image as Img } from '../customs/image';
import { Tool } from '../types';
import { guid, readeFile, selectFile } from '../utils';

import { selectTool } from './select-tool';

export const imageTool = (): Tool => {
  const imageObject = new Image();
  const img = new Img({
    id: guid(),
    image: imageObject,
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
