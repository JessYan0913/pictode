import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

interface DiamondToolOptions {
  config: Konva.RegularPolygonConfig;
  hooks?: ToolHooks;
}

export class DiamondTool implements Tool<Konva.RegularPolygonConfig> {
  public name: string = 'diamondTool';
  public hooks?: ToolHooks;
  public config?: Konva.RegularPolygonConfig;
  private diamond: Konva.RegularPolygon | null = null;
  private startPointer: util.Point = new util.Point(0, 0);

  constructor({ config, hooks }: DiamondToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousedown({ app }: ToolEvent) {
    if (this.diamond) {
      return;
    }
    this.startPointer.clone(app.pointer);
    this.diamond = new Konva.RegularPolygon({
      sides: 4,
      radius: 0,
      strokeScaleEnabled: false,
      ...this.config,
    });
    this.diamond.setPosition(this.startPointer);
    app.add(this.diamond);
    this.hooks?.onStartDrawing?.(app, this.diamond);
  }

  public mousemove({ app }: ToolEvent) {
    if (!this.diamond) {
      return;
    }
    const dx = app.pointer.x - this.startPointer.x;
    const dy = app.pointer.y - this.startPointer.y;
    const newPosition = new util.Point(this.startPointer.x + dx / 2, this.startPointer.y + dy / 2);

    this.diamond.setPosition(newPosition);
    this.diamond.radius(newPosition.distanceTo(app.pointer));
    app.render();
  }

  public mouseup({ app }: ToolEvent) {
    if (!this.diamond) {
      return;
    }
    this.hooks?.onCompleteDrawing?.(app, this.diamond);
    this.diamond = null;
    this.startPointer.setXY(0, 0);
  }
}

export default DiamondTool;
