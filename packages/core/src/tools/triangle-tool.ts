import { Triangle } from '../customs/triangle';
import { Tool } from '../types';
import { Point } from '../utils';

class TriangleTool implements Tool {
  public name: string = 'triangleTool';
  private startPointer: Point = new Point(0, 0);
  private triangle: Triangle | null = null;

  public onActive(): void {}

  public onInactive(): void {}

  public onMouseDown(): void {}

  public onMouseMove(): void {}

  public onMouseUp(): void {}
}

export const triangleTool = new TriangleTool();

export default triangleTool;
