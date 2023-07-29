import { Line } from '../customs/line';
import { Tool } from '../types';

class LineTool implements Tool {
  public name: string = 'polylineTool';
  private polyline: Line | null = null;

  public onActive(): void {
    throw new Error('Method not implemented.');
  }

  public onInactive(): void {
    throw new Error('Method not implemented.');
  }

  public onMouseDown(): void {}

  public onMouseMove(): void {}

  public onMouseDoubleClick() {}
}

export const lineTool = new LineTool();

export default lineTool;
