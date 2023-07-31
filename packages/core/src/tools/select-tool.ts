import Konva from 'konva';

import { Rect } from '../customs/rect';
import { AppMouseEvent, ChildType, Tool } from '../types';
import { Point } from '../utils';

export const selectTool = (...shapes: ChildType[]): Tool => {
  const startPointer = new Point(0, 0);
  const rubberRect = new Rect({
    x: startPointer.x,
    y: startPointer.y,
    width: 0,
    height: 0,
    stroke: 'red',
    dash: [2, 2],
    listening: false,
  });
  let isRubberSelector: boolean = false;

  return {
    name: 'selectTool',
    onActive(app) {
      app.select(...shapes);
      app.add(rubberRect);
    },
    onInactive() {
      rubberRect.destroy();
      startPointer.setXY(0, 0);
    },
    onMouseDown({ app }) {
      isRubberSelector = true;
      startPointer.setXY(app.pointer.x, app.pointer.y);
    },
    onMouseMove({ app }) {
      if (!isRubberSelector) {
        return;
      }
      const position = new Point(Math.min(app.pointer.x, startPointer.x), Math.min(app.pointer.y, startPointer.y));
      const width = Math.max(app.pointer.x, startPointer.x) - position.x;
      const height = Math.max(app.pointer.y, startPointer.y) - position.y;
      rubberRect.setPosition(position);
      rubberRect.width(width);
      rubberRect.height(height);
      rubberRect.visible(true);
    },
    onMouseUp() {
      isRubberSelector = false;
      rubberRect.visible(false);
    },
    onMouseClick({ app, event }: AppMouseEvent) {
      if (event.target instanceof Konva.Stage) {
        app.select();
      } else {
        app.select(event.target);
      }
    },
  };
};

export default selectTool;
