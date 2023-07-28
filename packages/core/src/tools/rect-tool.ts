import { Point } from 'fabric';

import { PRect } from '../customs/rect';
import { AppMouseEvent, Tool } from '../types';

import { selectTool } from './select-tool';

class RectTool implements Tool {
  public name: string = 'rectTool';
  public drawable: boolean = true;
  private startPointer: Point = new Point(0, 0);
  private rectangle: PRect | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = false;
    this.startPointer = app.pointer;
    this.rectangle = new PRect({
      id: Date.now().toString(),
      left: this.startPointer.x,
      top: this.startPointer.y,
      width: 10,
      height: 10,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    this.rectangle.set({ id: Date.now() });
    app.canvas.add(this.rectangle);
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.rectangle) {
      return;
    }

    const width = Math.abs(app.pointer.x - this.startPointer.x);
    const height = Math.abs(app.pointer.y - this.startPointer.y);
    const left = Math.min(this.startPointer.x, app.pointer.x);
    const top = Math.min(this.startPointer.y, app.pointer.y);

    this.rectangle.set({ left, top, width, height });
    app.render();
  }

  public onMouseUp({ app }: AppMouseEvent): void {
    app.setTool(selectTool);
    this.startPointer.setXY(0, 0);
    if (this.rectangle) {
      app.canvas.setActiveObject(this.rectangle);
    }
    this.rectangle = null;
    app.render(true);
  }
}

export const rectTool = new RectTool();

export default rectTool;
