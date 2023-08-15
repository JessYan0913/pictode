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

import { FormConfig, FormValue } from '@/form';
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
        config: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2,
          cornerRadius: 10,
          opacity: 1,
        },
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
        config: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2,
          radiusX: 0,
          radiusY: 0,
        },
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
        config: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2,
          sides: 4,
          radius: 0,
        },
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
        config: {
          stroke: '#000000',
          strokeWidth: 2,
        },
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
        config: {
          stroke: '#000000',
          strokeWidth: 2,
        },
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
        config: {
          image: new Image(),
        },
        hooks: {
          async onActive(app, tool) {
            app.cancelSelect();
            const files = await util.selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE', '.svg'], false);
            const imgSrc = await util.readeFile<string>((reader) => reader.readAsDataURL(files[0]));
            const image = new Image();
            image.src = imgSrc;
            tool.config && (tool.config.image = image);
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
        config: {
          fill: '#000000',
          strokeWidth: 0.1,
          fontSize: 20,
        },
      }),
  },
};

const tools = computed<ToolInfo[]>(() => Object.values(toolMap));

const currentTool = ref<keyof ToolMap>(tools.value[0].name);
const selected = ref<Array<KonvaNode>>([]);
const panelConfig = ref<FormConfig>([]);
const panelValue = ref<FormValue>({});

app.on('tool:changed', ({ curTool }) => {
  const toolInfo = tools.value.find(({ name }) => name === curTool.name);
  if (toolInfo) {
    currentTool.value = toolInfo.name;
  }
});

app.on('selected:changed', ({ selected: newSelected }) => {
  selected.value = newSelected;
  if (selected.value.length === 1) {
    panelValue.value = JSON.parse(selected.value[0].toJSON()).attrs;
    switch (selected.value[0].className) {
      case 'Rect':
        panelConfig.value = rectForm;
        break;
      case 'Image':
        panelConfig.value = imageForm;
        break;
      case 'Line':
        panelConfig.value = lineForm;
        break;
      case 'Ellipse':
        panelConfig.value = ellipseForm;
        break;
      case 'RegularPolygon':
        panelConfig.value = diamondForm;
        break;
      case 'Text':
        panelConfig.value = textForm;
        break;
    }
  }
});

watchEffect(() => {
  app.setTool(toolMap[currentTool.value].handler());
  panelConfig.value = toolMap[currentTool.value].formConfig ?? [];
});

export const usePictode = () => {
  return {
    app,
    tools,
    currentTool,
    selected,
    panelConfig,
    panelValue,
  };
};

export default usePictode;
