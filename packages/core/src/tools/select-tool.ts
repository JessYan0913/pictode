import Konva from 'konva';

import { KonvaNode, Tool } from '../types';

export const selectTool = (...nodes: KonvaNode[]): Tool => {
  return {
    name: 'selectTool',
    onActive(app) {
      app.triggerSelector(true);
      app.select(...nodes.filter((node) => node instanceof Konva.Node));
    },
    onInactive(app) {
      app.triggerSelector(false);
    },
  };
};

export default selectTool;
