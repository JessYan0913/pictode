import { Tool } from '../types';

export const selectTool = (): Tool => {
  return {
    name: 'selectTool',
    onActive() {},
    onInactive() {},
    onMouseDown() {},
  };
};

export default selectTool;
