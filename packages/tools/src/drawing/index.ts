import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

interface DrawingToolOptions {
  config?: Partial<Konva.LineConfig>;
  hooks?: ToolHooks;
}

export class DrawingTool implements Tool<Partial<Konva.LineConfig>> {
  public name = 'drawingTool';
  public config?: Partial<Konva.LineConfig>;
  public hooks?: ToolHooks;
  private line: Konva.Line | null = null;
  private points: util.Point[] = [];

  constructor({ config, hooks }: DrawingToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousedown({ app }: ToolEvent) {
    const lastPoint = this.points.at(-1);
    if (!lastPoint?.eq(app.pointer)) {
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
      hitStrokeWidth: 20,
      ...this.config,
    });
    app.add(this.line);
    this.hooks?.onStartDrawing?.(app, this.line);
  }

  public mousemove({ app, event }: ToolEvent) {
    if (!this.line) {
      return;
    }
    event.evt.stopPropagation();
    this.points.push(app.pointer);
    this.line.points(util.flatPoints(this.points));
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

  public enableChanged(): void {
    this.line = null;
    this.points = [];
  }
}

export default DrawingTool;
