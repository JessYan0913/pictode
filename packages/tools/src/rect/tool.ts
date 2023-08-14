import { Konva, Tool, util } from '@pictode/core';

import { tool as selectTool } from '../select';

export interface RectToolOptions {
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  opacity: number;
}

export const tool = (options: RectToolOptions): Tool => {
  const startPointer: util.Point = new util.Point(0, 0);
  let rectangle: Konva.Rect | null = null;

  return {
    name: 'rectTool',
    onActive(app) {
      app.cancelSelect();
    },
    onMousedown({ app }): void {
      if (rectangle) {
        return;
      }
      startPointer.clone(app.pointer);
      rectangle = new Konva.Rect({
        strokeScaleEnabled: false,
        ...options,
      });
      rectangle.setPosition(startPointer);
      rectangle.width(0);
      rectangle.height(0);
      app.add(rectangle);
    },
    onMousemove({ app }): void {
      if (!rectangle) {
        return;
      }
      rectangle.setPosition(
        new util.Point(Math.min(startPointer.x, app.pointer.x), Math.min(startPointer.y, app.pointer.y))
      );
      rectangle.width(Math.abs(app.pointer.x - startPointer.x));
      rectangle.height(Math.abs(app.pointer.y - startPointer.y));
      app.render();
    },
    onMouseup({ app }): void {
      if (rectangle) {
        app.setTool(selectTool(rectangle));
      }
      rectangle = null;
    },
  };
};

export default tool;
