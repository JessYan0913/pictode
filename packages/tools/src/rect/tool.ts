import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

type RectToolConfig = Pick<Konva.RectConfig, 'stroke' | 'strokeWidth' | 'fill' | 'cornerRadius' | 'opacity'>;

interface RectToolOptions {
  config: RectToolConfig;
  hooks?: ToolHooks;
}

export class RectTool implements Tool<RectToolConfig> {
  public name: string = 'rectTool';
  public config?: RectToolConfig;
  public hooks?: ToolHooks;
  private startPointer: util.Point = new util.Point(0, 0);
  private rectangle: Konva.Rect | null = null;

  constructor({ config, hooks }: RectToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousedown({ app }: ToolEvent) {
    if (this.rectangle) {
      return;
    }
    this.startPointer.clone(app.pointer);
    this.rectangle = new Konva.Rect({
      strokeScaleEnabled: false,
      ...this.config,
    });
    this.rectangle.setPosition(this.startPointer);
    this.rectangle.width(0);
    this.rectangle.height(0);
    app.add(this.rectangle);
    this.hooks?.onStartDrawing?.(app, this.rectangle);
  }

  public mousemove({ app }: ToolEvent) {
    if (!this.rectangle) {
      return;
    }
    this.rectangle.setPosition(
      new util.Point(Math.min(this.startPointer.x, app.pointer.x), Math.min(this.startPointer.y, app.pointer.y))
    );
    this.rectangle.width(Math.abs(app.pointer.x - this.startPointer.x));
    this.rectangle.height(Math.abs(app.pointer.y - this.startPointer.y));
    app.render();
  }

  public mouseup({ app }: ToolEvent) {
    if (!this.rectangle) {
      return;
    }
    this.hooks?.onCompleteDrawing?.(app, this.rectangle);
    this.rectangle = null;
    this.startPointer.setXY(0, 0);
  }
}

export default RectTool;
