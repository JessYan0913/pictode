import { ChildType, Tool } from '../types';

export const selectTool = (...shapes: ChildType[]): Tool => {
  return {
    name: 'selectTool',
    onActive(app) {
      app.triggerSelector(true);
      app.select(...shapes);
    },
    onInactive(app) {
      app.triggerSelector(false);
    },
  };
};

export default selectTool;
