import { Ellipse } from '../customs/ellipse';
import { AppMouseEvent, Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const ellipseTool = (): Tool => {
  const startPointer: Point = new Point(0, 0);
  const ellipse: Ellipse = new Ellipse({
    radiusX: 0,
    radiusY: 0,
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: 2,
  });

  return {
    name: 'ellipseTool',
    onActive(app) {
      app.select();
    },
    onInactive() {
      startPointer.setXY(0, 0);
    },
    onMouseDown({ app }: AppMouseEvent): void {
      startPointer.clone(app.pointer);
      ellipse.setPosition(startPointer);
      ellipse.radius(new Point(0, 0));
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
      const radius = new Point(Math.abs(dx) / 2, Math.abs(dy) / 2);
      // 根据起点和鼠标位置计算椭圆的中心位置
      ellipse.setPosition(new Point(startPointer.x + dx / 2, startPointer.y + dy / 2));
      ellipse.radius(radius);
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
