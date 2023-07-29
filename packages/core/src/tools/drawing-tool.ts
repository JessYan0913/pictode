import { Tool } from '../types';

export const drawingTool = (): Tool => {
  return {
    name: 'drawingTool',
    onActive() {},
    onInactive() {},
  };
};

export default drawingTool;
