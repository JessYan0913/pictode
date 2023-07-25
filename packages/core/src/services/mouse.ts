import { fabric } from 'fabric';

import { App } from '../app';
import { Service } from '../types';

type IMouseEvent = fabric.IEvent<Event>;

type IMouseEventHandler = (event: IMouseEvent) => void;

export class MouseService extends Service {
  private event?: Event;
  private targets: fabric.Object[];
  private handleMouseDown: IMouseEventHandler;
  private handleMouseUp: IMouseEventHandler;
  private handleMouseMove: IMouseEventHandler;
  private handleMouseDoubleClick: IMouseEventHandler;
  private handleMouseOver: IMouseEventHandler;
  private handleMouseOut: IMouseEventHandler;

  constructor(app: App) {
    super(app);
    this.targets = [];
    this.handleMouseDown = this.onMouseDown.bind(this);
    this.handleMouseUp = this.onMouseUp.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleMouseDoubleClick = this.onMouseDoubleClick.bind(this);
    this.handleMouseOver = this.onMouseOver.bind(this);
    this.handleMouseOut = this.onMouseOut.bind(this);

    this.app.canvas.on('mouse:down', this.handleMouseDown);
    this.app.canvas.on('mouse:up', this.handleMouseUp);
    this.app.canvas.on('mouse:move', this.handleMouseMove);
    this.app.canvas.on('mouse:dblclick', this.handleMouseDoubleClick);
    this.app.canvas.on('mouse:over', this.handleMouseOver);
    this.app.canvas.on('mouse:out', this.handleMouseOut);
  }

  public get pointer(): fabric.Point {
    if (!this.event) {
      return new fabric.Point(0, 0);
    }
    const { x, y } = this.app.canvas.getPointer(this.event);
    return new fabric.Point(x, y);
  }

  public toGlobal(point: fabric.Point): fabric.Point {
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
    return new fabric.Point(x, y);
  }

  private onMouseDown(event: IMouseEvent): void {
    this.event = event.e;
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
    this.event = event.e;
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
    this.event = event.e;
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
    this.event = event.e;
    if (!this.app.currentTool) {
      return;
    }
    if (typeof this.app.currentTool.onMouseDoubleClick === 'function') {
      this.app.currentTool.onMouseDoubleClick({ event, app: this.app });
    }
  }

  private onMouseOver(event: IMouseEvent): void {
    this.event = event.e;
  }

  private onMouseOut(event: IMouseEvent): void {
    this.event = event.e;
  }

  public dispose(): void {
    this.app.canvas.off('mouse:down', this.handleMouseDown);
    this.app.canvas.off('mouse:up', this.handleMouseUp);
    this.app.canvas.off('mouse:move', this.handleMouseMove);
    this.app.canvas.off('mouse:dblclick', this.handleMouseDoubleClick);
    this.app.canvas.off('mouse:over', this.handleMouseOver);
    this.app.canvas.off('mouse:out', this.handleMouseOut);
  }
}
