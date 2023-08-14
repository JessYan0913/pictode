import { Konva, KonvaNode, Tool } from '@pictode/core';

export const tool = (...nodes: KonvaNode[]): Tool => {
  return {
    name: 'selectTool',
    active(app) {
      app.triggerSelector(true);
      app.select(...nodes.filter((node) => node instanceof Konva.Node));
    },
    inactive(app) {
      app.triggerSelector(false);
    },
  };
};

export default tool;
