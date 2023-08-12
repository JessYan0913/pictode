import { Line } from '../customs/line';
import { Tool } from '../types';
import { Point } from '../utils';

import selectTool from './select-tool';

const flatPoints = (points: Point[]): number[] =>
  points.reduce<number[]>((points, point) => [...points, ...point.toArray()], []);

export const lineTool = (): Tool => {
  let points: Point[] = [];
  let line: Line | null = null;

  return {
    name: 'lineTool',
    onActive(app) {
      points = [];
      app.cancelSelect();
    },
    onMousedown({ app }): void {
      if (!line) {
        line = new Line({
          points: flatPoints(points),
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
      line.points(flatPoints(points));
    },
    onMousemove({ app }): void {
      if (!line) {
        return;
      }
      line.points(flatPoints(points).concat(app.pointer.x, app.pointer.y));
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

export default lineTool;
