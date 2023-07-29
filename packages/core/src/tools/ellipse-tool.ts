import { Ellipse } from '../customs/ellipse';
import { AppMouseEvent, Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const ellipseTool = (): Tool => {
  let startPointer: Point = new Point(0, 0);
  let ellipse: Ellipse | null = null;

  return {
    name: 'ellipseTool',
    onActive(app) {
      app.select();
    },
    onInactive() {
      ellipse = null;
      startPointer.setXY(0, 0);
    },
    onMouseDown({ app }: AppMouseEvent): void {
      startPointer = app.pointer;
      ellipse = new Ellipse({
        x: startPointer.x,
        y: startPointer.y,
        radiusX: 0,
        radiusY: 0,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
      });
      app.add(ellipse);
    },
    onMouseMove({ app }: AppMouseEvent): void {
      if (!ellipse) {
        return;
      }
      // 计算起点和当前鼠标位置之间的距离
      const dx = app.pointer.x - startPointer.x;
      const dy = app.pointer.y - startPointer.y;

      // 计算椭圆的宽度和高度的绝对值
      const radiusX = Math.abs(dx) / 2;
      const radiusY = Math.abs(dy) / 2;

      // 根据起点和鼠标位置计算椭圆的中心位置
      ellipse.setPosition(new Point(startPointer.x + dx / 2, startPointer.y + dy / 2));
      ellipse.radiusX(radiusX);
      ellipse.radiusY(radiusY);
      app.render();
    },
    onMouseUp({ app }: AppMouseEvent): void {
      if (!ellipse) {
        return;
      }
      app.setTool(selectTool(ellipse));
    },
  };
};

export default ellipseTool;
