import Konva from 'konva';

import { Rect } from '../customs/rect';
import { AppMouseEvent, Tool } from '../types';

class RectTool implements Tool {
  public name: string = 'rectTool';
  public drawable: boolean = true;
  private startPointer: Konva.Vector2d = { x: 0, y: 0 };
  private rectangle: Rect | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    this.startPointer = app.pointer;
    this.rectangle = new Rect({
      x: this.startPointer?.x,
      y: this.startPointer?.y,
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
    this.startPointer = { x: 0, y: 0 };
    if (this.rectangle) {
      let tr = new Konva.Transformer();
      app.add(tr);
      tr.nodes([this.rectangle]);
    }
    this.rectangle = null;
  }
}

export const rectTool = new RectTool();

export default rectTool;
