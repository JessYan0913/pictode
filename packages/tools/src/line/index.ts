import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

interface LineToolOptions {
  config?: Partial<Konva.LineConfig>;
  hooks?: ToolHooks;
}

export class LineTool implements Tool<Partial<Konva.LineConfig>> {
  public name = 'lineTool';
  public config?: Partial<Konva.LineConfig>;
  public hooks?: ToolHooks;
  private points: util.Point[] = [];
  private line: Konva.Line | null = null;

  constructor({ config, hooks }: LineToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousedown({ app }: ToolEvent) {
    if (!this.line) {
      this.line = new Konva.Line({
        points: util.flatPoints(this.points),
        fill: 'transparent',
        strokeScaleEnabled: false,
        hitStrokeWidth: 20,
        ...this.config,
      });
      app.add(this.line);
      this.hooks?.onStartDrawing?.(app, this.line);
    }
    const lastPoint = this.points.at(-1);
    if (!lastPoint?.eq(app.pointer)) {
      this.points.push(app.pointer);
    }
    this.line.points(util.flatPoints(this.points));
  }

  public mousemove({ app, pointer }: ToolEvent) {
    if (!this.line) {
      return;
    }
    this.line.points(util.flatPoints(this.points).concat(pointer.x, pointer.y));
    app.render();
  }

  public doubleClick({ app }: ToolEvent) {
    if (!this.line) {
      return;
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

export default LineTool;
