import { Tool, ToolHooks } from '@pictode/core';

export interface SelectToolOptions {
  hooks?: ToolHooks;
}

export class SelectTool implements Tool {
  public name = 'selectTool';
  public hooks?: ToolHooks;

  constructor(options: SelectToolOptions) {
    this.hooks = options.hooks;
  }
}

export default SelectTool;
