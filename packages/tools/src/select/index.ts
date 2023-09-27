import { Tool, ToolHooks } from '@pictode/core';

export class SelectTool implements Tool {
  public name: string = 'selectTool';
  public hooks?: ToolHooks | undefined;

  constructor(options: { hooks?: ToolHooks }) {
    this.hooks = options.hooks;
  }
}

export default SelectTool;
