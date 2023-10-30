import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

type ImageConfig = Partial<Konva.ImageConfig> & { image: HTMLImageElement };

export interface ImageToolOptions {
  config: ImageConfig;
  hooks?: ToolHooks;
}

export class ImageTool implements Tool<Partial<ImageConfig>> {
  public name = 'imageTool';
  public config: ImageConfig;
  public hooks?: ToolHooks;
  private image: Konva.Image | null = null;
  private isCompleted: boolean = false;

  constructor({ config, hooks }: ImageToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousemove({ app, pointer }: ToolEvent) {
    if (this.isCompleted) {
      return;
    }
    if (!this.image) {
      this.image = new Konva.Image({
        strokeScaleEnabled: false,
        ...this.config,
      });
      this.image.opacity(0.5);
      app.add(this.image);
      this.isCompleted = false;
    }
    const width = 200;
    const height = width * ((this.config.image.height ?? 1) / (this.config.image.width ?? 1));
    this.image.width(width);
    this.image.height(height);
    this.image.position(new util.Point(pointer.x - width / 2, pointer.y - height / 2));
    app.render();
  }

  public mousedown({ app }: ToolEvent) {
    if (!this.image) {
      return;
    }
    this.image.opacity(1);
    this.hooks?.onCompleteDrawing?.(app, this.image);
    this.image = new Konva.Image({
      strokeScaleEnabled: false,
      ...this.config,
    });
    this.image.opacity(0.5);
    this.isCompleted = true;
  }

  public enableChanged(): void {
    this.image = null;
  }
}

export default ImageTool;
