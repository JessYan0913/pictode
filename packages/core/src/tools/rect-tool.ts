import App from '../app';
import { Rect } from '../customs/rect';
import { AppMouseEvent, Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

class RectTool implements Tool {
  public name: string = 'rectTool';
  private startPointer: Point = new Point(0, 0);
  private rectangle: Rect | null = null;

  public onActive(app: App): void {
    app.select();
  }

  public onInactive(): void {
    this.rectangle = null;
    this.startPointer.setXY(0, 0);
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
    this.rectangle.setPosition(
      new Point(Math.min(this.startPointer.x, app.pointer.x), Math.min(this.startPointer.y, app.pointer.y))
    );
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
