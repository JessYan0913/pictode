import { Tool, ToolHooks } from '@pictode/core';

export const tool = (hooks: ToolHooks): Tool => {
  return {
    name: 'selectTool',
    hooks,
  };
};

export default tool;
