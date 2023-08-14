import { Konva, Tool, util } from '@pictode/core';

import { tool as selectTool } from '../select';

export const tool = (): Tool => {
  let imageObject: HTMLImageElement | null = null;
  let img: Konva.Image | null = null;
  let confirm: boolean = false;

  return {
    name: 'imageTool',
    async onActive(app) {
      imageObject = new Image();
      img = new Konva.Image({
        image: imageObject,
        strokeScaleEnabled: false,
      });
      try {
        app.cancelSelect();
        const files = await util.selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE', '.svg'], false);
        const imgSrc = await util.readeFile<string>((reader) => reader.readAsDataURL(files[0]));
        imageObject.src = imgSrc;
        img.opacity(0.5);
        app.add(img);
      } catch (error) {
        img.destroy();
      }
    },
    onMousedown({ app }) {
      if (!img) {
        return;
      }
      img.opacity(1);
      if (confirm) {
        return;
      }
      confirm = true;
      img.opacity(1);
      app.setTool(selectTool(img));
      img = null;
    },
    onMousemove({ app, pointer }) {
      if (!imageObject || !img) {
        return;
      }
      const width = 200;
      const height = width * (imageObject.height / imageObject.width);
      img.width(width);
      img.height(height);
      img.position(new util.Point(pointer.x - width / 2, pointer.y - height / 2));
      app.render();
    },
  };
};

export default tool;
