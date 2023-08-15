import { computed, nextTick, ref, watchEffect } from 'vue';
import { App, KonvaNode, Tool, util } from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';
import {
  DiamondTool,
  DrawingTool,
  EllipseTool,
  ImageTool,
  LineTool,
  RectTool,
  SelectTool,
  TextTool,
} from '@pictode/tools';

import { FormConfig } from '@/form';
import diamondForm from '@/panels/diamond-panel';
import ellipseForm from '@/panels/ellipse-panel';
import imageForm from '@/panels/image-panel';
import lineForm from '@/panels/line-panel';
import rectForm from '@/panels/rect-panel';
import textForm from '@/panels/text-panel';

interface ToolInfo {
  name: string;
  icon: string;
  handler: () => Tool;
  formConfig?: FormConfig;
}

type ToolMap = Record<string, ToolInfo>;

const app = new App();
app.use(new HistoryPlugin());

const toolMap: ToolMap = {
  selectTool: {
    name: 'selectTool',
    icon: 'move',
    handler: () =>
      new SelectTool({
        hooks: {
          onActive(app) {
            app.triggerSelector(true);
          },
          onInactive(app) {
            app.triggerSelector(false);
          },
        },
      }),
  },
  rectTool: {
    name: 'rectTool',
    icon: 'rectangle',
    formConfig: rectForm,
    handler: () =>
      new RectTool({
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
        cornerRadius: 10,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
          onCompleteDrawing(app, node) {
            currentTool.value = 'selectTool';
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  ellipseTool: {
    name: 'ellipseTool',
    icon: 'oval',
    formConfig: ellipseForm,
    handler: () =>
      new EllipseTool({
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
          onCompleteDrawing(app, node) {
            currentTool.value = 'selectTool';
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  diamondTool: {
    name: 'diamondTool',
    icon: 'diamond',
    formConfig: diamondForm,
    handler: () =>
      new DiamondTool({
        fill: 'red',
        stroke: 'blue',
        strokeWidth: 2,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
          onCompleteDrawing(app, node) {
            currentTool.value = 'selectTool';
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  lineTool: {
    name: 'lineTool',
    icon: 'line-2',
    formConfig: lineForm,
    handler: () =>
      new LineTool({
        stroke: 'blue',
        strokeWidth: 2,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
          onCompleteDrawing(app, node) {
            currentTool.value = 'selectTool';
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  drawingTool: {
    name: 'drawingTool',
    icon: 'pencil',
    formConfig: lineForm,
    handler: () =>
      new DrawingTool({
        stroke: 'blue',
        strokeWidth: 2,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
        },
      }),
  },
  imageTool: {
    name: 'imageTool',
    icon: 'picture',
    formConfig: imageForm,
    handler: () =>
      new ImageTool({
        image: new Image(),
        hooks: {
          async onActive(app, tool) {
            app.cancelSelect();
            const files = await util.selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE', '.svg'], false);
            const imgSrc = await util.readeFile<string>((reader) => reader.readAsDataURL(files[0]));
            const image = new Image();
            image.src = imgSrc;
            tool.options && (tool.options.image = image);
          },
          onCompleteDrawing(app, node) {
            currentTool.value = 'selectTool';
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  textTool: {
    name: 'textTool',
    icon: 'text',
    formConfig: textForm,
    handler: () =>
      new TextTool({
        stroke: 'blue',
        strokeWidth: 2,
      }),
  },
};

const tools = computed<ToolInfo[]>(() => Object.values(toolMap));

const currentTool = ref<keyof ToolMap>(tools.value[0].name);
const selected = ref<Array<KonvaNode>>([]);
const formConfig = ref<FormConfig>([]);

app.on('tool:changed', ({ curTool }) => {
  const toolInfo = tools.value.find(({ name }) => name === curTool.name);
  if (toolInfo) {
    currentTool.value = toolInfo.name;
  }
});

app.on('selected:changed', ({ selected: newSelected }) => {
  selected.value = newSelected;
  if (selected.value.length === 1) {
    switch (selected.value[0].className) {
      case 'Rect':
        formConfig.value = rectForm;
        break;
      case 'Image':
        formConfig.value = imageForm;
        break;
      case 'Line':
        formConfig.value = lineForm;
        break;
      case 'Ellipse':
        formConfig.value = ellipseForm;
        break;
      case 'RegularPolygon':
        formConfig.value = diamondForm;
        break;
      case 'Text':
        formConfig.value = textForm;
        break;
    }
  }
});

watchEffect(() => {
  app.setTool(toolMap[currentTool.value].handler());
  formConfig.value = toolMap[currentTool.value].formConfig ?? [];
});

export const usePictode = () => {
  return {
    app,
    tools,
    currentTool,
    selected,
    formConfig,
  };
};

export default usePictode;
