import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

type RectOptions = Pick<Konva.RectConfig, 'stroke' | 'fill' | 'strokeWidth' | 'opacity' | 'cornerRadius'> & {
  hooks?: ToolHooks;
};

export class RectTool implements Tool {
  public name: string = 'rectTool';
  public options?: RectOptions | undefined;
  public hooks?: ToolHooks | undefined;
  private startPointer: util.Point = new util.Point(0, 0);
  private rectangle: Konva.Rect | null = null;

  constructor(options: RectOptions) {
    this.options = options;
    this.hooks = options.hooks;
  }

  public mousedown({ app }: ToolEvent) {
    if (this.rectangle) {
      return;
    }
    this.startPointer.clone(app.pointer);
    this.rectangle = new Konva.Rect({
      strokeScaleEnabled: false,
      ...this.options,
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
