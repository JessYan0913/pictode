import { Konva, Tool, ToolFactory, ToolHooks, ToolOptions, util } from '@pictode/core';

import { tool as selectTool } from '../select';

export const tool: ToolFactory = (options: ToolOptions, hooks?: ToolHooks): Tool => {
  const startPointer: util.Point = new util.Point(0, 0);
  let ellipse: Konva.Ellipse | null = null;

  return {
    name: 'ellipseTool',
    options,
    hooks,
    active(app) {
      hooks?.onActive?.(app);
      app.cancelSelect();
    },
    inactive(app) {
      hooks?.onInactive?.(app);
    },
    mousedown({ app }): void {
      if (ellipse) {
        return;
      }
      startPointer.clone(app.pointer);
      ellipse = new Konva.Ellipse({
        radiusX: 0,
        radiusY: 0,
        strokeScaleEnabled: false,
        ...options,
      });
      ellipse.setPosition(startPointer);
      ellipse.radius(new util.Point(0, 0));
      app.add(ellipse);
    },
    mousemove({ app }): void {
      if (!ellipse) {
        return;
      }
      // 计算起点和当前鼠标位置之间的距离
      const dx = app.pointer.x - startPointer.x;
      const dy = app.pointer.y - startPointer.y;

      // 计算椭圆的宽度和高度的绝对值
      const radius = new util.Point(Math.abs(dx) / 2, Math.abs(dy) / 2);
      // 根据起点和鼠标位置计算椭圆的中心位置
      ellipse.setPosition(new util.Point(startPointer.x + dx / 2, startPointer.y + dy / 2));
      ellipse.radius(radius);
      app.render();
    },
    mouseup({ app }): void {
      if (ellipse) {
        app.setTool(selectTool(ellipse));
      }
      ellipse = null;
    },
  };
};

export default tool;
