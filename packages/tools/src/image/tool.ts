import { Konva, Tool, ToolHooks, util } from '@pictode/core';

type ImageOptions = Pick<Konva.ImageConfig, 'opacity'> & { image: HTMLImageElement; isComplete?: boolean };

export const tool = (options: ImageOptions, hooks?: ToolHooks): Tool => {
  let img: Konva.Image | null = null;
  let confirm: boolean = false;

  return {
    name: 'imageTool',
    options,
    hooks,
    mousedown({ app }) {
      if (!img) {
        return;
      }
      img.opacity(1);
      if (confirm) {
        return;
      }
      confirm = true;
      img.opacity(1);
      this.hooks?.onCompleteDrawing?.(app, img);
      this.options && (this.options.isComplete = true);
      img = null;
    },
    mousemove({ app, pointer }) {
      if (this.options?.isComplete) {
        return;
      }
      if (!img) {
        img = new Konva.Image({
          strokeScaleEnabled: false,
          image: options.image,
          ...this.options,
        });
        img.opacity(0.5);
        app.add(img);
      }
      const width = 200;
      const height = width * (options.image.height / options.image.width);
      img.width(width);
      img.height(height);
      img.position(new util.Point(pointer.x - width / 2, pointer.y - height / 2));
    },
  };
};

export default tool;
