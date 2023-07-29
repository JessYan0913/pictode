import { Line } from '../customs/line';
import { AppMouseEvent, Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const lineTool = (): Tool => {
  let points: Point[] = [];
  let line: Line | null = null;

  const flatPoints = (): number[] => points.reduce<number[]>((points, point) => [...points, ...point.toArray()], []);

  return {
    name: 'lineTool',
    onActive(app) {
      app.select();
    },
    onInactive() {
      line = null;
      points = [];
    },
    onMouseDown({ app }: AppMouseEvent): void {
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
    onMouseMove({ app }: AppMouseEvent): void {
      if (!line) {
        return;
      }
      line.points(flatPoints().concat(app.pointer.x, app.pointer.y));
      app.render();
    },
    onMouseDoubleClick({ app }: AppMouseEvent): void {
      if (!line) {
        return;
      }
      app.select(line);
      app.setTool(selectTool());
    },
  };
};

export default lineTool;
