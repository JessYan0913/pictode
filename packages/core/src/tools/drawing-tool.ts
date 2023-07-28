import { Tool } from '../types';

export const drawingTool: Tool = {
  name: 'drawingTool',
  drawable: true,
  onMouseDown({ app }) {
    app.canvas.isDrawingMode = true;
  },
};

export default drawingTool;
