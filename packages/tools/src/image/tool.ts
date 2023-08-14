import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

type ImageOptions = Pick<Konva.ImageConfig, 'opacity'> & { image: HTMLImageElement; hooks?: ToolHooks };

export class ImageTool implements Tool {
  public name: string = 'imageTool';
  public options?: ImageOptions | undefined;
  public hooks?: ToolHooks | undefined;
  private img: Konva.Image | null = null;
  private isAdded: boolean = false;

  constructor(options: ImageOptions) {
    this.options = options;
    this.hooks = options.hooks;

    this.img = new Konva.Image({
      strokeScaleEnabled: false,
      ...this.options,
    });
    this.img.opacity(0.5);
  }

  public mousedown({ app }: ToolEvent) {
    if (!this.img) {
      return;
    }
    this.img.opacity(1);
    this.hooks?.onCompleteDrawing?.(app, this.img);
    this.img = null;
  }

  public mousemove({ app, pointer }: ToolEvent) {
    if (!this.img) {
      return;
    }
    if (!this.isAdded) {
      this.img.image(this.options?.image);
      app.add(this.img);
      this.isAdded = true;
    }
    const width = 200;
    const height = width * ((this.options?.image.height ?? 1) / (this.options?.image.width ?? 1));
    this.img.width(width);
    this.img.height(height);
    this.img.position(new util.Point(pointer.x - width / 2, pointer.y - height / 2));
    app.render();
  }
}

export default ImageTool;
