import { Konva, Tool, util } from '@pictode/core';

export interface DrawingToolOptions {
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

export const tool = (options: DrawingToolOptions): Tool => {
  let points: util.Point[] = [];
  let line: Konva.Line | null = null;

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
        line = new Konva.Line({
          points: util.flatPoints(points),
          globalCompositeOperation: 'source-over',
          lineCap: 'round',
          lineJoin: 'round',
          strokeScaleEnabled: false,
          ...options,
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

export default tool;
