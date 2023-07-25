import { AppMouseEvent, Tool } from '../types';

class SelectTool implements Tool {
  public name: string = 'selectTool';
  public drawable: boolean = false;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = true;
    app.canvas.isDrawingMode = false;
    app.canvas.selectionColor = 'rgba(157, 157, 231, 0.5)';
    app.canvas.selectionBorderColor = 'rgb(157, 157, 231)';
    app.canvas.selectionLineWidth = 2;
  }
}

export const selectTool = new SelectTool();

export default selectTool;
