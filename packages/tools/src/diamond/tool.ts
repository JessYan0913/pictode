import { Konva, Tool, ToolOptions, util } from '@pictode/core';

import { tool as selectTool } from '../select';

export const tool = (options: ToolOptions): Tool => {
  const startPointer: util.Point = new util.Point(0, 0);
  let regularPolygon: Konva.RegularPolygon | null = null;

  return {
    name: 'diamondTool',
    options,
    hooks: {
      onActive(app) {
        app.cancelSelect();
      },
    },
    mousedown({ app }) {
      if (regularPolygon) {
        return;
      }
      startPointer.clone(app.pointer);
      regularPolygon = new Konva.RegularPolygon({
        sides: 4,
        radius: 0,
        strokeScaleEnabled: false,
        ...this.options,
      });
      regularPolygon.radius(0);
      regularPolygon.setPosition(startPointer);
      app.add(regularPolygon);
    },
    mousemove({ app }) {
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
    mouseup({ app }) {
      if (regularPolygon) {
        app.setTool(selectTool(regularPolygon));
        regularPolygon = null;
      }
    },
  };
};

export default tool;
