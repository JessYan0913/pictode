import { RegularPolygon } from '../customs/regular-polygon';
import { Tool } from '../types';
import { Point } from '../utils';

export const regularPolygonTool = (): Tool => {
  const startPointer: Point = new Point(0, 0);
  let regularPolygon: RegularPolygon | null = null;

  return {
    name: 'regularPolygonTool',
    onActive(app) {
      app.cancelSelect();
    },
    onMousedown({ app }) {
      if (regularPolygon) {
        return;
      }
      startPointer.clone(app.pointer);
      regularPolygon = new RegularPolygon({
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
        sides: 4,
        radius: 0,
        strokeScaleEnabled: false,
      });
      regularPolygon.radius(0);
      regularPolygon.setPosition(startPointer);
      app.add(regularPolygon);
    },
    onMousemove({ app }) {
      if (!regularPolygon) {
        return;
      }
      const dx = app.pointer.x - startPointer.x;
      const dy = app.pointer.y - startPointer.y;
      const newPosition = new Point(startPointer.x + dx / 2, startPointer.y + dy / 2);

      regularPolygon.setPosition(newPosition);
      regularPolygon.radius(newPosition.distanceTo(app.pointer));
      app.render();
    },
    onMouseup() {
      regularPolygon = null;
    },
  };
};

export default regularPolygonTool;
