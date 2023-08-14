import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

type DrawingOptions = Pick<Konva.LineConfig, 'stroke' | 'strokeWidth' | 'opacity'> & { hooks?: ToolHooks };

export class DrawingTool implements Tool {
  public name: string = 'drawingTool';
  public options?: DrawingOptions | undefined;
  public hooks?: ToolHooks | undefined;
  private line: Konva.Line | null = null;
  private points: util.Point[] = [];

  constructor(options: DrawingOptions) {
    this.options = options;
    this.hooks = options.hooks;
  }

  public mousedown({ app }: ToolEvent) {
    const lastPoint = this.points.at(-1);
    if (!lastPoint || !lastPoint.eq(app.pointer)) {
      this.points.push(app.pointer);
    }
    if (this.line) {
      return;
    }
    this.line = new Konva.Line({
      points: util.flatPoints(this.points),
      globalCompositeOperation: 'source-over',
      lineCap: 'round',
      lineJoin: 'round',
      strokeScaleEnabled: false,
      ...this.options,
    });
    app.add(this.line);
    this.hooks?.onStartDrawing?.(app, this.line);
  }

  public mousemove({ app, event }: ToolEvent) {
    if (!this.line) {
      return;
    }
    event.evt.stopPropagation();
    this.line.points(this.line.points().concat([app.pointer.x, app.pointer.y]));
  }

  public mouseup({ app, pointer }: ToolEvent) {
    if (!this.line) {
      return;
    }
    const lastPoint = this.points.at(-1);
    if (this.points.length <= 6 && lastPoint && pointer.distanceTo(lastPoint) < 10 && this.line) {
      this.line.destroy();
    }
    this.hooks?.onCompleteDrawing?.(app, this.line);
    this.line = null;
    this.points = [];
  }
}

export default DrawingTool;
