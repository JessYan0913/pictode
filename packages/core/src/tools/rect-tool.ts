import { Rect } from '../customs/rect';
import { AppMouseEvent, Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const rectTool = (): Tool => {
  const startPointer: Point = new Point(0, 0);
  const rectangle: Rect = new Rect({
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: 2,
  });

  return {
    name: 'rectTool',
    onActive(app) {
      app.cancelSelect();
    },
    onInactive() {
      startPointer.setXY(0, 0);
    },
    onMouseDown({ app }: AppMouseEvent): void {
      startPointer.clone(app.pointer);
      rectangle.setPosition(startPointer);
      rectangle.width(0);
      rectangle.height(0);
      app.add(rectangle);
    },
    onMouseMove({ app }: AppMouseEvent): void {
      rectangle.setPosition(
        new Point(Math.min(startPointer.x, app.pointer.x), Math.min(startPointer.y, app.pointer.y))
      );
      rectangle.width(Math.abs(app.pointer.x - startPointer.x));
      rectangle.height(Math.abs(app.pointer.y - startPointer.y));
      app.render();
    },
    onMouseUp({ app }: AppMouseEvent): void {
      app.setTool(selectTool(rectangle));
    },
  };
};

export default rectTool;
