import { fabric } from 'fabric';

import { Line } from '../customs/line';
import { AppMouseEvent, ToolStrategy } from '../types';

import { selectTool } from './select-tool';

class LineTool implements ToolStrategy {
  public drawable: boolean = true;
  private startPointer: fabric.Point = new fabric.Point(0, 0);
  private line: Line | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = false;
    this.startPointer = app.pointer;
    this.line = new Line([this.startPointer.x, this.startPointer.y, this.startPointer.x, this.startPointer.y], {
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    app.canvas.add(this.line);
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.line) {
      return;
    }
    const endX = app.pointer.x;
    const endY = app.pointer.y;
    this.line.set({ x2: endX, y2: endY });
    app.render(); // Call render after updating the line
  }

  public onMouseUp({ app }: AppMouseEvent): void {
    app.setTool(selectTool);
    this.startPointer.setXY(0, 0);
    this.line && app.canvas.setActiveObject(this.line);
    this.line = null;
    app.render(true);
  }
}

export const lineTool = new LineTool();

export default lineTool;
