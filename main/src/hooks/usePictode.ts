import { computed, nextTick, ref, watchEffect } from 'vue';
import { App, KonvaNode, Tool, util } from '@pictode/core';
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
    handler: pictodeTools.selectTool({
      onActive(app) {
        app.triggerSelector(true);
      },
      onInactive(app) {
        app.triggerSelector(false);
      },
    }),
  },
  rectTool: {
    name: 'rectTool',
    icon: 'rectangle',
    handler: pictodeTools.rectTool(
      {
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
        cornerRadius: 10,
      },
      {
        onActive(app) {
          app.cancelSelect();
        },
        onCompleteDrawing(app, node) {
          currentTool.value = 'selectTool';
          nextTick(() => app.select(node));
        },
      }
    ),
  },
  ellipseTool: {
    name: 'ellipseTool',
    icon: 'oval',
    handler: pictodeTools.ellipseTool(
      {
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
      },
      {
        onActive(app) {
          app.cancelSelect();
        },
        onCompleteDrawing(app, node) {
          currentTool.value = 'selectTool';
          nextTick(() => app.select(node));
        },
      }
    ),
  },
  diamondTool: {
    name: 'diamondTool',
    icon: 'diamond',
    handler: pictodeTools.diamondTool(
      {
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
      },
      {
        onActive(app) {
          app.cancelSelect();
        },
        onCompleteDrawing(app, node) {
          currentTool.value = 'selectTool';
          nextTick(() => app.select(node));
        },
      }
    ),
  },
  lineTool: {
    name: 'lineTool',
    icon: 'line-2',
    handler: pictodeTools.lineTool(
      {
        stroke: 'blue',
        strokeWidth: 2,
      },
      {
        onActive(app) {
          app.cancelSelect();
        },
        onCompleteDrawing(app, node) {
          currentTool.value = 'selectTool';
          nextTick(() => app.select(node));
        },
      }
    ),
  },
  drawingTool: {
    name: 'drawingTool',
    icon: 'pencil',
    handler: pictodeTools.drawingTool(
      {
        stroke: 'blue',
        strokeWidth: 2,
      },
      {
        onActive(app) {
          app.cancelSelect();
        },
      }
    ),
  },
  imageTool: {
    name: 'imageTool',
    icon: 'picture',
    handler: pictodeTools.imageTool(
      {
        image: new Image(),
      },
      {
        async onActive(app, tool) {
          app.cancelSelect();
          const files = await util.selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE', '.svg'], false);
          const imgSrc = await util.readeFile<string>((reader) => reader.readAsDataURL(files[0]));
          tool.options?.image && (tool.options.image.src = imgSrc);
        },
        onCompleteDrawing(app, node) {
          currentTool.value = 'selectTool';
          nextTick(() => app.select(node));
        },
      }
    ),
  },
  textTool: {
    name: 'textTool',
    icon: 'text',
    handler: pictodeTools.textTool({
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
