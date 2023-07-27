import { Point } from 'fabric';

import { PTriangle } from '../customs/triangle';
import { AppMouseEvent, Tool } from '../types';

import { selectTool } from './select-tool';

class TriangleTool implements Tool {
  public name: string = 'triangleTool';
  public drawable: boolean = true;
  private startPointer: Point = new Point(0, 0);
  private triangle: PTriangle | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = false;
    this.startPointer = app.pointer;
    this.triangle = new PTriangle({
      top: this.startPointer.y,
      left: this.startPointer.x,
      width: 0,
      height: 0,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    app.canvas.add(this.triangle);
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.triangle) {
      return;
    }
    const width = Math.abs(app.pointer.x - this.startPointer.x);
    const height = Math.abs(app.pointer.y - this.startPointer.y);
    this.triangle.set({ width, height });
    app.render(); // Call render after updating the triangle
  }

  public onMouseUp({ app }: AppMouseEvent): void {
    app.setTool(selectTool);
    this.startPointer.setXY(0, 0);
    if (this.triangle) {
      app.canvas.setActiveObject(this.triangle);
    }
    this.triangle = null;
    app.render(true);
  }
}

export const triangleTool = new TriangleTool();

export default triangleTool;
