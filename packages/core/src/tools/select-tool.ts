import { ChildType, Tool } from '../types';

export const selectTool = (...shapes: ChildType[]): Tool => {
  return {
    name: 'selectTool',
    onActive(app) {
      app.select(...shapes);
    },
    onInactive() {},
  };
};

export default selectTool;
