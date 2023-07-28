import { Line } from '../customs/line';
import { Tool } from '../types';

class LineTool implements Tool {
  public name: string = 'polylineTool';
  public drawable: boolean = true;
  private polyline: Line | null = null;

  public onMouseDown(): void {}

  public onMouseMove(): void {}

  public onMouseDoubleClick() {}
}

export const lineTool = new LineTool();

export default lineTool;
