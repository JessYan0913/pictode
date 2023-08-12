import { computed, ref, watchEffect } from 'vue';
import {
  App,
  drawingTool,
  ellipseTool,
  imageTool,
  KonvaNode,
  lineTool,
  rectTool,
  regularPolygonTool,
  selectTool,
  textTool,
  Tool,
} from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';

interface ToolInfo {
  name: string;
  icon: string;
  handler: (...args: any[]) => Tool;
}

type ToolMap = Record<string, ToolInfo>;

const app = new App();
app.use(new HistoryPlugin());

const toolMap: ToolMap = {
  selectTool: {
    name: 'selectTool',
    icon: 'move',
    handler: selectTool,
  },
  rectTool: {
    name: 'rectTool',
    icon: 'rectangle',
    handler: rectTool,
  },
  ellipseTool: {
    name: 'ellipseTool',
    icon: 'oval',
    handler: ellipseTool,
  },
  regularPolygonTool: {
    name: 'regularPolygonTool',
    icon: 'diamond',
    handler: regularPolygonTool,
  },
  lineTool: {
    name: 'lineTool',
    icon: 'line-2',
    handler: lineTool,
  },
  drawingTool: {
    name: 'drawingTool',
    icon: 'pencil',
    handler: drawingTool,
  },
  imageTool: {
    name: 'imageTool',
    icon: 'picture',
    handler: imageTool,
  },
  textTool: {
    name: 'textTool',
    icon: 'text',
    handler: textTool,
  },
};

const tools = computed<ToolInfo[]>(() => Object.values(toolMap));

const currentTool = ref<keyof ToolMap>(tools.value[0].name);
const selected = ref<Array<KonvaNode>>([]);

app.on('tool:changed', ({ curTool }) => {
  const toolInfo = tools.value.find(({ name }) => name === curTool.name);
  if (toolInfo) {
    currentTool.value = toolInfo.name;
  }
});

app.on('selected:changed', ({ selected: newSelected }) => {
  selected.value = newSelected;
});

watchEffect(() => {
  app.setTool(
    toolMap[currentTool.value].handler({
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 2,
    })
  );
});

export const usePictode = () => {
  return {
    app,
    tools,
    currentTool,
    selected,
  };
};

export default usePictode;
