import Konva from 'konva';

import { Tool } from '../types';

export const selectTool: Tool = {
  name: 'selectTool',
  onActive(app) {
    app.select();
  },
  onInactive() {},
  onMouseDown({ event, app }) {
    if (event.target instanceof Konva.Stage) {
      app.select();
    } else {
      app.select(event.target);
    }
  },
};

export default selectTool;
