import { Konva, Tool, util } from '@pictode/core';

import { tool as selectTool } from '../select';

export const tool = (): Tool => {
  let points: util.Point[] = [];
  let line: Konva.Line | null = null;

  return {
    name: 'lineTool',
    onActive(app) {
      points = [];
      app.cancelSelect();
    },
    onMousedown({ app }): void {
      if (!line) {
        line = new Konva.Line({
          points: util.flatPoints(points),
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 2,
          strokeScaleEnabled: false,
        });
        app.add(line);
      }
      const lastPoint = points.at(-1);
      if (!lastPoint || !lastPoint.eq(app.pointer)) {
        points.push(app.pointer);
      }
      line.points(util.flatPoints(points));
    },
    onMousemove({ app }): void {
      if (!line) {
        return;
      }
      line.points(util.flatPoints(points).concat(app.pointer.x, app.pointer.y));
      app.render();
    },
    onDoubleClick({ app }): void {
      if (line) {
        app.setTool(selectTool(line));
      }
      line = null;
      points = [];
    },
  };
};

export default tool;
