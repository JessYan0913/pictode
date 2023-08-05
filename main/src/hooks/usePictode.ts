import { ref, watchEffect } from 'vue';
import {
  App,
  drawingTool,
  ellipseTool,
  imageTool,
  lineTool,
  rectTool,
  regularPolygonTool,
  selectTool,
  textTool,
  Tool,
} from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';

export interface ToolInfo {
  icon: string;
  name: string;
  handler: () => Tool;
}

const app = new App();
app.use(new HistoryPlugin());

const tools: Array<ToolInfo> = [
  {
    icon: 'move',
    name: 'selectTool',
    handler: selectTool,
  },
  {
    icon: 'rectangle',
    name: 'rectTool',
    handler: rectTool,
  },
  {
    icon: 'oval',
    name: 'ellipseTool',
    handler: ellipseTool,
  },
  {
    icon: 'diamond',
    name: 'regularPolygonTool',
    handler: regularPolygonTool,
  },
  {
    icon: 'line-2',
    name: 'lineTool',
    handler: lineTool,
  },
  {
    icon: 'pencil',
    name: 'drawingTool',
    handler: drawingTool,
  },
  {
    icon: 'picture',
    name: 'imageTool',
    handler: imageTool,
  },
  {
    icon: 'text',
    name: 'textTool',
    handler: textTool,
  },
];

const currentTool = ref<ToolInfo>(tools[0]);

app.on('tool:changed', ({ curTool }) => {
  const toolInfo = tools.find(({ name }) => name === curTool.name);
  if (toolInfo) {
    currentTool.value = toolInfo;
  }
});

watchEffect(() => {
  app.setTool(currentTool.value.handler());
});

export const usePictode = () => {
  return {
    app,
    tools,
    currentTool,
  };
};

export default usePictode;
