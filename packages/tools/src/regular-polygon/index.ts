import { Konva, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

export interface RegularPolygonToolOptions {
  config?: Partial<Konva.RegularPolygonConfig>;
  hooks?: ToolHooks;
}

export class RegularPolygonTool implements Tool<Partial<Konva.RegularPolygonConfig>> {
  public name = 'regularPolygonTool';
  public hooks?: ToolHooks;
  public config?: Partial<Konva.RegularPolygonConfig>;
  private regularPolygon: Konva.RegularPolygon | null = null;
  private startPointer: util.Point = new util.Point(0, 0);

  constructor({ config, hooks }: RegularPolygonToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousedown({ app }: ToolEvent) {
    if (this.regularPolygon) {
      return;
    }
    this.startPointer.clone(app.pointer);
    this.regularPolygon = new Konva.RegularPolygon({
      sides: 4,
      radius: 0,
      strokeScaleEnabled: false,
      ...this.config,
    });
    console.log('====>', this.config);

    this.regularPolygon.setPosition(this.startPointer);
    app.add(this.regularPolygon);
    this.hooks?.onStartDrawing?.(app, this.regularPolygon);
  }

  public mousemove({ app }: ToolEvent) {
    if (!this.regularPolygon) {
      return;
    }
    const dx = app.pointer.x - this.startPointer.x;
    const dy = app.pointer.y - this.startPointer.y;
    const newPosition = new util.Point(this.startPointer.x + dx / 2, this.startPointer.y + dy / 2);

    this.regularPolygon.setPosition(newPosition);
    this.regularPolygon.radius(newPosition.distanceTo(app.pointer));
    app.render();
  }

  public mouseup({ app, pointer }: ToolEvent) {
    if (!this.regularPolygon) {
      return;
    }
    if (this.startPointer.eq(pointer)) {
      this.regularPolygon?.destroy();
      this.regularPolygon = null;
      return;
    }
    this.hooks?.onCompleteDrawing?.(app, this.regularPolygon);
    this.regularPolygon = null;
    this.startPointer.setXY(0, 0);
  }

  public enableChanged(): void {
    this.regularPolygon = null;
    this.startPointer.setXY(0, 0);
  }
}

export default RegularPolygonTool;
