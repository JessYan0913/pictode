<script setup lang="ts">
import { nextTick, ref, watchEffect } from 'vue';
import { Tool, util } from '@pictode/core';
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

import usePictode from '@/hooks/usePictode';
import { getPanelConfigByTool } from '@/panels';

import RadioGroup from './RadioGroup.vue';
import RadioGroupOption from './RadioGroupOption.vue';
import SvgIcon from './SvgIcon.vue';

const { app, panelConfig } = usePictode();

interface ToolInfo {
  icon: string;
  name: string;
  tool: Tool | ((model: Record<string, any>) => Tool);
}

const selectTool = new SelectTool({
  hooks: {
    onActive(app) {
      app.triggerSelector(true);
    },
    onInactive(app) {
      app.triggerSelector(false);
    },
  },
});

const tools: ToolInfo[] = [
  {
    icon: 'move',
    name: 'selectTool',
    tool: selectTool,
  },
  {
    icon: 'rectangle',
    name: 'rectTool',
    tool: (model) =>
      new RectTool({
        config: model,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'oval',
    name: 'ellipseTool',
    tool: (model) =>
      new EllipseTool({
        config: model,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'diamond',
    name: 'diamondTool',
    tool: (model) =>
      new DiamondTool({
        config: model,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'line-1',
    name: 'lineTool',
    tool: (model) =>
      new LineTool({
        config: model,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'pencil',
    name: 'drawingTool',
    tool: (model) =>
      new DrawingTool({
        config: model,
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
        },
      }),
  },
  {
    icon: 'picture',
    name: 'imageTool',
    tool: () =>
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
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'text',
    name: 'textTool',
    tool: (model) =>
      new TextTool({
        config: model,
        hooks: {
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
];

const currentTool = ref<string>(tools[0].name);

watchEffect(() => {
  panelConfig.value = getPanelConfigByTool(currentTool.value);
  let tool = tools.find(({ name }) => name === currentTool.value)?.tool;
  if (typeof tool === 'function') {
    tool = tool(panelConfig.value?.model ?? {});
  }
  if (tool) {
    app.setTool(tool);
  }
});
</script>

<template>
  <RadioGroup v-model="currentTool">
    <RadioGroupOption v-for="(item, index) in tools" :key="index" :value="item.name">
      <SvgIcon :name="item.icon"></SvgIcon>
    </RadioGroupOption>
  </RadioGroup>
</template>
