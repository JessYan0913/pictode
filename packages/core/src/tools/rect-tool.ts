import { Rect } from '../customs/rect';
import { Tool } from '../types';
import { Point } from '../utils';

import selectTool from './select-tool';

export interface RectToolOptions {
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  opacity: number;
}

export const rectTool = (options: RectToolOptions): Tool => {
  const startPointer: Point = new Point(0, 0);
  let rectangle: Rect | null = null;

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
      rectangle = new Rect({
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
        new Point(Math.min(startPointer.x, app.pointer.x), Math.min(startPointer.y, app.pointer.y))
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

export default rectTool;
