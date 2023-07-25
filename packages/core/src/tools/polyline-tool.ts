import { fabric } from 'fabric';

import { Polyline } from '../customs/polyline';
import { AppMouseEvent, Tool } from '../types';

import { selectTool } from './select-tool';

class PolylineTool implements Tool {
  public name: string = 'polylineTool';
  public drawable: boolean = true;
  private points: fabric.Point[] = [];
  private polyline: Polyline | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = false;
    const lastPoint = this.points.at(-1);
    if (!lastPoint || !lastPoint.eq(app.pointer)) {
      this.points.push(app.pointer);
    }
    if (!this.polyline) {
      this.polyline = new Polyline(this.points, {
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
      });
      app.canvas.add(this.polyline);
    } else {
      this.polyline.set({ points: this.points });
    }
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.polyline) {
      return;
    }
    this.polyline.set({ points: this.points.concat(app.pointer) });
    app.render(); // Call render after updating the polyline
  }

  public onMouseDoubleClick({ app }: AppMouseEvent) {
    app.setTool(selectTool);

    if (this.polyline) {
      console.log('====>', this.polyline.points, this.points);

      app.canvas.setActiveObject(this.polyline);
    }

    this.points = [];
    this.polyline = null;
    app.render(true);
  }
}

export const polylineTool = new PolylineTool();

export default polylineTool;
