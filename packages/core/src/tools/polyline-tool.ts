import { Point } from 'fabric';

import { PPolyline } from '../customs/polyline';
import { Tool } from '../types';

class PolylineTool implements Tool {
  public name: string = 'polylineTool';
  public drawable: boolean = true;
  private points: Point[] = [];
  private polyline: PPolyline | null = null;

  public onMouseDown(): void {}

  public onMouseMove(): void {}

  public onMouseDoubleClick() {}
}

export const polylineTool = new PolylineTool();

export default polylineTool;
