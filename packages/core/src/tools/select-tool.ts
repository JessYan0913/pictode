import { AppMouseEvent, Tool } from '../types';

class SelectTool implements Tool {
  public name: string = 'selectTool';
  public drawable: boolean = false;

  public onMouseDown({ app }: AppMouseEvent): void {
    app.canvas.selection = true;
  }
}

export const selectTool = new SelectTool();

export default selectTool;
