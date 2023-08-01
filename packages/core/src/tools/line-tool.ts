import { Line } from '../customs/line';
import { Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const lineTool = (): Tool => {
  let points: Point[] = [];
  let line: Line | null = null;

  const flatPoints = (): number[] => points.reduce<number[]>((points, point) => [...points, ...point.toArray()], []);

  return {
    name: 'lineTool',
    onActive(app) {
      app.cancelSelect();
    },
    onInactive() {
      line = null;
      points = [];
    },
    onMouseDown({ app }): void {
      const lastPoint = points.at(-1);
      if (!lastPoint || !lastPoint.eq(app.pointer)) {
        points.push(app.pointer);
      }
      if (line) {
        line.points(flatPoints());
      } else {
        line = new Line({
          points: flatPoints(),
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 2,
        });
        app.add(line);
      }
    },
    onMouseMove({ app }): void {
      if (!line) {
        return;
      }
      line.points(flatPoints().concat(app.pointer.x, app.pointer.y));
      app.render();
    },
    onMouseDoubleClick({ app }): void {
      if (!line) {
        return;
      }
      app.setTool(selectTool(line));
    },
  };
};

export default lineTool;
