import { fabric } from 'fabric';

import { Rect } from '../customs/rect';
import { AppMouseEvent, ToolStrategy } from '../types';

import { selectTool } from './select-tool';

class RectTool implements ToolStrategy {
  private startPointer: fabric.Point = new fabric.Point(0, 0);
  private rectangle: Rect | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.discardActiveObject();
    app.canvas.selection = false;
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
    const activeObject = app.canvas.getActiveObject();

    app.canvas.forEachObject((obj) => {
      if (obj !== activeObject) {
        obj.set({
          evented: false,
        });
      }
    });

    app.canvas.renderAll();
    if (!this.rectangle) {
      return;
    }
    const width = app.pointer.x - this.startPointer.x;
    const height = app.pointer.y - this.startPointer.y;
    this.rectangle.set({ width, height });
    app.render();
  }

  public onMouseUp({ app }: AppMouseEvent): void {
    app.canvas.forEachObject((obj) => {
      obj.set({
        evented: true,
      });
    });
    app.setTool(selectTool);
    this.startPointer.setXY(0, 0);
    this.rectangle && app.canvas.setActiveObject(this.rectangle);
    this.rectangle = null;
    app.render(true);
  }
}

export const rectTool = new RectTool();

export default rectTool;
