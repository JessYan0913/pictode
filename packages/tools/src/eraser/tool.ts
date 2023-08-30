import { Konva, KonvaNode, Tool, ToolEvent, ToolHooks } from '@pictode/core';

export class EraserTool implements Tool {
  public name: string = 'eraserTool';
  public hooks?: ToolHooks | undefined;
  private target: KonvaNode | null = null;
  private targetOpacity: number = 1;

  constructor(options: { hooks?: ToolHooks }) {
    this.hooks = options.hooks;
  }

  public mousedown({ event }: ToolEvent) {
    if (event.target instanceof Konva.Stage) {
      return;
    }
    this.target = event.target;
    this.targetOpacity = this.target.opacity();
    event.target.opacity(this.targetOpacity / 2);
  }

  public mouseup({ app }: ToolEvent) {
    if (!this.target) {
      return;
    }
    this.target.opacity(this.targetOpacity);
    app.remove(this.target);
    this.target = null;
  }

  public enableChanged(): void {
    this.target = null;
  }
}

export default EraserTool;
