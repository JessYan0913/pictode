import { Rect } from '../customs/rect';
import { Tool } from '../types';
import { Point } from '../utils';

export const rectTool = (): Tool => {
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
        fill: 'rgba(256, 256, 256, 0)',
        stroke: 'rgba(0, 0, 0, 1)',
        strokeWidth: 1,
        strokeScaleEnabled: false,
        cornerRadius: 10,
        opacity: 1,
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
    onMouseup(): void {
      rectangle = null;
    },
  };
};

export default rectTool;
