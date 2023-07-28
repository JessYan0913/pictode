import { Point } from 'fabric';

import { Ellipse } from '../customs/ellipse';
import { Tool } from '../types';

class EllipseTool implements Tool {
  public name: string = 'ellipseTool';
  public drawable: boolean = true;
  private startPointer: Point = new Point(0, 0);
  private ellipse: Ellipse | null = null;

  public onMouseDown(): void {}

  public onMouseMove(): void {}

  public onMouseUp(): void {}
}

export const ellipseTool = new EllipseTool();

export default ellipseTool;
