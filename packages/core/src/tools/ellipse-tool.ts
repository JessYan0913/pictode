import Konva from 'konva';

import { Ellipse } from '../customs/ellipse';
import { Tool } from '../types';

class EllipseTool implements Tool {
  public name: string = 'ellipseTool';
  public drawable: boolean = true;
  private startPointer: Konva.Vector2d = { x: 0, y: 0 };
  private ellipse: Ellipse | null = null;

  public onMouseDown(): void {}

  public onMouseMove(): void {}

  public onMouseUp(): void {}
}

export const ellipseTool = new EllipseTool();

export default ellipseTool;
