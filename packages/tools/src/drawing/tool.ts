import { Konva, Tool, ToolOptions, util } from '@pictode/core';

export const tool = (options: ToolOptions): Tool => {
  let points: util.Point[] = [];
  let line: Konva.Line | null = null;

  return {
    name: 'drawingTool',
    options,
    hooks: {
      onActive(app) {
        points = [];
        app.cancelSelect();
      },
    },
    mousedown({ app }): void {
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
          ...this.options,
        });
        app.add(line);
      }
    },
    mousemove({ app, event }): void {
      if (!line) {
        return;
      }
      event.evt.stopPropagation();
      line.points(line.points().concat([app.pointer.x, app.pointer.y]));
    },
    mouseup({ pointer }): void {
      const lastPoint = points.at(-1);
      if (points.length <= 6 && lastPoint && pointer.distanceTo(lastPoint) < 10 && line) {
        line.destroy();
      }
      if (line) {
        line = null;
        points = [];
      }
    },
  };
};

export default tool;
