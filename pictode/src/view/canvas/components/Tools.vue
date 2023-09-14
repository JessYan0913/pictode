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
import { injectStrict } from '@pictode/vue-aide';

import eraserRect from '@/assets/images/eraser-rect.svg';
import RadioGroup from '@/components/RadioGroup.vue';
import RadioGroupOption from '@/components/RadioGroupOption.vue';
import { PictodeAppKey } from '@/constants/inject-key';

const app = injectStrict(PictodeAppKey);

interface ToolInfo {
  icon: string;
  name: string;
  title: string;
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
    title: '选择',
    tool: selectTool,
  },
  {
    icon: 'rectangle',
    name: 'rectTool',
    title: '矩形',
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
    title: '椭圆',
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
    title: '菱形',
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
    title: '线条',
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
    title: '自由书写',
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
    title: '图片',
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
    title: '文本',
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
    title: '橡皮擦',
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
    <RadioGroupOption v-for="(item, index) in tools" :key="index" :value="item.name" :title="item.title">
      <iconpark-icon
        :name="item.icon"
        :stroke="currentTool === item.name ? 'rgb(101, 166, 251)' : '#333'"
        :fill="currentTool === item.name ? 'rgb(101, 166, 251)' : 'none'"
      ></iconpark-icon>
    </RadioGroupOption>
  </RadioGroup>
</template>
