import { App, Konva, Tool, ToolEvent, ToolHooks } from '@pictode/core';
import { Point } from '@pictode/core/types/utils';

type LineToolConfig = Pick<Konva.LineConfig, 'stroke' | 'strokeWidth' | 'opacity'>;

interface LineToolOptions {
  config?: LineToolConfig;
  hooks?: ToolHooks;
}

export class ArrowTool implements Tool<LineToolConfig> {
  public name = 'ArrowTool';
  public config?: LineToolConfig;
  public hooks?: ToolHooks;
  private startPoint?: Point;
  private endPoint?: Point;
  private arrow?: Konva.Arrow;

  constructor({ config, hooks }: LineToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  private drawArrow(app: App) {
    if (!this.startPoint || !this.endPoint) {
      return;
    }
    this.arrow = new Konva.Arrow({
      points: [this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y],
      pointerLength: 10,
      pointerWidth: 10,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 2,
      ...this.config,
    });
    app.add(this.arrow);
    this.hooks?.onStartDrawing?.(app, this.arrow);
  }

  private stop(): void {
    this.startPoint = void 0;
    this.endPoint = void 0;
    this.arrow = void 0;
  }

  public mousedown({ app }: ToolEvent) {
    if (!this.arrow) {
      this.startPoint = app.pointer;
      this.endPoint = app.pointer;
      this.drawArrow(app);
    } else {
      this.hooks?.onCompleteDrawing?.(app, this.arrow);
      this.stop();
    }
  }

  public mousemove({ app, pointer }: ToolEvent) {
    if (this.arrow && this.startPoint && this.endPoint) {
      this.arrow.points([this.startPoint.x, this.startPoint.y, pointer.x, pointer.y]);
      app.render();
    }
  }
}

export default ArrowTool;
