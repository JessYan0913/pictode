import { Tool, ToolHooks } from '@pictode/core';

export class SelectTool implements Tool {
  public name = 'selectTool';
  public hooks?: ToolHooks;

  constructor(options: { hooks?: ToolHooks }) {
    this.hooks = options.hooks;
  }
}

export default SelectTool;
