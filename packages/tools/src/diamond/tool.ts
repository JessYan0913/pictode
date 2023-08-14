import { Konva, Tool, util } from '@pictode/core';

import { tool as selectTool } from '../select';

export interface DiamondToolOptions {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

export const tool = (options: DiamondToolOptions): Tool => {
  const startPointer: util.Point = new util.Point(0, 0);
  let regularPolygon: Konva.RegularPolygon | null = null;

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
      regularPolygon = new Konva.RegularPolygon({
        sides: 4,
        radius: 0,
        strokeScaleEnabled: false,
        ...options,
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
      const newPosition = new util.Point(startPointer.x + dx / 2, startPointer.y + dy / 2);

      regularPolygon.setPosition(newPosition);
      regularPolygon.radius(newPosition.distanceTo(app.pointer));
      app.render();
    },
    onMouseup({ app }) {
      if (regularPolygon) {
        app.setTool(selectTool(regularPolygon));
      }
      regularPolygon = null;
    },
  };
};

export default tool;
