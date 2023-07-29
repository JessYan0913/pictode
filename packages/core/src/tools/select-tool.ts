import { Tool } from '../types';

export const selectTool: Tool = {
  name: 'selectTool',
  drawable: false,
  onMouseClick(event) {
    console.log('====>', event);
  },
};

export default selectTool;
