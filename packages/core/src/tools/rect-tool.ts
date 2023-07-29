import { Rect } from '../customs/rect';
import { AppMouseEvent, Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const rectTool = (): Tool => {
  let startPointer: Point = new Point(0, 0);
  let rectangle: Rect | null = null;

  return {
    name: 'rectTool',
    onActive(app) {
      app.select();
    },
    onInactive() {
      rectangle = null;
      startPointer.setXY(0, 0);
    },
    onMouseDown({ app }: AppMouseEvent): void {
      startPointer = app.pointer;
      rectangle = new Rect({
        x: startPointer.x,
        y: startPointer.y,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
      });
      app.add(rectangle);
    },
    onMouseMove({ app }: AppMouseEvent): void {
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
    onMouseUp({ app }: AppMouseEvent): void {
      if (!rectangle) {
        return;
      }
      app.select(rectangle);
      app.setTool(selectTool());
    },
  };
};

export default rectTool;
