import { Image as Img } from '../customs/image';
import { Tool } from '../types';
import { Point, readeFile, selectFile } from '../utils';

import { selectTool } from './select-tool';

export const imageTool = (): Tool => {
  const imageObject = new Image();
  const img = new Img({
    image: imageObject,
    strokeScaleEnabled: false,
  });
  let confirm: boolean = false;

  return {
    name: 'imageTool',
    async onActive(app) {
      try {
        app.cancelSelect();
        const files = await selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE', '.svg'], false);
        const imgSrc = await readeFile<string>((reader) => reader.readAsDataURL(files[0]));
        imageObject.src = imgSrc;
        img.opacity(0.5);
        app.add(img);
      } catch (error) {
        img.destroy();
      }
    },
    onMousedown({ app }) {
      img.opacity(1);
      if (confirm) {
        return;
      }
      confirm = true;
      img.opacity(1);
      app.setTool(selectTool(img));
    },
    onMousemove({ app, pointer }) {
      if (!imageObject.src) {
        return;
      }
      const width = 200;
      const height = width * (imageObject.height / imageObject.width);
      img.width(width);
      img.height(height);
      img.position(new Point(pointer.x - width / 2, pointer.y - height / 2));
      app.render();
    },
  };
};

export default imageTool;
