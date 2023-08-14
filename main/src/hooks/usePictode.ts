import { computed, ref, watchEffect } from 'vue';
import { App, KonvaNode, Tool, ToolHooks, ToolOptions } from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';
import pictodeTools from '@pictode/tools';

interface ToolInfo {
  name: string;
  icon: string;
  handler: (options: ToolOptions, hooks: ToolHooks) => Tool;
}

type ToolMap = Record<string, ToolInfo>;

const app = new App();
app.use(new HistoryPlugin());

const toolMap: ToolMap = {
  selectTool: {
    name: 'selectTool',
    icon: 'move',
    handler: pictodeTools.selectTool,
  },
  rectTool: {
    name: 'rectTool',
    icon: 'rectangle',
    handler: pictodeTools.rectTool,
  },
  ellipseTool: {
    name: 'ellipseTool',
    icon: 'oval',
    handler: pictodeTools.ellipseTool,
  },
  regularPolygonTool: {
    name: 'regularPolygonTool',
    icon: 'diamond',
    handler: pictodeTools.diamondTool,
  },
  lineTool: {
    name: 'lineTool',
    icon: 'line-2',
    handler: pictodeTools.lineTool,
  },
  drawingTool: {
    name: 'drawingTool',
    icon: 'pencil',
    handler: pictodeTools.drawingTool,
  },
  imageTool: {
    name: 'imageTool',
    icon: 'picture',
    handler: pictodeTools.imageTool,
  },
  textTool: {
    name: 'textTool',
    icon: 'text',
    handler: pictodeTools.textTool,
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
    toolMap[currentTool.value].handler(
      {
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
      },
      {
        onActive(app: App) {
          app.cancelSelect();
        },
      }
    )
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
