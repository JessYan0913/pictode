import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

type EllipseOptions = Pick<Konva.EllipseConfig, 'fill' | 'stroke' | 'strokeWidth' | 'opacity'> & {
  hooks?: ToolHooks;
};

export class EllipseTool implements Tool {
  public name: string = 'ellipseTool';
  public options?: EllipseOptions | undefined;
  public hooks?: ToolHooks | undefined;
  private ellipse: Konva.Ellipse | null = null;
  private startPointer: util.Point = new util.Point(0, 0);

  constructor(options: EllipseOptions) {
    this.options = options;
    this.hooks = options.hooks;
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
      ...this.options,
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

  public mouseup({ app }: ToolEvent) {
    if (!this.ellipse) {
      return;
    }
    this.hooks?.onCompleteDrawing?.(app, this.ellipse);
    this.ellipse = null;
    this.startPointer.setXY(0, 0);
  }
}

export default EllipseTool;
