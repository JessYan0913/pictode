<script setup lang="ts">
import { nextTick, ref, watchEffect } from 'vue';
import { Tool, util } from '@pictode/core';
import {
  DiamondTool,
  DrawingTool,
  EllipseTool,
  EraserTool,
  ImageTool,
  LineTool,
  RectTool,
  SelectTool,
  TextTool,
} from '@pictode/tools';

import eraserRect from '@/assets/images/eraser-rect.svg';
import RadioGroup from '@/components/RadioGroup.vue';
import RadioGroupOption from '@/components/RadioGroupOption.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import usePictode from '@/hooks/usePictode';

const { app } = usePictode();

interface ToolInfo {
  icon: string;
  name: string;
  tool: Tool | (() => Tool);
}

const selectTool = new SelectTool({
  hooks: {
    onActive(app) {
      app.getPlugin('selectorPlugin')?.enable?.();
    },
    onInactive(app) {
      app.getPlugin('selectorPlugin')?.disable?.();
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
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
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
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
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
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
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
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
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
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
        },
      }),
  },
  {
    icon: 'picture',
    name: 'imageTool',
    tool: () =>
      new ImageTool({
        hooks: {
          async onActive(app, tool) {
            app.cancelSelect();
            const files = await util.selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE', '.svg'], false);
            const imgSrc = await util.readeFile<string>((reader) => reader.readAsDataURL(files[0]));
            (tool as ImageTool).imageElement.src = imgSrc;
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
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
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'eraser',
    name: 'eraserTool',
    tool: () =>
      new EraserTool({
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = `url(${eraserRect}), auto`;
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
        },
      }),
  },
];

const currentTool = ref<string>(tools[0].name);

watchEffect(() => {
  let tool = tools.find(({ name }) => name === currentTool.value)?.tool;
  if (typeof tool === 'function') {
    tool = tool();
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
