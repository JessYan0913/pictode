import { RegularPolygon } from '../customs/regular-polygon';
import { Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const regularPolygonTool = (): Tool => {
  const startPointer: Point = new Point(0, 0);
  const regularPolygon: RegularPolygon = new RegularPolygon({
    fill: 'transparent',
    stroke: 'black',
    strokeWidth: 2,
    sides: 4,
    radius: 0,
  });

  return {
    name: 'regularPolygonTool',
    onActive(app) {
      app.cancelSelect();
    },
    onInactive() {
      startPointer.setXY(0, 0);
    },
    onMouseDown({ app }) {
      startPointer.clone(app.pointer);
      regularPolygon.radius(0);
      regularPolygon.setPosition(startPointer);
      app.add(regularPolygon);
    },
    onMouseMove({ app }) {
      const dx = app.pointer.x - startPointer.x;
      const dy = app.pointer.y - startPointer.y;
      const newPosition = new Point(startPointer.x + dx / 2, startPointer.y + dy / 2);

      regularPolygon.setPosition(newPosition);
      regularPolygon.radius(newPosition.distanceTo(app.pointer));
      app.render();
    },
    onMouseUp({ app }) {
      app.setTool(selectTool(regularPolygon));
    },
  };
};

export default regularPolygonTool;
