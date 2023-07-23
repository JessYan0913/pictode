import { fabric } from 'fabric';

import { App } from '../app';
import { Service } from '../types';

type IMouseEvent = fabric.IEvent<MouseEvent>;

type IMouseEventHandler = (event: IMouseEvent) => void;

export class MouseService extends Service {
  private event?: MouseEvent;
  private handleMouseDown: IMouseEventHandler;
  private handleMouseUp: IMouseEventHandler;
  private handleMouseMove: IMouseEventHandler;
  private handleMouseDoubleClick: IMouseEventHandler;

  constructor(app: App) {
    super(app);
    this.handleMouseDown = this.onMouseDown.bind(this);
    this.handleMouseUp = this.onMouseUp.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleMouseDoubleClick = this.onMouseDoubleClick.bind(this);

    this.app.canvas.on('mouse:down', this.handleMouseDown);
    this.app.canvas.on('mouse:up', this.handleMouseUp);
    this.app.canvas.on('mouse:move', this.handleMouseMove);
    this.app.canvas.on('mouse:dblclick', this.handleMouseDoubleClick);
  }

  public get pointer(): fabric.Point {
    if (!this.event) {
      return new fabric.Point(0, 0);
    }
    const { x, y } = this.app.canvas.getPointer(this.event);
    return new fabric.Point(x, y);
  }

  private onMouseDown(event: IMouseEvent): void {
    this.event = event.e;
  }

  private onMouseUp(event: IMouseEvent): void {
    this.event = event.e;
  }

  private onMouseMove(event: IMouseEvent): void {
    this.event = event.e;
  }

  private onMouseDoubleClick(event: IMouseEvent): void {
    this.event = event.e;
  }

  public dispose(): void {
    throw new Error('Method not implemented.');
  }
}
