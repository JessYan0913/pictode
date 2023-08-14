import { Konva, Tool, ToolFactory, ToolHooks, ToolOptions, util } from '@pictode/core';

export const tool: ToolFactory = (options: ToolOptions, hooks?: ToolHooks): Tool => {
  let points: util.Point[] = [];
  let line: Konva.Line | null = null;

  return {
    name: 'drawingTool',
    options,
    hooks,
    active(app) {
      hooks?.onActive?.(app);
      points = [];
      app.cancelSelect();
    },
    inactive(app) {
      hooks?.onInactive?.(app);
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
          ...options,
        });
        app.add(line);
        hooks?.onStartDrawing?.(app, line);
      }
    },
    mousemove({ app, event }): void {
      if (!line) {
        return;
      }
      event.evt.stopPropagation();
      line.points(line.points().concat([app.pointer.x, app.pointer.y]));
    },
    mouseup({ app, pointer }): void {
      const lastPoint = points.at(-1);
      if (points.length <= 6 && lastPoint && pointer.distanceTo(lastPoint) < 10 && line) {
        line.destroy();
      }
      if (line) {
        hooks?.onCompleteDrawing?.(app, line);
        line = null;
        points = [];
      }
    },
  };
};

export default tool;
