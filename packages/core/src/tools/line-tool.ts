import Konva from 'konva';

import App from '../app';
import { Line } from '../customs/line';
import { AppMouseEvent, Tool } from '../types';

class LineTool implements Tool {
  public name: string = 'polylineTool';
  private points: Konva.Vector2d[] = [];
  private line: Line | null = null;

  public onActive(app: App): void {
    app.select();
  }

  public onInactive(): void {
    this.line = null;
    this.points = [];
  }

  public onMouseDown({ app }: AppMouseEvent): void {
    console.log('===>', app);
  }

  public onMouseMove(): void {}

  public onMouseDoubleClick() {}
}

export const lineTool = new LineTool();

export default lineTool;
