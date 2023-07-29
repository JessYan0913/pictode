import App from '../app';
import { Line } from '../customs/line';
import { AppMouseEvent, Tool } from '../types';
import { Point } from '../utils';

import { selectTool } from './select-tool';

class LineTool implements Tool {
  public name: string = 'polylineTool';
  private points: Point[] = [];
  private line: Line | null = null;

  public onActive(app: App): void {
    app.select();
  }

  public onInactive(): void {
    this.line = null;
    this.points = [];
  }

  public onMouseDown({ app }: AppMouseEvent): void {
    const lastPoint = this.points.at(-1);
    if (!lastPoint || !lastPoint.eq(app.pointer)) {
      this.points.push(app.pointer);
    }
    if (this.line) {
      this.line.points(this.flatPoints());
    } else {
      this.line = new Line({
        points: this.flatPoints(),
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
      });
      app.add(this.line);
    }
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.line) {
      return;
    }
    this.line.points(this.flatPoints().concat(app.pointer.x, app.pointer.y));
    app.render();
  }

  public onMouseDoubleClick({ app }: AppMouseEvent): void {
    if (!this.line) {
      return;
    }
    app.select(this.line);
    app.setTool(selectTool);
  }

  private flatPoints(): number[] {
    return this.points.reduce<number[]>((points, point) => [...points, ...point.toArray()], []);
  }
}

export const lineTool = new LineTool();

export default lineTool;
