import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

type ImageToolConfig = Pick<Konva.ImageConfig, 'stroke' | 'strokeWidth' | 'opacity' | 'image'> & {
  image: HTMLImageElement;
};

interface ImageToolOptions {
  config: ImageToolConfig;
  hooks?: ToolHooks;
}

export class ImageTool implements Tool<ImageToolConfig> {
  public name: string = 'imageTool';
  public config?: ImageToolConfig | undefined;
  public hooks?: ToolHooks | undefined;
  private img: Konva.Image | null = null;
  private isAdded: boolean = false;

  constructor({ config, hooks }: ImageToolOptions) {
    this.config = config;
    this.hooks = hooks;

    this.img = new Konva.Image({
      strokeScaleEnabled: false,
      ...this.config,
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
      this.img.image(this.config?.image);
      app.add(this.img);
      this.isAdded = true;
    }
    const width = 200;
    const height = width * ((this.config?.image.height ?? 1) / (this.config?.image.width ?? 1));
    this.img.width(width);
    this.img.height(height);
    this.img.position(new util.Point(pointer.x - width / 2, pointer.y - height / 2));
    app.render();
  }
}

export default ImageTool;
