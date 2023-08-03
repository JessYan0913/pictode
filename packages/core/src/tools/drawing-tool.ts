import { Line } from '../customs/line';
import { Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const drawingTool = (): Tool => {
  let points: Point[] = [];
  const line = new Line({
    stroke: 'black',
    strokeWidth: 2,
    globalCompositeOperation: 'source-over',
    lineCap: 'round',
    lineJoin: 'round',
  });

  const flatPoints = (): number[] => points.reduce<number[]>((points, point) => [...points, ...point.toArray()], []);

  return {
    name: 'drawingTool',
    onActive(app) {
      points = [];
      app.cancelSelect();
    },
    onMousedown({ app }): void {
      const lastPoint = points.at(-1);
      if (!lastPoint || !lastPoint.eq(app.pointer)) {
        points.push(app.pointer);
      }
      line.points(flatPoints());
      app.add(line);
    },
    onMousemove({ app, event }): void {
      event.evt.stopPropagation();
      line.points(line.points().concat([app.pointer.x, app.pointer.y]));
    },
    onMouseup({ app }): void {
      app.setTool(selectTool(line));
    },
  };
};

export default drawingTool;
