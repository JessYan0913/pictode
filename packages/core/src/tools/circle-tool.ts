import { fabric } from 'fabric';

import { Circle } from '../customs/circle';
import { AppMouseEvent, ToolStrategy } from '../types';

import { selectTool } from './select-tool';

class CircleTool implements ToolStrategy {
  private startPointer: fabric.Point = new fabric.Point(0, 0);
  private circle: Circle | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = false;
    this.startPointer = app.pointer;
    this.circle = new Circle({
      left: this.startPointer.x,
      top: this.startPointer.y,
      rx: 0,
      ry: 0,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    app.canvas.add(this.circle);
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.circle) {
      return;
    }
    app.canvas.discardActiveObject();
    app.render();

    // 计算起点和当前鼠标位置之间的距离
    const dx = app.pointer.x - this.startPointer.x;
    const dy = app.pointer.y - this.startPointer.y;

    // 计算椭圆的宽度和高度的绝对值
    const radiusX = Math.abs(dx) / 2;
    const radiusY = Math.abs(dy) / 2;

    // 根据起点和鼠标位置计算椭圆的中心位置
    const centerX = this.startPointer.x + dx / 2;
    const centerY = this.startPointer.y + dy / 2;

    this.circle.set({ rx: radiusX, ry: radiusY, left: centerX - radiusX, top: centerY - radiusY });
    app.render();
  }

  public onMouseUp({ app }: AppMouseEvent): void {
    app.setTool(selectTool);
    this.startPointer.setXY(0, 0);
    this.circle && app.canvas.setActiveObject(this.circle);
    this.circle = null;
    app.render(true);
  }
}

export const circleTool = new CircleTool();

export default circleTool;
