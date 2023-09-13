import { Konva, KonvaNode, Tool, ToolEvent, ToolHooks } from '@pictode/core';

export class EraserTool implements Tool {
  public name: string = 'eraserTool';
  public hooks?: ToolHooks | undefined;
  private targetMap: Map<
    string,
    {
      node: KonvaNode;
      opacity: number;
    }
  > = new Map();
  private isEraser: boolean = false;

  constructor(options: { hooks?: ToolHooks }) {
    this.hooks = options.hooks;
  }

  public mousedown({ event }: ToolEvent) {
    this.isEraser = true;
    if (event.target instanceof Konva.Stage) {
      return;
    }
    this.targetMap.set(event.target.id(), {
      node: event.target,
      opacity: event.target.attrs.opacity,
    });
    event.target.opacity(0.3);
  }

  public mouseup({ app }: ToolEvent) {
    if (!this.targetMap.size) {
      return;
    }
    app.remove(
      ...[...this.targetMap.values()].map(({ node, opacity }) => {
        node.opacity(opacity);
        return node;
      })
    );
    this.targetMap.clear();
    this.isEraser = false;
  }

  public mousemove({ event }: ToolEvent) {
    if (!this.isEraser) {
      return;
    }
    if (event.target instanceof Konva.Stage) {
      return;
    }
    const target = this.targetMap.get(event.target.id());
    if (target) {
      return;
    }
    this.targetMap.set(event.target.id(), {
      node: event.target,
      opacity: event.target.attrs.opacity,
    });
    event.target.opacity(0.3);
  }

  public enableChanged(): void {
    this.targetMap.clear();
    this.isEraser = false;
  }
}

export default EraserTool;
