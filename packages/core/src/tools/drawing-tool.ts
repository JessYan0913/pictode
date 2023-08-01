import Konva from 'konva';

import { Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

export const drawingTool = (): Tool => {
  let points: Point[] = [];
  const line = new Konva.Line({
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
      app.cancelSelect();
    },
    onInactive() {
      points = [];
    },
    onMouseDown({ app }): void {
      const lastPoint = points.at(-1);
      if (!lastPoint || !lastPoint.eq(app.pointer)) {
        points.push(app.pointer);
      }
      line.points(flatPoints());
      app.add(line);
    },
    onMouseMove({ app, event }): void {
      event.evt.stopPropagation();
      line.points(line.points().concat([app.pointer.x, app.pointer.y]));
    },
    onMouseUp({ app }): void {
      app.setTool(selectTool(line));
    },
  };
};

export default drawingTool;
