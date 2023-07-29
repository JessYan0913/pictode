import App from '../app';
import { Ellipse } from '../customs/ellipse';
import { AppMouseEvent, Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

class EllipseTool implements Tool {
  public name: string = 'ellipseTool';
  private startPointer: Point = new Point(0, 0);
  private ellipse: Ellipse | null = null;

  public onActive(app: App): void {
    app.select();
  }

  public onInactive(): void {
    this.ellipse = null;
    this.startPointer.setXY(0, 0);
  }

  public onMouseDown({ app }: AppMouseEvent): void {
    this.startPointer = app.pointer;
    this.ellipse = new Ellipse({
      x: this.startPointer.x,
      y: this.startPointer.y,
      radiusX: 0,
      radiusY: 0,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    app.add(this.ellipse);
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.ellipse) {
      return;
    }
    // 计算起点和当前鼠标位置之间的距离
    const dx = app.pointer.x - this.startPointer.x;
    const dy = app.pointer.y - this.startPointer.y;

    // 计算椭圆的宽度和高度的绝对值
    const radiusX = Math.abs(dx) / 2;
    const radiusY = Math.abs(dy) / 2;

    // 根据起点和鼠标位置计算椭圆的中心位置
    const centerX = this.startPointer.x + dx / 2;
    const centerY = this.startPointer.y + dy / 2;
    this.ellipse.x(centerX);
    this.ellipse.y(centerY);
    this.ellipse.radiusX(radiusX);
    this.ellipse.radiusY(radiusY);
    app.render();
  }

  public onMouseUp({ app }: AppMouseEvent): void {
    if (!this.ellipse) {
      return;
    }
    app.select(this.ellipse);
    app.setTool(selectTool);
  }
}

export const ellipseTool = new EllipseTool();

export default ellipseTool;
