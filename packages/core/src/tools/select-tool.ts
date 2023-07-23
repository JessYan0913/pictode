import { ToolStrategy } from '../types';

export class SelectTool extends ToolStrategy {
  public onMouseDown(): void {
    this.app.canvas.selection = true;
  }

  public onMouseMove(): void {}

  public onMouseUp(): void {
    this.app.canvas.selection = false;
  }
}
