import { Point } from 'fabric';

import { Triangle } from '../customs/triangle';
import { Tool } from '../types';

class TriangleTool implements Tool {
  public name: string = 'triangleTool';
  public drawable: boolean = true;
  private startPointer: Point = new Point(0, 0);
  private triangle: Triangle | null = null;

  public onMouseDown(): void {}

  public onMouseMove(): void {}

  public onMouseUp(): void {}
}

export const triangleTool = new TriangleTool();

export default triangleTool;
