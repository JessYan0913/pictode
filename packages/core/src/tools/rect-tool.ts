import { Rect } from '../customs/rect';
import { AppMouseEvent, ToolStrategy } from '../types';

export class RectTool implements ToolStrategy {
  private isDrawing: boolean = false;
  private rect: Rect | null = null;

  public onMouseDown({ app }: AppMouseEvent): void {
    this.isDrawing = true;
    const pointer = app.pointer;
    this.rect = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    app.canvas.add(this.rect);
  }

  public onMouseMove({ app }: AppMouseEvent): void {
    if (!this.isDrawing || !this.rect) {
      return;
    }
    const pointer = app.pointer;
    this.rect.set({
      width: pointer.x - (this.rect.left ?? 0),
      height: pointer.y - (this.rect.top ?? 0),
    });
    app.render();
  }

  public onMouseUp(): void {
    this.isDrawing = false;
    this.rect = null;
  }
}

export default RectTool;
