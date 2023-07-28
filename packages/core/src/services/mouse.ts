import { Object, Point, TPointerEvent, TPointerEventInfo } from 'fabric';

import { App } from '../app';
import { Service } from '../types';

type IMouseEvent = TPointerEventInfo<TPointerEvent>;

export class MouseService extends Service {
  private event?: IMouseEvent;
  private targets: Object[];

  constructor(app: App) {
    super(app);
    this.targets = [];
    (
      ['onMouseDown', 'onMouseUp', 'onMouseMove', 'onMouseDoubleClick', 'onMouseOver', 'onMouseOut'] as (keyof this)[]
    ).forEach((method) => {
      method = method as keyof MouseService;
      this[method] = (this[method] as Function).bind(this);
    });

    this.app.canvas.on('mouse:down', this.onMouseDown);
    this.app.canvas.on('mouse:up', this.onMouseUp);
    this.app.canvas.on('mouse:move', this.onMouseMove);
    this.app.canvas.on('mouse:dblclick', this.onMouseDoubleClick);
    this.app.canvas.on('mouse:over', this.onMouseOver);
    this.app.canvas.on('mouse:out', this.onMouseOut);
  }

  public get pointer(): Point {
    if (!this.event) {
      return new Point(0, 0);
    }
    return this.event.pointer;
  }

  public toGlobal(point: Point): Point {
    /**
     * 变换矩阵包含了画布的平移、缩放和旋转信息
     * [  a, b, c,  d, e, f]
     *
     * viewportX = canvasX * a + canvasY * c + e
     * viewportY = canvasX * b + canvasY * d + f
     */
    const transformMatrix = this.app.canvas.viewportTransform;
    if (!transformMatrix) {
      return point;
    }
    const x = point.x * transformMatrix[0] + point.y * transformMatrix[2] + transformMatrix[4];
    const y = point.x * transformMatrix[1] + point.y * transformMatrix[3] + transformMatrix[5];
    return new Point(x, y);
  }

  private onMouseDown(event: IMouseEvent): void {
    this.event = event;
    if (!this.app.currentTool) {
      return;
    }
    if (this.app.currentTool.drawable && event.target) {
      this.targets.push(event.target);
      event.target.set({ evented: false });
    }
    if (typeof this.app.currentTool.onMouseDown === 'function') {
      this.app.currentTool.onMouseDown({ event, app: this.app });
    }
  }

  private onMouseUp(event: IMouseEvent): void {
    this.event = event;
    if (!this.app.currentTool) {
      return;
    }
    this.targets.forEach((obj) => {
      obj.set({ evented: true });
    });
    this.targets = [];
    if (typeof this.app.currentTool.onMouseUp === 'function') {
      this.app.currentTool.onMouseUp({ event, app: this.app });
    }
  }

  private onMouseMove(event: IMouseEvent): void {
    this.event = event;
    if (!this.app.currentTool) {
      return;
    }
    if (this.app.currentTool.drawable && event.target) {
      this.targets.push(event.target);
      event.target.set({ evented: false });
    }
    if (typeof this.app.currentTool.onMouseMove === 'function') {
      this.app.currentTool.onMouseMove({ event, app: this.app });
    }
  }

  private onMouseDoubleClick(event: IMouseEvent): void {
    this.event = event;
    if (!this.app.currentTool) {
      return;
    }
    if (typeof this.app.currentTool.onMouseDoubleClick === 'function') {
      this.app.currentTool.onMouseDoubleClick({ event, app: this.app });
    }
  }

  private onMouseOver(event: IMouseEvent): void {
    this.event = event;
  }

  private onMouseOut(event: IMouseEvent): void {
    this.event = event;
  }

  public dispose(): void {
    this.app.canvas.off('mouse:down', this.onMouseDown);
    this.app.canvas.off('mouse:up', this.onMouseUp);
    this.app.canvas.off('mouse:move', this.onMouseMove);
    this.app.canvas.off('mouse:dblclick', this.onMouseDoubleClick);
    this.app.canvas.off('mouse:over', this.onMouseOver);
    this.app.canvas.off('mouse:out', this.onMouseOut);
  }
}
