import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

type ImageToolConfig = Pick<Konva.ImageConfig, 'stroke' | 'strokeWidth' | 'opacity'>;

interface ImageToolOptions {
  config?: ImageToolConfig;
  hooks?: ToolHooks;
}

export class ImageTool implements Tool<ImageToolConfig> {
  public name: string = 'imageTool';
  public config?: ImageToolConfig | undefined;
  public hooks?: ToolHooks | undefined;
  private image: Konva.Image | null = null;
  private isAdded: boolean = false;
  public imageElement: HTMLImageElement = new Image();

  constructor({ config, hooks }: ImageToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousedown({ app }: ToolEvent) {
    if (!this.image) {
      return;
    }
    this.image.opacity(1);
    this.hooks?.onCompleteDrawing?.(app, this.image);
    this.image = null;
  }

  public mousemove({ app, pointer }: ToolEvent) {
    if (!this.isAdded) {
      this.image = new Konva.Image({
        strokeScaleEnabled: false,
        image: this.imageElement,
        ...this.config,
      });
      this.image.opacity(0.5);
      this.image.image(this.imageElement);
      app.add(this.image);
      this.isAdded = true;
    }
    if (!this.image) {
      return;
    }
    const width = 200;
    const height = width * ((this.imageElement.height ?? 1) / (this.imageElement.width ?? 1));
    this.image.width(width);
    this.image.height(height);
    this.image.position(new util.Point(pointer.x - width / 2, pointer.y - height / 2));
    app.render();
  }

  public enableChanged(): void {
    this.image = null;
    this.imageElement = new Image();
  }
}

export default ImageTool;
