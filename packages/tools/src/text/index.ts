import { Konva, Tool, ToolEvent, ToolHooks } from '@pictode/core';

import { createTextarea } from './utils';

export type TextToolConfig = Partial<Konva.TextConfig>;

export interface TextToolOptions {
  config?: TextToolConfig;
  hooks?: ToolHooks;
}

export class TextTool implements Tool<TextToolConfig> {
  public name: string = 'textTool';
  public config?: TextToolConfig;
  public hooks?: ToolHooks;
  private textNode: Konva.Text | null = null;

  constructor({ config, hooks }: TextToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public doubleClick({ app, pointer }: ToolEvent) {
    this.textNode = new Konva.Text({
      ...this.config,
      text: '',
      x: pointer.x,
      y: pointer.y,
    });
    this.textNode.on<'dblclick'>('dblclick', ({ target }) => {
      createTextarea(app, target as Konva.Text, () => {
        this.hooks?.onCompleteDrawing?.(app, target as Konva.Text);
      });
    });
    app.add(this.textNode);
    this.textNode.fire('dblclick');
  }

  public enableChanged(): void {
    this.textNode = null;
  }
}

export default TextTool;
