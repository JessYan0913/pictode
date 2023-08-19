<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue';
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

import RadioGroup from './RadioGroup.vue';
import RadioGroupOption from './RadioGroupOption.vue';
import SvgIcon from './SvgIcon.vue';

const { app, panelValue } = usePictode();

interface ToolInfo {
  icon: string;
  name: string;
  tool: Tool | (() => Tool);
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
    tool: () =>
      new RectTool({
        config: {
          ...panelValue.value,
        },
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
    tool: () =>
      new EllipseTool({
        config: {
          radiusX: 0,
          radiusY: 0,
          ...panelValue.value,
        },
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
    tool: () =>
      new DiamondTool({
        config: {
          sides: 4,
          radius: 0,
          ...panelValue.value,
        },
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
    tool: () =>
      new LineTool({
        config: {
          ...panelValue.value,
        },
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
    tool: () =>
      new DrawingTool({
        config: {
          ...panelValue.value,
        },
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
    tool: () =>
      new TextTool({
        config: {
          ...panelValue.value,
        },
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

const tool = computed<Tool | undefined>(() => {
  const result = tools.find(({ name }) => name === currentTool.value)?.tool;
  if (typeof result === 'function') {
    return result();
  }
  return result;
});

watchEffect(() => {
  if (tool.value) {
    app.setTool(tool.value);
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
