import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

type EllipseToolConfig = Pick<Konva.EllipseConfig, 'stroke' | 'fill' | 'strokeWidth' | 'opacity'>;

interface EllipseToolOptions {
  config?: EllipseToolConfig;
  hooks?: ToolHooks;
}

export class EllipseTool implements Tool<EllipseToolConfig> {
  public name: string = 'ellipseTool';
  public config?: EllipseToolConfig;
  public hooks?: ToolHooks;
  private ellipse: Konva.Ellipse | null = null;
  private startPointer: util.Point = new util.Point(0, 0);

  constructor({ config, hooks }: EllipseToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousedown({ app }: ToolEvent) {
    if (this.ellipse) {
      return;
    }
    this.startPointer.clone(app.pointer);
    this.ellipse = new Konva.Ellipse({
      radiusX: 0,
      radiusY: 0,
      strokeScaleEnabled: false,
      ...this.config,
    });
    this.ellipse.setPosition(this.startPointer);
    this.ellipse.radius(new util.Point(0, 0));
    app.add(this.ellipse);
  }

  public mousemove({ app }: ToolEvent) {
    if (!this.ellipse) {
      return;
    }
    // 计算起点和当前鼠标位置之间的距离
    const dx = app.pointer.x - this.startPointer.x;
    const dy = app.pointer.y - this.startPointer.y;

    // 计算椭圆的宽度和高度的绝对值
    const radius = new util.Point(Math.abs(dx) / 2, Math.abs(dy) / 2);
    // 根据起点和鼠标位置计算椭圆的中心位置
    this.ellipse.setPosition(new util.Point(this.startPointer.x + dx / 2, this.startPointer.y + dy / 2));
    this.ellipse.radius(radius);
    app.render();
  }

  public mouseup({ app, pointer }: ToolEvent) {
    if (!this.ellipse) {
      return;
    }
    if (this.startPointer.eq(pointer)) {
      this.ellipse?.destroy();
      this.ellipse = null;
      return;
    }
    this.hooks?.onCompleteDrawing?.(app, this.ellipse);
    this.ellipse = null;
    this.startPointer.setXY(0, 0);
  }

  public enableChanged(): void {
    this.ellipse = null;
    this.startPointer.setXY(0, 0);
  }
}

export default EllipseTool;
