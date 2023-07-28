import { Point } from 'fabric';

import { PRect } from '../customs/rect';
import { Tool } from '../types';

class RectTool implements Tool {
  public name: string = 'rectTool';
  public drawable: boolean = true;
  private startPointer: Point = new Point(0, 0);
  private rectangle: PRect | null = null;

  public onMouseDown(): void {}

  public onMouseMove(): void {}

  public onMouseUp(): void {}
}

export const rectTool = new RectTool();

export default rectTool;
