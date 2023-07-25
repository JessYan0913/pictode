import { fabric } from 'fabric';

import { Polyline } from '../customs/polyline';
import { AppMouseEvent, ToolStrategy } from '../types';

import { selectTool } from './select-tool';

class PolylineTool implements ToolStrategy {
  public drawable: boolean = true;
  private points: fabric.Point[] = [];
  private polyline: Polyline | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = false;
    this.points.push(app.pointer);
    this.polyline = new Polyline(this.points, {
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    app.canvas.add(this.polyline);
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.polyline) {
      return;
    }
    app.canvas.discardActiveObject();
    app.render();
    const pointer = app.pointer;
    const points = this.points.concat(pointer);
    this.polyline.set({ points });
    app.render(); // Call render after updating the polyline
  }

  public onMouseUp({ app, event }: AppMouseEvent): void {
    app.setTool(selectTool);
    if (this.polyline) {
      // Use setTimeout to delay the selection after the fabric.js selection process is done
      setTimeout(() => {
        app.canvas.setActiveObject(this.polyline!, event.e);
      }, 10);
    }

    this.points = [];
    this.polyline = null;
    app.render(true);
  }
}

export const polylineTool = new PolylineTool();

export default polylineTool;
