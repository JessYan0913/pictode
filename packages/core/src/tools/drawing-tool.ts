import { Line } from '../customs/line';
import { Tool } from '../types';
import { Point } from '../utils';

const flatPoints = (points: Point[]): number[] =>
  points.reduce<number[]>((points, point) => [...points, ...point.toArray()], []);

export const drawingTool = (): Tool => {
  let points: Point[] = [];
  let line: Line | null = null;

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
      if (!line) {
        line = new Line({
          points: flatPoints(points),
          stroke: 'black',
          strokeWidth: 2,
          globalCompositeOperation: 'source-over',
          lineCap: 'round',
          lineJoin: 'round',
          strokeScaleEnabled: false,
        });
        app.add(line);
      }
    },
    onMousemove({ app, event }): void {
      if (!line) {
        return;
      }
      event.evt.stopPropagation();
      line.points(line.points().concat([app.pointer.x, app.pointer.y]));
    },
    onMouseup({ pointer }): void {
      const lastPoint = points.at(-1);
      if (points.length <= 6 && lastPoint && pointer.distanceTo(lastPoint) < 10 && line) {
        line.destroy();
      }
      line = null;
      points = [];
    },
  };
};

export default drawingTool;
