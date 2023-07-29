import Konva from 'konva';

import { Rect } from '../customs/rect';
import { AppMouseEvent, Tool } from '../types';

import { selectTool } from './select-tool';

class RectTool implements Tool {
  public name: string = 'rectTool';
  private startPointer: Konva.Vector2d = { x: 0, y: 0 };
  private rectangle: Rect | null = null;

  public onActive(): void {
    this.startPointer = { x: 0, y: 0 };
  }

  public onInactive(): void {
    this.rectangle = null;
    this.startPointer = { x: 0, y: 0 };
  }

  public onMouseDown({ app }: AppMouseEvent): void {
    this.startPointer = app.pointer;
    this.rectangle = new Rect({
      x: this.startPointer.x,
      y: this.startPointer.y,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    app.add(this.rectangle);
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.rectangle) {
      return;
    }
    this.rectangle.x(Math.min(this.startPointer.x, app.pointer.x));
    this.rectangle.y(Math.min(this.startPointer.y, app.pointer.y));
    this.rectangle.width(Math.abs(app.pointer.x - this.startPointer.x));
    this.rectangle.height(Math.abs(app.pointer.y - this.startPointer.y));
    app.render();
  }

  public onMouseUp({ app }: AppMouseEvent): void {
    if (!this.rectangle) {
      return;
    }
    app.select(this.rectangle);
    app.setTool(selectTool);
  }
}

export const rectTool = new RectTool();

export default rectTool;
