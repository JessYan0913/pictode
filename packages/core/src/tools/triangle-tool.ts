import Konva from 'konva';

import { Triangle } from '../customs/triangle';
import { Tool } from '../types';

class TriangleTool implements Tool {
  public name: string = 'triangleTool';
  private startPointer: Konva.Vector2d = { x: 0, y: 0 };
  private triangle: Triangle | null = null;

  public onActive(): void {}

  public onInactive(): void {}

  public onMouseDown(): void {}

  public onMouseMove(): void {}

  public onMouseUp(): void {}
}

export const triangleTool = new TriangleTool();

export default triangleTool;
