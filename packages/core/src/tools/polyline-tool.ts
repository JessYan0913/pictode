import { Point } from 'fabric';

import { PPolyline } from '../customs/polyline';
import { AppMouseEvent, Tool } from '../types';

import { selectTool } from './select-tool';

class PolylineTool implements Tool {
  public name: string = 'polylineTool';
  public drawable: boolean = true;
  private points: Point[] = [];
  private polyline: PPolyline | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = false;
    const lastPoint = this.points.at(-1);
    if (!lastPoint || !lastPoint.eq(app.pointer)) {
      this.points.push(app.pointer);
    }
    if (this.polyline) {
      this.polyline.set({ points: this.points });
    } else {
      this.polyline = new PPolyline(this.points, {
        id: Date.now().toString(),
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
      });
      app.canvas.add(this.polyline);
    }
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.polyline) {
      return;
    }
    this.polyline.set({ points: this.points.concat(app.pointer) });
    app.render();
  }

  public onMouseDoubleClick({ app }: AppMouseEvent) {
    app.setTool(selectTool);

    if (this.polyline) {
      app.canvas.setActiveObject(this.polyline);
    }

    this.points = [];
    this.polyline = null;
    app.render(true);
  }
}

export const polylineTool = new PolylineTool();

export default polylineTool;
