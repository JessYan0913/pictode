import { computed, ref, watchEffect } from 'vue';
import { App, KonvaNode, Tool } from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';
import pictodeTools from '@pictode/tools';

interface ToolInfo {
  name: string;
  icon: string;
  handler: Tool;
}

type ToolMap = Record<string, ToolInfo>;

const app = new App();
app.use(new HistoryPlugin());

const toolMap: ToolMap = {
  selectTool: {
    name: 'selectTool',
    icon: 'move',
    handler: pictodeTools.selectTool(),
  },
  rectTool: {
    name: 'rectTool',
    icon: 'rectangle',
    handler: pictodeTools.rectTool({
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 2,
    }),
  },
  ellipseTool: {
    name: 'ellipseTool',
    icon: 'oval',
    handler: pictodeTools.ellipseTool({
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 2,
    }),
  },
  regularPolygonTool: {
    name: 'regularPolygonTool',
    icon: 'diamond',
    handler: pictodeTools.diamondTool({
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 2,
    }),
  },
  lineTool: {
    name: 'lineTool',
    icon: 'line-2',
    handler: pictodeTools.lineTool({
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 2,
    }),
  },
  drawingTool: {
    name: 'drawingTool',
    icon: 'pencil',
    handler: pictodeTools.drawingTool({
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 2,
    }),
  },
  imageTool: {
    name: 'imageTool',
    icon: 'picture',
    handler: pictodeTools.imageTool({}),
  },
  textTool: {
    name: 'textTool',
    icon: 'text',
    handler: pictodeTools.textTool({
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 2,
    }),
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
  app.setTool(toolMap[currentTool.value].handler);
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
