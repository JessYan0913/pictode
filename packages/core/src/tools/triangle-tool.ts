import { Triangle } from '../customs/triangle';
import { Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const triangleTool = (): Tool => {
  const startPointer: Point = new Point(0, 0);
  const triangle: Triangle = new Triangle({
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: 2,
    sides: 3,
    radius: 0,
  });

  return {
    name: 'triangleTool',
    onActive(app) {
      app.cancelSelect();
    },
    onInactive() {
      startPointer.setXY(0, 0);
    },
    onMouseDown({ app }) {
      startPointer.clone(app.pointer);
      triangle.setPosition(startPointer);
      app.add(triangle);
    },
    onMouseMove({ app }) {
      // 计算起点和当前鼠标位置之间的距离
      const dx = app.pointer.x - startPointer.x;
      const dy = app.pointer.y - startPointer.y;

      // 计算椭圆的宽度和高度的绝对值
      triangle.setPosition(new Point(startPointer.x + dx / 2, startPointer.y + dy / 2));
      triangle.radius(startPointer.distanceTo(app.pointer));
      app.render();
    },
    onMouseUp({ app }) {
      app.setTool(selectTool(triangle));
    },
  };
};

export default triangleTool;
