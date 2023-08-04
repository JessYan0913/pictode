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
    icon: '🖱️',
    name: 'selectTool',
    handler: selectTool,
  },
  {
    icon: '🟦',
    name: 'rectTool',
    handler: rectTool,
  },
  {
    icon: '🔵',
    name: 'ellipseTool',
    handler: ellipseTool,
  },
  {
    icon: '🔷',
    name: 'regularPolygonTool',
    handler: regularPolygonTool,
  },
  {
    icon: '✒️',
    name: 'lineTool',
    handler: lineTool,
  },
  {
    icon: '✏️',
    name: 'drawingTool',
    handler: drawingTool,
  },
  {
    icon: '🖼️',
    name: 'imageTool',
    handler: imageTool,
  },
  {
    icon: '🔠',
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
