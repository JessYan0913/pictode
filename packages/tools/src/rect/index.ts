import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

export interface RectToolOptions {
  config?: Partial<Konva.RectConfig>;
  hooks?: ToolHooks;
}

export class RectTool implements Tool<Partial<Konva.RectConfig>> {
  public name = 'rectTool';
  public config?: Partial<Konva.RectConfig>;
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

  public mouseup({ app, pointer }: ToolEvent) {
    if (!this.rectangle) {
      return;
    }
    if (this.startPointer.eq(pointer)) {
      this.rectangle?.destroy();
      this.rectangle = null;
      return;
    }
    this.hooks?.onCompleteDrawing?.(app, this.rectangle);
    this.rectangle = null;
    this.startPointer.setXY(0, 0);
  }

  public enableChanged(): void {
    this.rectangle = null;
    this.startPointer.setXY(0, 0);
  }
}

export default RectTool;
