import Konva from 'konva';

import { AppMouseEvent, ChildType, Tool } from '../types';

export const selectTool = (...shapes: ChildType[]): Tool => {
  return {
    name: 'selectTool',
    onActive(app) {
      app.select(...shapes);
    },
    onInactive() {},
    onMouseClick({ app, event }: AppMouseEvent) {
      if (event.target instanceof Konva.Stage) {
        app.select();
      } else {
        app.select(event.target);
      }
    },
  };
};

export default selectTool;
