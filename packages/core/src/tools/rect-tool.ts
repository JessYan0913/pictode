import { fabric } from 'fabric';

import { Rect } from '../customs/rect';
import { AppMouseEvent, ToolStrategy } from '../types';

export class RectTool implements ToolStrategy {
  private startPointer: fabric.Point = new fabric.Point(0, 0);
  private rectangle: Rect | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    this.startPointer = app.pointer;
    this.rectangle = new Rect({
      left: this.startPointer.x,
      top: this.startPointer.y,
      width: 10,
      height: 10,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    app.canvas.add(this.rectangle);
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.rectangle) {
      return;
    }
    app.canvas.discardActiveObject();
    app.render();
    const width = app.pointer.x - this.startPointer.x;
    const height = app.pointer.y - this.startPointer.y;
    this.rectangle.set({ width, height });
    app.render();
  }

  public onMouseUp(): void {
    this.rectangle = null;
  }
}

export default RectTool;
